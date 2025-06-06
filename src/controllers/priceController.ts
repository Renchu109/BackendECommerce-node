import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// crear precio [POST]
export const createPrice = async (req: Request, res: Response): Promise<void> => {
    try {

        const { precioCompra, precioVenta } = req.body

        if (!precioCompra) {
            res.status(400).json({
                message: 'El precio de compra es obligatorio'
            })
            return
        }

        if (!precioVenta) {
            res.status(400).json({
                message: 'El precio de venta es obligatorio'
            })
            return
        }

        const price = await prisma.precio.create(
            {
                data: {
                    precioCompra,
                    precioVenta
                }
            }
        )

        res.status(201).json(price)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todos los precios [GET-ALL]
export const getAllPrices = async (req: Request, res: Response): Promise<void> => {
    try {
        const prices = await prisma.precio.findMany({
            where: {
                isActive: true
            },
            include: {
                detalleProductos: {
                    include: {
                        producto: true,
                        imagenes: true,
                    },
                },
                precioDescuentos: {
                    include: {
                        descuento: true,
                    },
                },
            },
        });
        res.status(200).json(prices);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer precio por id [GET-BY-ID]
export const getPriceById = async (req: Request, res: Response): Promise<void> => {

    const priceId = parseInt(req.params.id);

    try {

        const price = await prisma.precio.findUnique({
            where: {
                id: priceId,
                isActive: true
            },
            include: {
                detalleProductos: {
                    include: {
                        producto: true,
                        imagenes: true,
                    },
                },
                precioDescuentos: {
                    include: {
                        descuento: true,
                    },
                },
            },
        })

        if (!price) {
            res.status(404).json({
                error: 'El precio no fue encontrado'
            })
            return;
        }

        res.status(200).json(price);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un precio [PUT]
export const updatePrice = async (req: Request, res: Response): Promise<void> => {

    const priceId = parseInt(req.params.id);
    const { precioCompra, precioVenta } = req.body;

    try {

        const price = await prisma.precio.findUnique({
            where: { id: priceId }
        });

        if (!price || !price.isActive) {
            res.status(400).json({
                message: `El precio ${priceId} fue eliminado o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (precioCompra) {
            dataToUpdate.precioCompra = precioCompra;
        }

        if (precioVenta) {
            dataToUpdate.precioVenta = precioVenta;
        }

        const updatedPrice = await prisma.precio.update({
            where: {
                id: priceId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedPrice);

    } catch (error: any) {

        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Precio no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un precio [DELETE]
export const deletePrice = async (req: Request, res: Response): Promise<void> => {

    const priceId = parseInt(req.params.id);

    try {

        await prisma.precio.update({
            where: {
                id: priceId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `El precio ${priceId} fue eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Precio no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}