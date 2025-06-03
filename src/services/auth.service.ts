import { Usuario } from "@prisma/client";
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const generateToken = (user: Usuario): string => {
    return jwt.sign({ id:user.id, email:user.email, rol:user.rol }, JWT_SECRET, {expiresIn: "1h"});
}   

