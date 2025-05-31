import { Request, Response } from "express";
import prisma from '../models/category';


// crear categoría [POST]
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {

        const { nombre, categoriaPadreId } = req.body

        if (!nombre) {
            res.status(400).json({
                message: 'El nombre es obligatorio'
            })
            return
        }

        const category = await prisma.create(
            {
                data: {
                    nombre, 
                    categoriaPadreId
                }
            }
        )

        res.status(201).json(category)

    } catch (error: any) {


        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })

    }
}

// traer todas las categorías [GET-ALL]
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.findMany();
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

        const category = await prisma.findUnique({
            where: {
                id: categoryId
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
    const { nombre, categoriaPadreId } = req.body

    try {

        let dataToUpdate: any = { ...req.body }

        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        if (categoriaPadreId) {
            dataToUpdate.categoriaPadreId = categoriaPadreId;
        }

        const category = await prisma.update({
            where: {
                id: categoryId
            },
            data: dataToUpdate
        })

        res.status(200).json(category);

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

// eliminar una categoría [DELETE]
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {

    const categoryId = parseInt(req.params.id);

    try {
        
        await prisma.delete({
            where: {
                id: categoryId
            }
        })

        res.status(200).json({
            message: `La categoría ${categoryId} fue eliminada`
        }).end()

    } catch (error:any) {
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