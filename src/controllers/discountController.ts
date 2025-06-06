import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// crear descuento [POST]
export const createDiscount = async (req: Request, res: Response): Promise<void> => {
    try {

        const { porcentaje, fechaInicio, fechaFinal, precioId } = req.body

        const discount = await prisma.descuento.create(
            {
                data: {
                    porcentaje,
                    fechaInicio,
                    fechaFinal
                }
            }
        )

        if (precioId) {
            const precio = await prisma.precio.findUnique({
                where: {
                    id: precioId
                }
            });
            if (!precio) {
                res.status(404).json({
                    message: 'Precio no encontrado'
                });
                return;
            }

            await prisma.precioDescuento.create({
                data: {
                    precioId,
                    descuentoId: discount.id,
                },
            });
        }

        res.status(201).json(discount)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todos los descuentos [GET-ALL]
export const getAllDiscounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const discounts = await prisma.descuento.findMany({
            where: {
                isActive: true
            },
            include: {
                precioDescuentos: {
                    include: {
                        precio: {
                            include: {
                                detalleProductos: {
                                    include: {
                                        producto: true,
                                        imagenes: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json(discounts);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer descuento por id [GET-BY-ID]
export const getDiscountById = async (req: Request, res: Response): Promise<void> => {

    const discountId = parseInt(req.params.id);

    try {

        const discount = await prisma.descuento.findUnique({
            where: {
                id: discountId,
                isActive: true
            },
            include: {
                precioDescuentos: {
                    include: {
                        precio: {
                            include: {
                                detalleProductos: {
                                    include: {
                                        producto: true,
                                        imagenes: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!discount) {
            res.status(404).json({
                error: 'El descuento no fue encontrado'
            })
            return;
        }

        res.status(200).json(discount);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un descuento [PUT]
export const updateDiscount = async (req: Request, res: Response): Promise<void> => {

    const discountId = parseInt(req.params.id);
    const { porcentaje, fechaInicio, fechaFinal } = req.body;

    try {

        const discount = await prisma.descuento.findUnique({
            where: { id: discountId }
        });

        if (!discount || !discount.isActive) {
            res.status(400).json({
                message: `El descuento ${discountId} fue eliminado o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (porcentaje) {
            dataToUpdate.porcentaje = porcentaje;
        }

        if (fechaInicio) {
            dataToUpdate.fechaInicio = fechaInicio;
        }

        if (fechaFinal) {
            dataToUpdate.fechaFinal = fechaFinal;
        }

        const updatedDiscount = await prisma.descuento.update({
            where: {
                id: discountId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedDiscount);

    } catch (error: any) {

        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Descuento no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un descuento [DELETE]
export const deleteDiscount = async (req: Request, res: Response): Promise<void> => {

    const discountId = parseInt(req.params.id);

    try {

        await prisma.descuento.update({
            where: {
                id: discountId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `El descuento ${discountId} fue eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Descuento no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}