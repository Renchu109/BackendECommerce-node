import { Request, Response } from "express";
import prisma from '../models/buyOrder';


// crear orden de compra [POST]
export const createBuyOrder = async (req: Request, res: Response): Promise<void> => {
    try {

        const { total, fechaDeCompra, direccionId } = req.body

        if (!total) {
            res.status(400).json({
                message: 'El monto total es obligatorio'
            })
            return
        }
        if (!fechaDeCompra) {
            res.status(400).json({
                message: 'La fecha de compra es obligatoria'
            })
            return
        }
        if (!direccionId) {
            res.status(400).json({
                message: 'El id de la dirección es obligatorio'
            })
            return
        }

        const buyOrder = await prisma.create(
            {
                data: {
                    total, 
                    fechaDeCompra, 
                    direccionId
                }
            }
        )

        res.status(201).json(buyOrder)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las órdenes de compra [GET-ALL]
export const getAllBuyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyOrders = await prisma.findMany();
        res.status(200).json(buyOrders);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer orden de compra por id [GET-BY-ID]
export const getBuyOrderById = async (req: Request, res: Response): Promise<void> => {

    const buyOrderId = parseInt(req.params.id);

    try {

        const buyOrder = await prisma.findUnique({
            where: {
                id: buyOrderId
            }
        })

        if (!buyOrder) {
            res.status(404).json({
                error: 'La orden de compra no fue encontrada'
            })
            return;
        }

        res.status(200).json(buyOrder);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar una orden de compra [PUT]
export const updateBuyOrder = async (req: Request, res: Response): Promise<void> => {

    const buyOrderId = parseInt(req.params.id);
    const { total, fechaDeCompra, direccionId } = req.body

    try {

        let dataToUpdate: any = { ...req.body }

        if (total) {
            dataToUpdate.total = total;
        }

        if (fechaDeCompra) {
            dataToUpdate.fechaDeCompra = fechaDeCompra;
        }

        if (direccionId) {
            dataToUpdate.direccionId = direccionId;
        }


        const buyOrder = await prisma.update({
            where: {
                id: buyOrderId
            },
            data: dataToUpdate
        })

        res.status(200).json(buyOrder);

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Orden de compra no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar una orden de compra [DELETE]
export const deleteBuyOrder = async (req: Request, res: Response): Promise<void> => {

    const buyOrderId = parseInt(req.params.id);

    try {
        
        await prisma.delete({
            where: {
                id: buyOrderId
            }
        })

        res.status(200).json({
            message: `La orden de compra ${buyOrderId} fue eliminada`
        }).end()

    } catch (error:any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Orden de compra no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}