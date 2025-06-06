import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// crear provincia [POST]
export const createProvince = async (req: Request, res: Response): Promise<void> => {
    try {

        const { nombre, paisId } = req.body

        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return;
        }
        
        if (!paisId) {
            res.status(400).json({
                message: 'El id del pais es obligatorio'
            })
            return;
        }
        
        const pais = await prisma.pais.findUnique({
            where: { id: paisId },
        });
        
        if (!pais || pais.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar un país inactivo a una provincia' 
            });
            return;
        }

        const province = await prisma.provincia.create(
            {
                data: {
                    nombre,
                    paisId
                }
            }
        )

        res.status(201).json(province)

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

// traer todas las provincias [GET-ALL]
export const getAllProvinces = async (req: Request, res: Response): Promise<void> => {
    try {
        const provinces = await prisma.provincia.findMany({
            where: {
                isActive: true
            },
            include: {
                pais: true,
                localidades: {
                    include: {
                        direcciones: true,
                    },
                },
            },
        });
        res.status(200).json(provinces);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer provincia por id [GET-BY-ID]
export const getProvinceById = async (req: Request, res: Response): Promise<void> => {

    const provinceId = parseInt(req.params.id);

    try {

        const province = await prisma.provincia.findUnique({
            where: {
                id: provinceId,
                isActive: true
            },
            include: {
                pais: true,
                localidades: {
                    include: {
                        direcciones: true,
                    },
                },
            },
        })

        if (!province) {
            res.status(404).json({
                error: 'La provincia no fue encontrado'
            })
            return;
        }

        res.status(200).json(province);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar una provincia [PUT]
export const updateProvince = async (req: Request, res: Response): Promise<void> => {

    const provinceId = parseInt(req.params.id);
    const { nombre, paisId } = req.body;

    try {

        const province = await prisma.provincia.findUnique({
            where: { id: provinceId }
        });

        if (!province || !province.isActive) {
            res.status(400).json({
                message: `La provincia ${provinceId} fue eliminada o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        if (paisId) {
            const pais = await prisma.pais.findUnique({
                where: { id: paisId },
            });
            
            if (!pais || pais.isActive === false) {
                res.status(400).json({ 
                    message: 'No se puede asignar un país inactivo a una provincia' 
                });
                return;
            }

            dataToUpdate.paisId = paisId;
        }

        const updatedProvince = await prisma.provincia.update({
            where: {
                id: provinceId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedProvince);

    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({
                error: 'El nombre ingresado ya existe'
            })
        } else if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Provincia no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar una provincia [DELETE]
export const deleteProvince = async (req: Request, res: Response): Promise<void> => {

    const provinceId = parseInt(req.params.id);

    try {

        await prisma.provincia.update({
            where: {
                id: provinceId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `La provincia ${provinceId} fue eliminada`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Provincia no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}