import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { equipmentService } from "../services/equipmentService.js";

moment.locale("pt-br");
const prisma = new PrismaClient();

export const scheduleService = {
  async getAllSchedules(query) {
    const { date, location } = query;

    return await prisma.schedule.findMany({
      where: {
        returned: false,
        ...(date && { startDate: { contains: date } }),
        ...(location && { location: { contains: location } }),
      },
    });
  },

  async getScheduleById(id) {
    return await prisma.schedule.findUnique({ where: { id } });
  },

  async createSchedule(data) {
    const equipment = await prisma.equipment.findUnique({
      where: { id: data.equipmentId },
    });

    if (!equipment) throw new Error("Equipment not found");
    if (equipment.quantity < data.quantity)
      throw new Error("Not enough equipment available");

    const activeSchedulesCount = await prisma.schedule.count({
      where: { equipmentId: data.equipmentId, returned: false },
    });

    if (activeSchedulesCount >= equipment.quantity) {
      throw new Error(
        "The equipment already has the maximum active schedules."
      );
    }

    // Determinar o dia da semana a partir da data de início, se não for fornecido
    const startDateMoment = moment(data.startDate);
    let dayOfWeek = data.dayOfWeek;

    if (!dayOfWeek) {
      // Nomes dos dias em português
      const weekDaysPortuguese = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
      ];

      // Obtém o dia da semana (0-6, sendo 0 = domingo)
      const dayNumber = startDateMoment.day();
      dayOfWeek = weekDaysPortuguese[dayNumber];
    }

    const schedule = await prisma.schedule.create({
      data: {
        borrowerName: data.borrowerName,
        quantity: data.quantity,
        startDate: startDateMoment.toDate(),
        returnDate: moment(data.returnDate).toDate(),
        dayOfWeek: dayOfWeek,
        equipmentId: data.equipmentId,
        type: data.type || null,
        returned: false,
      },
    });

    await equipmentService.updateEquipmentQuantity(
      data.equipmentId,
      -data.quantity
    );
    return schedule;
  },

  async updateSchedule(id, data) {
    return await prisma.schedule.update({
      where: { id },
      data: {
        borrowerName: data.borrowerName,
        quantity: data.quantity,
        startDate: moment(data.startDate).toDate(),
        returnDate: moment(data.returnDate).toDate(),
        dayOfWeek: moment(data.startDate).format("dddd"),
        equipmentId: data.equipmentId,
        type: data.type || null,
      },
    });
  },

  async deleteSchedule(id) {
    return await prisma.schedule.delete({ where: { id } });
  },

  async markAsReturned(id) {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) throw new Error("Schedule not found");
    if (schedule.returned)
      throw new Error("This schedule has already been returned");

    await equipmentService.updateEquipmentQuantity(
      schedule.equipmentId,
      schedule.quantity
    );
    await this.deleteSchedule(id);

    return { message: "Schedule returned and deleted successfully" };
  },
};
