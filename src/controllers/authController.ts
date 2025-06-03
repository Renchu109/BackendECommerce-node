import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from '../models/user';
import { generateToken } from "../services/auth.service";
import { Rol } from "@prisma/client";


export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username, nombre, apellido, dni } = req.body

    try {

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
        
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword,
                    username,
                    nombre,
                    apellido,
                    dni,
                    rol: Rol.CLIENTE
                }
            }
        )

        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta.target.includes('email')) {
            res.status(400).json({
                message: 'El mail ingresado ya existe'
            })
        }

        console.log(error);
        res.status(500).json({ error: 'Hubo un error en el registro' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    try {

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

        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({
                error: 'Usuario no encontrado'
            })
            return
        }

        const passwordMatch = await comparePasswords(password, user.password)

        if (!passwordMatch) {
            res.status(401).json({
                error: "Usuario y contraseña no coinciden"
            })
        }

        const token = generateToken(user)
        res.status(200).json({ token })

    } catch (error) {
        console.log("Error: ", error);
    }
}