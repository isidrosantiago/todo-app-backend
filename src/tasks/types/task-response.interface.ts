import { Task } from '@prisma/client';

export interface TaskResponse {
  message: string;
  task: Task | Task[];
}
