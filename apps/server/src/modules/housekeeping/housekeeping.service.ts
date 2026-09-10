import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export class HousekeepingService {
  static async getRoomsHousekeeping() {
    return prisma.room.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        roomNumber: true,
        name: true,
        floor: true,
        housekeepingStatus: true,
        status: true,
        type: { select: { name: true } },
      },
      orderBy: { roomNumber: "asc" },
    });
  }

  static async updateRoomStatus(id: string, housekeepingStatus: string) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return prisma.room.update({
      where: { id },
      data: { housekeepingStatus },
      select: {
        id: true,
        roomNumber: true,
        name: true,
        housekeepingStatus: true,
      },
    });
  }

  static async getTasks() {
    const tasks = await prisma.housekeepingTask.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    const roomIds = tasks.map((t) => t.roomId);
    const rooms = await prisma.room.findMany({
      where: { id: { in: roomIds } },
      select: { id: true, roomNumber: true, name: true },
    });

    const roomMap = new Map(rooms.map((r) => [r.id, r]));

    return tasks.map((t) => ({
      ...t,
      room: roomMap.get(t.roomId) || { roomNumber: "N/A", name: "Suite" },
    }));
  }

  static async createTask(data: {
    roomId: string;
    task: string;
    assignedTo?: string;
    priority?: string;
    notes?: string;
    createdBy?: string;
  }) {
    return prisma.housekeepingTask.create({
      data: {
        roomId: data.roomId,
        task: data.task,
        assignedTo: data.assignedTo,
        priority: data.priority || "NORMAL",
        notes: data.notes,
        createdBy: data.createdBy || "ESTATE_ADMIN",
        status: "PENDING",
      },
    });
  }

  static async updateTask(id: string, data: { status?: string; notes?: string }) {
    const updateData: any = { ...data };
    if (data.status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    return prisma.housekeepingTask.update({
      where: { id },
      data: updateData,
    });
  }
}
