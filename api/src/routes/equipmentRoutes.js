import express from "express";
import { validateEquipment } from "../middlewares/equipmentMiddleware.js";
import { equipmentController } from "../controllers/equipmentController.js";

const router = express.Router();

router.post(
  "/equipments",
  validateEquipment,
  equipmentController.createEquipment
);
router.get("/equipments", equipmentController.getEquipments);
router.get("/equipments/:id", equipmentController.getEquipmentById);
router.put(
  "/equipments/:id",
  validateEquipment,
  equipmentController.updateEquipment
);
router.delete("/equipments/:id", equipmentController.deleteEquipment);

export default router;
