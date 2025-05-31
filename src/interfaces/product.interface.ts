import { Sexo, TipoProducto } from '@prisma/client';

export interface IProducto {
  id: number;
  nombre: string;
  sexo: Sexo;
  tipoProducto: TipoProducto;
}