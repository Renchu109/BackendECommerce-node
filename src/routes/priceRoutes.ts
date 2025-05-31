import express from "express";
import { createPrice, getAllPrices, getPriceById, updatePrice, deletePrice } from "../controllers/priceController";

const router = express.Router();

router.post('/', createPrice);
router.get('/', getAllPrices);
router.get('/:id', getPriceById);
router.put('/:id', updatePrice);
router.delete('/:id', deletePrice);

export default router