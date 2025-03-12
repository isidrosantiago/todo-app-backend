import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse } from './types/task-response.interface';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';
import { UserId } from 'src/auth/decorators/user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createTaskDto: CreateTaskDto,
    @UserId() userId: string,
  ): Promise<TaskResponse> {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@UserId() userId: string): Promise<TaskResponse> {
    return this.tasksService.findAll(userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @UserId() userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @UserId() userId: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.tasksService.remove(userId, id);
  }
}
