import { createDiscount, getAllDiscounts, getDiscountById, updateDiscount, deleteDiscount } from "../controllers/discountController";
import express, { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { Rol } from "@prisma/client";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

// Middleware de JWT para ver si estamos autenticados

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        res.status(401).json({
            error: "No autorizado, se requiere un Token de acceso"
        })
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) {
            console.error('Error en la autenticación: ',err);
            return res.status(403).json({
                error: 'No tienes acceso a este recurso'
            })
        }

        
        // Acceso a recursos solo para administradores
        try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string, rol: Rol };

        if (decoded.rol !== Rol.ADMIN) {
            return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
        }

    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }

        next();
    })
}

router.post('/', authenticateToken, createDiscount);
router.get('/', authenticateToken, getAllDiscounts);
router.get('/:id', authenticateToken, getDiscountById);
router.put('/:id', authenticateToken, updateDiscount);
router.delete('/:id', authenticateToken, deleteDiscount);

export default router