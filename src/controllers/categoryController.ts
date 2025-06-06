import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import categoria from "../models/category";

const prisma = new PrismaClient();


// crear categoría [POST]
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {

        const { nombre, categoriaPadreId, productoId } = req.body

        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return
        }

        if (categoriaPadreId) {
            const categoria = await prisma.categoria.findUnique({
                where: { id: categoriaPadreId },
            });

            if (!categoria || categoria.isActive === false) {
                res.status(400).json({
                    message: 'No se puede asignar una categoría padre inactiva a una subcategoría'
                });
                return;
            }
        }

        const category = await prisma.categoria.create(
            {
                data: {
                    nombre,
                    categoriaPadreId
                }
            }
        )

        if (productoId) {
            const producto = await prisma.producto.findUnique({
                where: {
                    id: productoId
                }
            });
            if (!producto) {
                res.status(404).json({
                    message: 'Producto no encontrado'
                });
                return;
            }

            await prisma.productoCategoria.create({
                data: {
                    productoId,
                    categoriaId: category.id,
                },
            });
        }

        res.status(201).json(category)

    } catch (error: any) {


        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las categorías [GET-ALL]
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.categoria.findMany({
            where: {
                isActive: true
            },
            include: {
                subcategorias: {
                    include: {
                        productoCategorias: {
                            include: {
                                producto: true
                            }
                        }
                    }
                },
                productoCategorias: {
                    include: {
                        producto: true
                    }
                }
            }
        });
        res.status(200).json(categories);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// traer categoría por id [GET-BY-ID]
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {

    const categoryId = parseInt(req.params.id);

    try {

        const category = await prisma.categoria.findUnique({
            where: {
                id: categoryId,
                isActive: true
            },
            include: {
                subcategorias: {
                    include: {
                        productoCategorias: {
                            include: {
                                producto: true
                            }
                        }
                    }
                },
                productoCategorias: {
                    include: {
                        producto: true
                    }
                }
            }
        })

        if (!category) {
            res.status(404).json({
                error: 'La categoría no fue encontrada'
            })
            return;
        }

        res.status(200).json(category);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

// editar una categoría [PUT]
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const categoryId = parseInt(req.params.id);
    const { nombre, categoriaPadreId, productoId } = req.body;

    try {
        const category = await prisma.categoria.findUnique({
            where: { id: categoryId },
        });

        if (!category || !category.isActive) {
            res.status(400).json({
                message: `La categoría ${categoryId} fue eliminada o no existe, y no se puede editar.`,
            });
            return;
        }

        const dataToUpdate: any = {};

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        if (categoriaPadreId) {
            const categoriaPadre = await prisma.categoria.findUnique({
                where: { id: categoriaPadreId },
            });

            if (!categoriaPadre || !categoriaPadre.isActive) {
                res.status(400).json({
                    message: 'No se puede asignar una categoría padre inactiva a una subcategoría',
                });
                return;
            }

            dataToUpdate.categoriaPadreId = categoriaPadreId;
        }

        if (productoId) {
            const producto = await prisma.categoria.findUnique({
                where: { id: productoId },
            });

            if (!producto || !producto.isActive) {
                res.status(400).json({
                    message: 'No se puede asignar un producto inactivo a una subcategoría',
                });
                return;
            }

            dataToUpdate.productoId = productoId;
        }

        const updatedCategory = await prisma.categoria.update({
            where: { id: categoryId },
            data: dataToUpdate,
        });

        res.status(200).json(updatedCategory);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(400).json({ error: 'Categoría no encontrada' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

// eliminar una categoría [DELETE]
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {

    const categoryId = parseInt(req.params.id);

    try {

        await prisma.categoria.update({
            where: {
                id: categoryId
            },
            data: {
                isActive: false
            }
        })

        res.status(200).json({
            message: `La categoría ${categoryId} fue eliminada`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(400).json({
                error: 'Categoría no encontrada'
            })
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}