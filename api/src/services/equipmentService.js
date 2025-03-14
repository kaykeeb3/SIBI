import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const equipmentService = {
  async getAllEquipments() {
    return await prisma.equipment.findMany();
  },

  async getEquipmentById(id) {
    return await prisma.equipment.findUnique({ where: { id } });
  },

  async createEquipment(data) {
    return await prisma.equipment.create({ data });
  },

  async updateEquipment(id, data) {
    return await prisma.equipment.update({
      where: { id },
      data,
    });
  },

  async deleteEquipment(id) {
    return await prisma.equipment.delete({ where: { id } });
  },

  async updateEquipmentQuantity(id, quantityChange) {
    const equipment = await prisma.equipment.findUnique({ where: { id } });

    if (!equipment) throw new Error("Equipment not found");

    const newQuantity = equipment.quantity + quantityChange;

    if (newQuantity < 0) throw new Error("Not enough equipment to return.");

    return await prisma.equipment.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  },
};
