import { Request, Response } from "express";
import prisma from '../models/image';


// crear imagen de producto [POST]
export const createImage = async (req: Request, res: Response): Promise<void> => {
    try {

        const { url, detalleProductoId } = req.body

        if (!url) {
            res.status(400).json({
                message: 'La url es obligatoria'
            })
            return
        }
        if (!detalleProductoId) {
            res.status(400).json({
                message: 'El id del detalle producto es obligatorio'
            })
            return
        }
        

        const image = await prisma.create(
            {
                data: {
                    url, 
                    detalleProductoId
                }
            }
        )

        res.status(201).json(image)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las imágenes [GET-ALL]
export const getAllImages = async (req: Request, res: Response): Promise<void> => {
    try {
        const images = await prisma.findMany({
            /*where: {
                isActive: true
            }*/
        });
        res.status(200).json(images);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer imagen por id [GET-BY-ID]
export const getImageById = async (req: Request, res: Response): Promise<void> => {

    const imageId = parseInt(req.params.id);

    try {

        const image = await prisma.findUnique({
            where: {
                id: imageId,
                isActive: true
            }
        })

        if (!image) {
            res.status(404).json({
                error: 'La imagen no fue enconrtada'
            })
            return;
        }

        res.status(200).json(image);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar una imagen [PUT]
export const updateImage = async (req: Request, res: Response): Promise<void> => {

    const imageId = parseInt(req.params.id);
    const { url, detalleProductoId } = req.body

    try {

        const image = await prisma.findUnique({
        where: { id: imageId }
        });

        if (!image || !image.isActive) {
            res.status(400).json({
                message: `La imagen ${imageId} fue eliminada o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (url) {
            dataToUpdate.url = url;
        }

        if (detalleProductoId) {
            dataToUpdate.detalleProductoId = detalleProductoId;
        }

        const updatedImage = await prisma.update({
            where: {
                id: imageId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedImage);

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Imagen no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar una imagen [DELETE]
export const deleteImage = async (req: Request, res: Response): Promise<void> => {

    const imageId = parseInt(req.params.id);

    try {
        
        await prisma.update({
            where: {
                id: imageId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `La imagen ${imageId} fue eliminada`
        }).end()

    } catch (error:any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Imagen no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}