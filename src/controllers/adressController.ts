import { Request, Response } from "express";
import prisma from '../models/adress';


// crear direccion [POST]
export const createAdress = async (req: Request, res: Response): Promise<void> => {
    try {

        const { calle, numero, deptoNro, codigoPostal, localidadId } = req.body

        if (!calle) {
            res.status(400).json({
                message: 'La calle es obligatoria'
            })
            return
        }
        if (!numero) {
            res.status(400).json({
                message: 'El número es obligatorio'
            })
            return
        }
        if (!deptoNro) {
            res.status(400).json({
                message: 'El número de departamento es obligatorio'
            })
            return
        }
        if (!codigoPostal) {
            res.status(400).json({
                message: 'El código postal es obligatorio'
            })
            return
        }
        if (!localidadId) {
            res.status(400).json({
                message: 'El id de la localidad es obligatorio'
            })
            return
        }

        const adress = await prisma.create(
            {
                data: {
                    calle, 
                    numero, 
                    deptoNro, 
                    codigoPostal, 
                    localidadId
                }
            }
        )

        res.status(201).json(adress)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las direcciones [GET-ALL]
export const getAllAdresses = async (req: Request, res: Response): Promise<void> => {
    try {
        const adresses = await prisma.findMany();
        res.status(200).json(adresses);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer dirección por id [GET-BY-ID]
export const getAdressById = async (req: Request, res: Response): Promise<void> => {

    const adressId = parseInt(req.params.id);

    try {

        const adress = await prisma.findUnique({
            where: {
                id: adressId
            }
        })

        if (!adress) {
            res.status(404).json({
                error: 'La dirección no fue encontrada'
            })
            return;
        }

        res.status(200).json(adress);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar una dirección [PUT]
export const updateAdress = async (req: Request, res: Response): Promise<void> => {

    const adressId = parseInt(req.params.id);
    const { calle, numero, deptoNro, codigoPostal } = req.body

    try {

        let dataToUpdate: any = { ...req.body }

        if (calle) {
            dataToUpdate.calle = calle;
        }

        if (numero) {
            dataToUpdate.numero = numero;
        }

        if (deptoNro) {
            dataToUpdate.deptoNro = deptoNro;
        }

        if (codigoPostal) {
            dataToUpdate.codigoPostal = codigoPostal;
        }


        const adress = await prisma.update({
            where: {
                id: adressId
            },
            data: dataToUpdate
        })

        res.status(200).json(adress);

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Dirección no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar una dirección [DELETE]
export const deleteAdress = async (req: Request, res: Response): Promise<void> => {

    const adressId = parseInt(req.params.id);

    try {
        
        await prisma.delete({
            where: {
                id: adressId
            }
        })

        res.status(200).json({
            message: `La dirección ${adressId} fue eliminada`
        }).end()

    } catch (error:any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Dirección no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}