import { Request, Response } from "express";
import prisma from '../models/country';


// crear pais [POST]
export const createCountry = async (req: Request, res: Response): Promise<void> => {
    try {

        const { nombre } = req.body

        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return
        }

        const country = await prisma.create(
            {
                data: {
                    nombre
                }
            }
        )

        res.status(201).json(country)

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

// traer todos los paises [GET-ALL]
export const getAllCountries = async (req: Request, res: Response): Promise<void> => {
    try {
        const countries = await prisma.findMany();
        res.status(200).json(countries);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer pais por id [GET-BY-ID]
export const getCountryById = async (req: Request, res: Response): Promise<void> => {

    const countryId = parseInt(req.params.id);

    try {

        const country = await prisma.findUnique({
            where: {
                id: countryId
            }
        })

        if (!country) {
            res.status(404).json({
                error: 'El pais no fue encontrado'
            })
            return;
        }

        res.status(200).json(country);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un pais [PUT]
export const updateCountry = async (req: Request, res: Response): Promise<void> => {

    const countryId = parseInt(req.params.id);
    const { nombre } = req.body;

    try {

        let dataToUpdate: any = { ...req.body }

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        const country = await prisma.update({
            where: {
                id: countryId
            },
            data: dataToUpdate
        })

        res.status(200).json(country);

    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({
                error: 'El nombre ingresado ya existe'
            })
        } else if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Pais no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un pais [DELETE]
export const deleteCountry = async (req: Request, res: Response): Promise<void> => {

    const countryId = parseInt(req.params.id);

    try {
        
        await prisma.delete({
            where: {
                id: countryId
            }
        })

        res.status(200).json({
            message: `El pais ${countryId} fue eliminado`
        }).end()

    } catch (error:any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Pais no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}