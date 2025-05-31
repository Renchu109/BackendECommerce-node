import express from "express";
import {
  getAllLocalities,
  getLocalityById,
  createLocality,
  updateLocality,
  deleteLocality,
} from "../controllers/localityController";

const router = express.Router();

router.get("/", getAllLocalities);
router.get("/:id", getLocalityById);
router.post("/", createLocality);
router.put("/:id", updateLocality);
router.delete("/:id", deleteLocality);

export default router;
