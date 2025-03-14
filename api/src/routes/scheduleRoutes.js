import express from "express";
import { scheduleController } from "../controllers/scheduleController.js";
import { validateScheduleInput } from "../middlewares/scheduleMiddleware.js";

const router = express.Router();

router.post(
  "/schedules",
  validateScheduleInput,
  scheduleController.createSchedule
);
router.get("/schedules", scheduleController.getSchedules);
router.get("/schedules/:id", scheduleController.getScheduleById);
router.put(
  "/schedules/:id",
  validateScheduleInput,
  scheduleController.updateSchedule
);
router.delete("/schedules/:id", scheduleController.deleteSchedule);
router.put("/schedules/:id/returned", scheduleController.markAsReturned);

export default router;
