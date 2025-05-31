import { Rol } from '@prisma/client';

export interface IUsuario {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  password: string;
  email: string;
  dni: string;
  rol: Rol;
}
