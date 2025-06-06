import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from '../models/user';


// crear usuario [POST]
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const { email, password, username, nombre, apellido, dni, rol } = req.body

        if (!password) {
            res.status(400).json({
                message: 'El password es obligatorio'
            })
            return
        }
        if (!email) {
            res.status(400).json({
                message: 'El email es obligatorio'
            })
            return
        }
        if (!username) {
            res.status(400).json({
                message: 'El nombre de usuario es obligatorio'
            })
            return
        }
        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return
        }
        if (!apellido) {
            res.status(400).json({
                message: 'El apellido es obligatorio'
            })
            return
        }
        if (!dni) {
            res.status(400).json({
                message: 'El dni es obligatorio'
            })
            return
        }
        if (!rol) {
            res.status(400).json({
                message: 'El rol es obligatorio'
            })
            return
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword,
                    username,
                    nombre,
                    apellido,
                    dni,
                    rol
                }
            }
        )

        res.status(201).json(user)

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta.target.includes('email')) {
            res.status(400).json({
                message: 'El mail ingresado ya existe'
            })
        }

        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todos los usuarios [GET-ALL]
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany({
            /*where: {
                isActive: true
            }*/
        });
        res.status(200).json(users);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer usuario por id [GET-BY-ID]
export const getUserById = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id);

    try {

        const user = await prisma.findUnique({
            where: {
                id: userId,
                isActive: true
            }
        })

        if (!user) {
            res.status(404).json({
                error: 'El usuario no fue encontrado'
            })
            return;
        }

        res.status(200).json(user);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar un usuario [PUT]
export const updateUser = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id);
    const { email, password } = req.body;

    
    try {

        const user = await prisma.findUnique({
        where: { id: userId }
        });

        if (!user || !user.isActive) {
            res.status(400).json({
                message: `El usuario ${userId} fue eliminado o no existe, y no se puede editar.`
            });
            return;
        }

        let dataToUpdate: any = { ...req.body }

        if (password) {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }

        if (email) {
            dataToUpdate.email = email;
        }

        const updatedUser = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(updatedUser);

    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({
                error: 'El email ingresado ya existe'
            })
        } else if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Usuario no encontrado'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

// eliminar un usuario [DELETE]
export const deleteUser = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id);

    try {
        
        await prisma.update({
            where: {
                id: userId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `El usuario ${userId} fue eliminado`
        }).end()

    } catch (error) {
        res.status(400).json({
            error: 'Usuario no encontrado'
        })
    }
}