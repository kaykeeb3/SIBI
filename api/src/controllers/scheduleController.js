import { scheduleService } from "../services/scheduleService.js";
import { handleError } from "../utils/errorHandler.js";

export const scheduleController = {
  async createSchedule(req, res) {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
      return res.status(201).json(schedule);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getSchedules(req, res) {
    try {
      const schedules = await scheduleService.getAllSchedules(req.query);
      return res.status(200).json(schedules);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await scheduleService.getScheduleById(id);

      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      return res.status(200).json(schedule);
    } catch (error) {
      handleError(res, error);
    }
  },

  async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const updatedSchedule = await scheduleService.updateSchedule(
        id,
        req.body
      );
      return res.status(200).json(updatedSchedule);
    } catch (error) {
      handleError(res, error);
    }
  },

  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      await scheduleService.deleteSchedule(id);
      return res.status(200).json({ message: "Schedule successfully deleted" });
    } catch (error) {
      handleError(res, error);
    }
  },

  async markAsReturned(req, res) {
    try {
      const { id } = req.params;
      const updatedSchedule = await scheduleService.markAsReturned(id);
      return res.status(200).json(updatedSchedule);
    } catch (error) {
      handleError(res, error);
    }
  },
};
