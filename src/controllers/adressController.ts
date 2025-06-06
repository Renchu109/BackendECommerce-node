import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// crear direccion [POST]
export const createAdress = async (req: Request, res: Response): Promise<void> => {
    try {

        const { calle, numero, deptoNro, codigoPostal, localidadId, usuarioId } = req.body

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

        const localidad = await prisma.localidad.findUnique({
            where: { id: localidadId },
        });
        
        if (!localidad || localidad.isActive === false) {
            res.status(400).json({ 
                message: 'No se puede asignar una localidad inactiva a una dirección' 
            });
            return;
        }

        const adress = await prisma.direccion.create(
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

        if (usuarioId) {
            const user = await prisma.usuario.findUnique({
                where: {
                    id: usuarioId
                }
            });
            if (!user) {
                res.status(404).json({
                    message: 'Usuario no encontrado'
                });
                return;
            }

            await prisma.usuarioDireccion.create({
                data: {
                    usuarioId,
                    direccionId: adress.id,
                },
            });
        }

        res.status(201).json(adress)

    } catch (error: any) {

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las direcciones [GET-ALL]
export const getAllAdresses = async (req: Request, res: Response): Promise<void> => {
    try {
        const adresses = await prisma.direccion.findMany({
            where: {
                isActive: true
            },
            include: {
                localidad: {
                    include: {
                        provincia: {
                            include: {
                                pais: true
                            }
                        }
                    }
                },
                usuarioDirecciones: true,
                ordenes: {
                    include: {
                        detalles: {
                            include: {
                                detalleProducto: {
                                    include: {
                                        producto: {
                                            include: {
                                                productoCategorias: {
                                                    include: {
                                                        categoria: true
                                                    }
                                                }
                                            }
                                        },
                                        precio: true,
                                        imagenes: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
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

        const adress = await prisma.direccion.findUnique({
            where: {
                id: adressId,
                isActive: true
            },
            include: {
                localidad: {
                    include: {
                        provincia: {
                            include: {
                                pais: true
                            }
                        }
                    }
                },
                usuarioDirecciones: true,
                ordenes: {
                    include: {
                        detalles: {
                            include: {
                                detalleProducto: {
                                    include: {
                                        producto: {
                                            include: {
                                                productoCategorias: {
                                                    include: {
                                                        categoria: true
                                                    }
                                                }
                                            }
                                        },
                                        precio: true,
                                        imagenes: true
                                    }
                                }
                            }
                        }
                    }
                }
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
    const { calle, numero, deptoNro, codigoPostal, localidadId } = req.body

    try {

        const adress = await prisma.direccion.findUnique({
            where: { id: adressId }
        });

        if (!adress || !adress.isActive) {
            res.status(400).json({
                message: `La dirección ${adressId} fue eliminada o no existe, y no se puede editar.`
            });
            return;
        }

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

        if (localidadId) {
            dataToUpdate.localidadId = localidadId;
        }

        if(localidadId){

            const localidad = await prisma.localidad.findUnique({
                where: { id: localidadId },
            });
            
            if (!localidad || localidad.isActive === false) {
                res.status(400).json({ 
                    message: 'No se puede asignar una localidad inactiva a una dirección' 
                });
                return;
            }
        }

        const updatedAdress = await prisma.direccion.update({
            where: {
                id: adressId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedAdress);

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

        await prisma.direccion.update({
            where: {
                id: adressId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `La dirección ${adressId} fue eliminada`
        }).end()

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