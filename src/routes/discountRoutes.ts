import express from "express";
import { createDiscount, getAllDiscounts, getDiscountById, updateDiscount, deleteDiscount } from "../controllers/discountController";

const router = express.Router();

router.post('/', createDiscount);
router.get('/', getAllDiscounts);
router.get('/:id', getDiscountById);
router.put('/:id', updateDiscount);
router.delete('/:id', deleteDiscount);

export default router