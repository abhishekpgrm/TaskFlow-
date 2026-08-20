import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { projectId?: string; status?: string }) {
    const where: any = { parentId: null };
    if (query.projectId) where.projectId = query.projectId;
    if (query.status) where.status = query.status;

    return this.prisma.task.findMany({
      where,
      include: {
        assignee: true,
        _count: { select: { subtasks: true, comments: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        reporter: true,
        project: true,
        subtasks: {
          include: {
            assignee: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        comments: {
          include: {
            author: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'NO_PRIORITY',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        labels: dto.labels || [],
        projectId: dto.projectId,
        assigneeId: dto.assigneeId || null,
        reporterId: userId,
        parentId: dto.parentId || null,
      },
      include: {
        assignee: true,
        _count: { select: { subtasks: true, comments: true } },
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const data: any = { ...dto };
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);

    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: true,
        reporter: true,
        subtasks: { include: { assignee: true } },
        comments: { include: { author: true } },
      },
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    await this.prisma.comment.deleteMany({ where: { taskId: id } });
    await this.prisma.task.deleteMany({ where: { parentId: id } });
    return this.prisma.task.delete({ where: { id } });
  }
}
