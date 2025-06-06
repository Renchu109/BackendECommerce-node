-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CLIENTE');

-- CreateEnum
CREATE TYPE "Talle" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'talle_37', 'talle_38', 'talle_39', 'talle_40', 'talle_41', 'talle_42', 'talle_43', 'talle_44');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('AMARILLO', 'AZUL', 'BLANCO', 'GRIS', 'MARRON', 'NEGRO', 'ROJO', 'ROSADO', 'VERDE');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('HOMBRE', 'MUJER', 'UNISEX');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('CALZADO', 'INDUMENTARIA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" SERIAL NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "deptoNro" INTEGER NOT NULL,
    "codigoPostal" INTEGER NOT NULL,
    "localidadId" INTEGER NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidades" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "paisId" INTEGER NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paises" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_compra" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "fechaDeCompra" TIMESTAMP(3) NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "orden_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_compra_detalle" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "ordenCompraId" INTEGER NOT NULL,
    "detalleProductoId" INTEGER NOT NULL,

    CONSTRAINT "orden_compra_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalleProductos" (
    "id" SERIAL NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "talle" "Talle" NOT NULL,
    "color" "Color" NOT NULL,
    "marca" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "precioId" INTEGER NOT NULL,

    CONSTRAINT "detalleProductos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagen" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "detalleProductoId" INTEGER NOT NULL,

    CONSTRAINT "imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoriaPadreId" INTEGER,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "tipoProducto" "TipoProducto" NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto_categorias" (
    "productoId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "producto_categorias_pkey" PRIMARY KEY ("productoId","categoriaId")
);

-- CreateTable
CREATE TABLE "descuentos" (
    "id" SERIAL NOT NULL,
    "porcentaje" DOUBLE PRECISION,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_final" TIMESTAMP(3),

    CONSTRAINT "descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precios" (
    "id" SERIAL NOT NULL,
    "precio_compra" DOUBLE PRECISION NOT NULL,
    "precio_venta" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "precios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precioid_descuentoid" (
    "descuentoId" INTEGER NOT NULL,
    "precioId" INTEGER NOT NULL,

    CONSTRAINT "precioid_descuentoid_pkey" PRIMARY KEY ("descuentoId","precioId")
);

-- CreateTable
CREATE TABLE "_UsuarioDirecciones" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioDirecciones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_dni_key" ON "usuarios"("dni");

-- CreateIndex
CREATE INDEX "_UsuarioDirecciones_B_index" ON "_UsuarioDirecciones"("B");

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "localidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localidades" ADD CONSTRAINT "localidades_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provincias" ADD CONSTRAINT "provincias_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "paises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_compra" ADD CONSTRAINT "orden_compra_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_compra_detalle" ADD CONSTRAINT "orden_compra_detalle_detalleProductoId_fkey" FOREIGN KEY ("detalleProductoId") REFERENCES "detalleProductos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_compra_detalle" ADD CONSTRAINT "orden_compra_detalle_ordenCompraId_fkey" FOREIGN KEY ("ordenCompraId") REFERENCES "orden_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalleProductos" ADD CONSTRAINT "detalleProductos_precioId_fkey" FOREIGN KEY ("precioId") REFERENCES "precios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalleProductos" ADD CONSTRAINT "detalleProductos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagen" ADD CONSTRAINT "imagen_detalleProductoId_fkey" FOREIGN KEY ("detalleProductoId") REFERENCES "detalleProductos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoriaPadreId_fkey" FOREIGN KEY ("categoriaPadreId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_categorias" ADD CONSTRAINT "producto_categorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_categorias" ADD CONSTRAINT "producto_categorias_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precioid_descuentoid" ADD CONSTRAINT "precioid_descuentoid_descuentoId_fkey" FOREIGN KEY ("descuentoId") REFERENCES "descuentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precioid_descuentoid" ADD CONSTRAINT "precioid_descuentoid_precioId_fkey" FOREIGN KEY ("precioId") REFERENCES "precios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioDirecciones" ADD CONSTRAINT "_UsuarioDirecciones_A_fkey" FOREIGN KEY ("A") REFERENCES "direcciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioDirecciones" ADD CONSTRAINT "_UsuarioDirecciones_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
