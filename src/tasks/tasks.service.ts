import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Task } from '@prisma/client';
import { TaskResponse } from './types/task-response.interface';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponse> {
    try {
      const task = await this.databaseService.task.create({
        data: {
          ...createTaskDto,
          userId,
        },
      });

      return this.buildTaskResponse(task, 'Task created successfully');
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(userId: string): Promise<TaskResponse> {
    const tasks = await this.databaseService.task.findMany({
      where: { userId },
    });
    return this.buildTaskResponse(tasks, 'Tasks retrieved successfully');
  }

  async update(userId: string, id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await this.databaseService.task.update({
        where: { id, userId },
        data: {
          ...updateTaskDto,
        },
      });

      return this.buildTaskResponse(updatedTask, 'Task updated successfully');
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Task not found');
      }
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async remove(userId: string, id: number): Promise<{ message: string }> {
    try {
      await this.databaseService.task.delete({
        where: {
          id,
          userId,
        },
      });

      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Task not found');
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }

  private buildTaskResponse(
    task: Task | Task[],
    message: string,
  ): TaskResponse {
    return {
      message,
      task,
    };
  }
}
