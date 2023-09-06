export interface TaskTodo {
    id: string;
    task: string;
    priority?: Priority;
    date?: Date;
    done: boolean;
}

export type CreateTodo = Pick<TaskTodo, 'task' | 'priority'>;

export enum Priority {
    High = 1,
    Medium = 2,
    Low = 3
}
