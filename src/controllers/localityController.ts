import { Request, Response } from "express";
import prisma from '../models/locality';


// crear localidad [POST]
export const createLocality = async (req: Request, res: Response): Promise<void> => {
    try {

        const { nombre, provinciaId } = req.body

        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return
        }

        if (!provinciaId) {
            res.status(400).json({
                message: 'El id de la provincia es obligatorio'
            })
            return
        }

        const locality = await prisma.create(
            {
                data: {
                    nombre,
                    provinciaId
                }
            }
        )

        res.status(201).json(locality)

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta.target.includes('nombre')) {
            res.status(400).json({
                message: 'El nombre ingresado ya existe'
            })
        }

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las localidades [GET-ALL]
export const getAllLocalities = async (req: Request, res: Response): Promise<void> => {
    try {
        const localities = await prisma.findMany();
        res.status(200).json(localities);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer localidad por id [GET-BY-ID]
export const getLocalityById = async (req: Request, res: Response): Promise<void> => {

    const localityId = parseInt(req.params.id);

    try {

        const locality = await prisma.findUnique({
            where: {
                id: localityId
            }
        })

        if (!locality) {
            res.status(404).json({
                error: 'La localidad no fue encontrado'
            })
            return;
        }

        res.status(200).json(locality);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar una localidad [PUT]
export const updateLocality = async (req: Request, res: Response): Promise<void> => {

    const localityId = parseInt(req.params.id);
    const { nombre, provinceId  } = req.body;

    try {

        let dataToUpdate: any = { ...req.body }

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        if (provinceId) {
            dataToUpdate.provinceId = provinceId;
        }

        const locality = await prisma.update({
            where: {
                id: localityId
            },
            data: dataToUpdate
        })

        res.status(200).json(locality);

    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({
                error: 'El nombre ingresado ya existe'
            })
        } else if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Localidad no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar una localidad [DELETE]
export const deleteLocality = async (req: Request, res: Response): Promise<void> => {

    const localityId = parseInt(req.params.id);

    try {
        
        await prisma.delete({
            where: {
                id: localityId
            }
        })

        res.status(200).json({
            message: `La localidad ${localityId} fue eliminada`
        }).end()

    } catch (error:any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Localidad no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}