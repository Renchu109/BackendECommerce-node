import { Talle, Color } from '@prisma/client';

export interface IDetalleProducto {
  id: number;
  estado: boolean;
  talle: Talle;
  color: Color;
  marca: string;
  stock: number;
  productoId: number;
  precioId: number;
  isActive: boolean;
}
