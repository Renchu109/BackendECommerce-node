import express from "express";
import { createBuyOrderDetail, getAllBuyOrderDetails, getBuyOrderDetailById, updateBuyOrderDetail, deleteBuyOrderDetail } from "../controllers/buyOrderDetailController";

const router = express.Router();

router.post('/', createBuyOrderDetail);
router.get('/', getAllBuyOrderDetails);
router.get('/:id', getBuyOrderDetailById);
router.put('/:id', updateBuyOrderDetail);
router.delete('/:id', deleteBuyOrderDetail);

export default router