import { equipmentService } from "../services/equipmentService.js";
import { handleError } from "../utils/errorHandler.js";

export const equipmentController = {
  async getEquipments(req, res) {
    try {
      const equipments = await equipmentService.getAllEquipments();
      return res.status(200).json(equipments);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getEquipmentById(req, res) {
    try {
      const { id } = req.params;
      const equipment = await equipmentService.getEquipmentById(id);

      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      return res.status(200).json(equipment);
    } catch (error) {
      handleError(res, error);
    }
  },

  async createEquipment(req, res) {
    try {
      const { name, type, quantity } = req.body;

      if (!name || !type || !quantity) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newEquipment = await equipmentService.createEquipment(req.body);
      return res.status(201).json(newEquipment);
    } catch (error) {
      handleError(res, error);
    }
  },

  async updateEquipment(req, res) {
    try {
      const { id } = req.params;
      const updatedEquipment = await equipmentService.updateEquipment(
        id,
        req.body
      );
      return res.status(200).json(updatedEquipment);
    } catch (error) {
      handleError(res, error);
    }
  },

  async deleteEquipment(req, res) {
    try {
      const { id } = req.params;
      await equipmentService.deleteEquipment(id);
      return res
        .status(200)
        .json({ message: "Equipment successfully deleted" });
    } catch (error) {
      handleError(res, error);
    }
  },
};
