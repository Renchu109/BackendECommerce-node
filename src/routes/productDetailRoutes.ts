import express from "express";
import { createProductDetail, getAllProductDetails, getProductDetailById, updateProductDetail, deleteProductDetail } from "../controllers/productDetailController";

const router = express.Router();

router.post('/', createProductDetail);
router.get('/', getAllProductDetails);
router.get('/:id', getProductDetailById);
router.put('/:id', updateProductDetail);
router.delete('/:id', deleteProductDetail);

export default router