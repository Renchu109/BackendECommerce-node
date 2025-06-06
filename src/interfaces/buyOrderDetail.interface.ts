export interface IOrdenCompraDetalle {
  id: number;
  cantidad: number;
  subtotal: number;
  ordenCompraId: number;
  detalleProductoId: number;
  isActive: boolean;
}
