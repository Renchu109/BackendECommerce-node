import { Rol } from "@prisma/client";

export interface JwtPayload {
    id: number;
    email: string;
    rol: Rol
}