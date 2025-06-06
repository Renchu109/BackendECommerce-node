import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


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

        const detalleProducto = await prisma.detalleProducto.findUnique({
            where: { id: detalleProductoId },
        });
        
        if (!detalleProducto || detalleProducto.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar un detalle de producto inactivo a una imagen' 
            });
            return;
        }

        const image = await prisma.imagen.create(
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
        const images = await prisma.imagen.findMany({
            where: {
                isActive: true
            },
            include: {
                detalleProducto: {
                    include: {
                        producto: true,
                        precio: true
                    },
                },
            },
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

        const image = await prisma.imagen.findUnique({
            where: {
                id: imageId,
                isActive: true
            },
            include: {
                detalleProducto: {
                    include: {
                        producto: true,
                        precio: true
                    },
                },
            },
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

        const image = await prisma.imagen.findUnique({
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
            const detalleProducto = await prisma.detalleProducto.findUnique({
                where: { id: detalleProductoId },
            });
            
            if (!detalleProducto || detalleProducto.isActive === false) {
                res.status(400).json({ 
                    message: 'No se puede asignar un detalle de producto inactivo a una imagen' 
                });
                return;
            }

            dataToUpdate.detalleProductoId = detalleProductoId;
        }

        const updatedImage = await prisma.imagen.update({
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

        await prisma.imagen.update({
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