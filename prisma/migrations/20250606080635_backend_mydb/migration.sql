/*
  Warnings:

  - You are about to drop the `_UsuarioDirecciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UsuarioDirecciones" DROP CONSTRAINT "_UsuarioDirecciones_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioDirecciones" DROP CONSTRAINT "_UsuarioDirecciones_B_fkey";

-- DropTable
DROP TABLE "_UsuarioDirecciones";

-- CreateTable
CREATE TABLE "usuario_direccion" (
    "usuarioId" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "usuario_direccion_pkey" PRIMARY KEY ("usuarioId","direccionId")
);

-- AddForeignKey
ALTER TABLE "usuario_direccion" ADD CONSTRAINT "usuario_direccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_direccion" ADD CONSTRAINT "usuario_direccion_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
