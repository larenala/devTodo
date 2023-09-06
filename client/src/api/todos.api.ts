import type { TaskTodo } from '@/types';
import axios from 'axios';

const todosEndpoint =  'http://localhost:8080/api/todos';


export const getAllTodos = async () => {
    const response = await axios.get(todosEndpoint);
    return response.data;    
}

export const addNewTodo = async (todo: any ) => {
    const response = await axios.post(todosEndpoint, { ...todo });
    return response.data;    
}

export const removeTodo = async (id: string) => {
    return await axios.delete(`${todosEndpoint}/${id}`);
}

export const updateTodo = async (updated: TaskTodo) => {
    return await axios.put(`${todosEndpoint}/${updated.id}`, { ...updated });
}

export const updateOldTodosDate = async (ids: string[]) => {
    return await axios.put(`${todosEndpoint}`, ids);
}