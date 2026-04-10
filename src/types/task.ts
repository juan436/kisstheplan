export type TaskStatus = "done" | "pending" | "in-progress";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string;
  category?: string;
  stage?: string;
  notes?: string;
}
