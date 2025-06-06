import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// crear detalle de producto [POST]
export const createProductDetail = async (req: Request, res: Response): Promise<void> => {
    try {

        const { estado, talle, color, marca, stock, productoId, precioId } = req.body

        if (!estado) {
            res.status(400).json({
                message: 'El estado del producto es obligatorio'
            })
            return
        }
        if (!talle) {
            res.status(400).json({
                message: 'El talle del producto es obligatorio'
            })
            return
        }
        if (!color) {
            res.status(400).json({
                message: 'El color del producto es obligatorio'
            })
            return
        }
        if (!marca) {
            res.status(400).json({
                message: 'La marca del producto es obligatoria'
            })
            return
        }
        if (!stock) {
            res.status(400).json({
                message: 'El stock del producto es obligatorio'
            })
            return
        }
        if (!productoId) {
            res.status(400).json({
                message: 'El id del producto es obligatorio'
            })
            return
        }
        if (!precioId) {
            res.status(400).json({
                message: 'El id del precio del producto es obligatorio'
            })
            return
        }

        const producto = await prisma.producto.findUnique({
            where: { id: productoId },
        });
        
        if (!producto || producto.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar un producto inactivo a un detalle de producto' 
            });
            return;
        }

        const precio = await prisma.precio.findUnique({
            where: { id: precioId },
        });
        
        if (!precio || precio.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar un detalle de producto inactivo a un detalle de producto' 
            });
            return;
        }

        const productDetail = await prisma.detalleProducto.create(
            {
                data: {
                    estado,
                    talle,
                    color,
                    marca,
                    stock,
                    productoId,
                    precioId
                }
            }
        )

        res.status(201).json(productDetail)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todos los detalles de producto [GET-ALL]
export const getAllProductDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const productDetails = await prisma.detalleProducto.findMany({
            where: {
                isActive: true
            },
            include: {
                producto: true,
                precio: true,
                imagenes: true,
                ordenes: {
                    include: {
                        ordenCompra: {
                            include: {
                                direccion: {
                                    include: {
                                        localidad: {
                                            include: {
                                                provincia: {
                                                    include: {
                                                        pais: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json(productDetails);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer detalle de producto por id [GET-BY-ID]
export const getProductDetailById = async (req: Request, res: Response): Promise<void> => {

    const productDetailId = parseInt(req.params.id);

    try {

        const productDetail = await prisma.detalleProducto.findUnique({
            where: {
                id: productDetailId,
                isActive: true
            },
            include: {
                producto: true,
                precio: true,
                imagenes: true,
                ordenes: {
                    include: {
                        ordenCompra: {
                            include: {
                                direccion: {
                                    include: {
                                        localidad: {
                                            include: {
                                                provincia: {
                                                    include: {
                                                        pais: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!productDetail) {
            res.status(404).json({
                error: 'El detalle de producto no fue encontrado'
            })
            return;
        }

        res.status(200).json(productDetail);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un detalle de producto [PUT]
export const updateProductDetail = async (req: Request, res: Response): Promise<void> => {

    const productDetailId = parseInt(req.params.id);
    const { estado, talle, color, marca, stock, productoId, precioId } = req.body

    try {

        const productDetail = await prisma.detalleProducto.findUnique({
            where: { id: productDetailId }
        });

        if (!productDetail || !productDetail.isActive) {
            res.status(400).json({
                message: `El detalle del producto ${productDetailId} fue eliminado o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (estado) {
            dataToUpdate.estado = estado;
        }

        if (talle) {
            dataToUpdate.talle = talle;
        }

        if (color) {
            dataToUpdate.color = color;
        }

        if (marca) {
            dataToUpdate.marca = marca;
        }

        if (stock) {
            dataToUpdate.stock = stock;
        }

        if (productoId) {
            const producto = await prisma.producto.findUnique({
            where: { id: productoId },
        });
        
        if (!producto || producto.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar un producto inactivo a un detalle de producto' 
            });
            return;
        }

            dataToUpdate.productoId = productoId;
        }

        if (precioId) {
            const precio = await prisma.precio.findUnique({
                where: { id: precioId },
            });
            
            if (!precio || precio.isActive === false) {
                res.status(400).json({ 
                    message: 'No se puede asignar un detalle de producto inactivo a un detalle de producto' 
                });
                return;
            }

            dataToUpdate.precioId = precioId;
        }

        const updatedProductDetail = await prisma.detalleProducto.update({
            where: {
                id: productDetailId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedProductDetail);

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Detalle de producto no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un detalle de producto [DELETE]
export const deleteProductDetail = async (req: Request, res: Response): Promise<void> => {

    const productDetailId = parseInt(req.params.id);

    try {

        await prisma.detalleProducto.update({
            where: {
                id: productDetailId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `El detalle de producto ${productDetailId} fue eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Detalle de producto no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}