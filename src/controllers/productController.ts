import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// crear producto [POST]
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {

        const { nombre, sexo, tipoProducto } = req.body

        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return
        }
        if (!sexo) {
            res.status(400).json({
                message: 'El sexo es obligatorio 🥵'
            })
            return
        }
        if (!tipoProducto) {
            res.status(400).json({
                message: 'El tipo de producto es obligatorio'
            })
            return
        }


        const product = await prisma.producto.create(
            {
                data: {
                    nombre,
                    sexo,
                    tipoProducto
                }
            }
        )

        res.status(201).json(product)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todos los productos [GET-ALL]
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.producto.findMany({
            where: {
                isActive: true
            },
            include: {
                detalleProductos: {
                    include: {
                        precio: true,
                        imagenes: true,
                        ordenes: {
                            include: {
                                ordenCompra: true
                            }
                        }
                    }
                },
                productoCategorias: {
                    include: {
                        categoria: true
                    }
                }
            }
        });
        res.status(200).json(products);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer producto por id [GET-BY-ID]
export const getProductById = async (req: Request, res: Response): Promise<void> => {

    const productId = parseInt(req.params.id);

    try {

        const product = await prisma.producto.findUnique({
            where: {
                id: productId,
                isActive: true
            },
            include: {
                detalleProductos: {
                    include: {
                        precio: true,
                        imagenes: true,
                        ordenes: {
                            include: {
                                ordenCompra: true
                            }
                        }
                    }
                },
                productoCategorias: {
                    include: {
                        categoria: true
                    }
                }
            }
        })

        if (!product) {
            res.status(404).json({
                error: 'El producto no fue encontrado'
            })
            return;
        }

        res.status(200).json(product);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un producto [PUT]
export const updateProduct = async (req: Request, res: Response): Promise<void> => {

    const productId = parseInt(req.params.id);
    const { nombre, sexo, tipoProducto } = req.body

    try {

        const product = await prisma.producto.findUnique({
            where: { id: productId }
        });

        if (!product || !product.isActive) {
            res.status(400).json({
                message: `El producto ${productId} fue eliminado o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        if (sexo) {
            dataToUpdate.sexo = sexo;
        }

        if (tipoProducto) {
            dataToUpdate.tipoProducto = tipoProducto;
        }

        const updatedProduct = await prisma.producto.update({
            where: {
                id: productId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedProduct);

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Producto no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un producto [DELETE]
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {

    const productId = parseInt(req.params.id);

    try {

        await prisma.producto.update({
            where: {
                id: productId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `El producto ${productId} fue eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Producto no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}