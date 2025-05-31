import { Usuario } from "@prisma/client";
import { IUsuario } from "../interfaces/user.interface";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const generateToken = (user: Usuario): string => {
    return jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, {expiresIn: "1h"});
}