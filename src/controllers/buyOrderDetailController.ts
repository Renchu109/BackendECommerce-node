import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// crear detalle de orden de compra [POST]
export const createBuyOrderDetail = async (req: Request, res: Response): Promise<void> => {
    try {

        const { cantidad, subtotal, ordenCompraId, detalleProductoId } = req.body

        if (!cantidad) {
            res.status(400).json({
                message: 'La cantidad del producto es obligatoria'
            })
            return
        }
        if (!subtotal) {
            res.status(400).json({
                message: 'El subtotal de la compra es obligatorio'
            })
            return
        }
        if (!ordenCompraId) {
            res.status(400).json({
                message: 'El id de la orden de comora es obligatorio'
            })
            return
        }
        if (!detalleProductoId) {
            res.status(400).json({
                message: 'El id del detalle del producto es obligatorio'
            })
            return
        }

        const detalleProducto = await prisma.detalleProducto.findUnique({
            where: { id: detalleProductoId },
        });
        
        if (!detalleProducto || detalleProducto.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar un detalle de producto inactivo a un detalle de orden de compra' 
            });
            return;
        }

        const buyOrderDetail = await prisma.ordenCompraDetalle.create(
            {
                data: {
                    cantidad,
                    subtotal,
                    ordenCompraId,
                    detalleProductoId
                }
            }
        )

        res.status(201).json(buyOrderDetail)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todos los detalles de órdenes de compra [GET-ALL]
export const getAllBuyOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyOrderDetails = await prisma.ordenCompraDetalle.findMany({
            where: {
                isActive: true
            },
            include: {
                detalleProducto: {
                    include: {
                        producto: true,
                        precio: true,
                        imagenes: true,
                    },
                },
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
        });
        res.status(200).json(buyOrderDetails);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer detalle de orden de compra por id [GET-BY-ID]
export const getBuyOrderDetailById = async (req: Request, res: Response): Promise<void> => {

    const buyOrderDetailId = parseInt(req.params.id);

    try {

        const buyOrderDetail = await prisma.ordenCompraDetalle.findUnique({
            where: {
                id: buyOrderDetailId,
                isActive: true
            },
            include: {
                detalleProducto: {
                    include: {
                        producto: true,
                        precio: true,
                        imagenes: true,
                    },
                },
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
        })

        if (!buyOrderDetail) {
            res.status(404).json({
                error: 'El detalle de orden de compra no fue encontrado'
            })
            return;
        }

        res.status(200).json(buyOrderDetail);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un detalle de orden de compra [PUT]
export const updateBuyOrderDetail = async (req: Request, res: Response): Promise<void> => {

    const buyOrderDetailId = parseInt(req.params.id);
    const { cantidad, subtotal, ordenCompraId, detalleProductoId } = req.body

    try {

        const buyOrderDetail = await prisma.ordenCompraDetalle.findUnique({
            where: { id: buyOrderDetailId }
        });

        if (!buyOrderDetail || !buyOrderDetail.isActive) {
            res.status(400).json({
                message: `El detalle de orden de compra ${buyOrderDetailId} fue eliminado o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (cantidad) {
            dataToUpdate.cantidad = cantidad;
        }

        if (subtotal) {
            dataToUpdate.subtotal = subtotal;
        }

        if (ordenCompraId) {
            dataToUpdate.ordenCompraId = ordenCompraId;
        }

        if (detalleProductoId) {
            const detalleProducto = await prisma.detalleProducto.findUnique({
                where: { id: detalleProductoId },
            });
            
            if (!detalleProducto || detalleProducto.isActive === false) {
                res.status(400).json({ 
                    message: 'No se puede asignar un detalle de producto inactivo a un detalle de orden de compra' 
                });
                return;
            }

            dataToUpdate.detalleProductoId = detalleProductoId;
        }

        const updatedBuyOrderDetail = await prisma.ordenCompraDetalle.update({
            where: {
                id: buyOrderDetailId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedBuyOrderDetail);

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Detalle de orden de compra no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un detalle de orden de compra [DELETE]
export const deleteBuyOrderDetail = async (req: Request, res: Response): Promise<void> => {

    const buyOrderDetailId = parseInt(req.params.id);

    try {

        await prisma.ordenCompraDetalle.update({
            where: {
                id: buyOrderDetailId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `El detalle de orden de compra ${buyOrderDetailId} fue eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Detalle de orden de compra no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}