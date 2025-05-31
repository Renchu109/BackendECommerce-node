import express from "express";
import { createBuyOrder, getAllBuyOrders, getBuyOrderById, updateBuyOrder, deleteBuyOrder } from "../controllers/buyOrderController";

const router = express.Router();

router.post('/', createBuyOrder);
router.get('/', getAllBuyOrders);
router.get('/:id', getBuyOrderById);
router.put('/:id', updateBuyOrder);
router.delete('/:id', deleteBuyOrder);

export default router