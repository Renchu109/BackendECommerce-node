import express from "express";
import { createAdress, getAllAdresses, getAdressById, updateAdress, deleteAdress } from "../controllers/adressController";

const router = express.Router();

router.post('/', createAdress);
router.get('/', getAllAdresses);
router.get('/:id', getAdressById);
router.put('/:id', updateAdress);
router.delete('/:id', deleteAdress);

export default router