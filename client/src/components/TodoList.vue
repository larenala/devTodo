<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import * as todosApi from '../api/todos.api';
import { type TaskTodo } from '../types';

const todoList = ref<TaskTodo[]>();
const oldTodoList = ref<TaskTodo[]>();
const taskName = ref<string>();
const taskPriority = ref<string>('2');

const isSameDate = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

watchEffect(async () => {
   const res = await todosApi.getAllTodos();
   const today = new Date().toUTCString()
   const startOFDay = new Date(`${today}`)
   todoList.value = res
    .filter((item: TaskTodo) => isSameDate(new Date(item.date), startOFDay))
    .sort((a: TaskTodo, b: TaskTodo) => {
        return Number(a.priority) - Number(b.priority) 
   })
   .sort((a: TaskTodo, b: TaskTodo) => {
        return Number(a.done) - Number(b.done);
    });
   oldTodoList.value = res
    .filter((item: TaskTodo) => !isSameDate(new Date(item.date), startOFDay))
})

const addNewTodo = async () => {
    const createdTodo = {
        task: taskName.value,
        priority: Number(taskPriority.value),
    }
    const todoFromBackend = await todosApi.addNewTodo(createdTodo);
    todoList.value = todoList.value?.concat(todoFromBackend);
    taskName.value = '';
}

const removeTodo = (id: string) => {
    todosApi.removeTodo(id);
    todoList.value = todoList.value?.filter((val: TaskTodo) => val.id !== id);
}

const toggleMarkAsDone = (id: string) => {
    const thisTodo = todoList.value?.find(t => t.id == id);
    if (!thisTodo) return;
    thisTodo.done = !thisTodo.done;
    todosApi.updateTodo(thisTodo);
    todoList.value = todoList.value?.sort((a: TaskTodo, b: TaskTodo) => {
        return Number(a.priority) - Number(b.priority) 
   }).sort((a: TaskTodo, b: TaskTodo) => {
        return Number(a.done) - Number(b.done);
    });
}

const moveTasksToToday = () => {
    if (!oldTodoList.value) return;
    oldTodoList?.value.forEach(todo => {
        todo.date = new Date();
    })
    todosApi.updateOldTodosDate(oldTodoList.value.map(todo => todo.id));
    todoList.value = todoList.value?.concat(oldTodoList.value);
    oldTodoList.value = [];
}

</script>

<template>
    <div v-if="todoList">
        <div v-if="oldTodoList && oldTodoList?.length > 0" class="margin-bottom margin-top">
            <p>Aiemmilta päiviltä on jäänyt {{ oldTodoList.length }} tehtävää.</p>
            <button @click.prevent="moveTasksToToday">Siirrä tälle päivälle</button>
        </div>
        <h2>Tehtävää tänään {{ new Date().toLocaleDateString('fi-FI') }} </h2>
        <form @submit="addNewTodo">
            <label for="todoInput">
                Mitä pitää tehdä?
                <input id="todoInput" v-model="taskName"/>
            </label>
            <label for="todoPriorityInput">
                Prioriteetti
                <select id="todoPrioritySelect" v-model="taskPriority">
                    <option value="3">
                        Matala
                    </option>
                    <option value="2">
                        Perus
                    </option>
                    <option value="1">
                        Kiireellinen
                    </option>
                </select>
            </label>
            <button type="submit">Lisää</button>
        </form>
        <table>
            <thead>
                <td>Tehtävä</td>
                <td>Prioriteetti</td>
                <td>Valmis</td>
                <td>Poista</td>
            </thead>
            <tbody  v-if="todoList.length > 0">
                <tr v-for="todo in todoList" :key="todo.id">
                    <td class="long-td" :class="{ 'done-text-type': todo.done }">{{ todo.task }}</td>
                    <td>{{  todo.priority }}</td>
                    <td>
                        <input type="checkbox" @click="toggleMarkAsDone(todo.id)" :checked="todo.done" />
                    </td>
                    <td>
                        <button @click="removeTodo(todo.id)">Poista</button>
                    </td>
                </tr>
            </tbody>
            <span v-else class="long-td">Et ole vielä lisännyt tehtäviä</span>
        </table>
</div>
</template>

<style scoped>
    .done-text-type {
        text-decoration: line-through
    }
    form {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .margin-bottom {
        margin-bottom: 2em;
    }
    .margin-top {
        margin-top: 2em;
    }
    td {
        text-align: center;
        padding: 1em;
    }
    .long-td {
        width: 500px;
        text-align: left;
    }
    #todoInput {
        width: 320px;
    }
    p {
        margin: 1em auto;
    }
    input, select {
        padding: 0.3em;
        margin-left: 0.5em;
    }
    table {
        margin-top: 2em;
        min-width: 750px;
        border-bottom: 2px solid #eee;
    }
    thead {
        background-color: rgb(22, 214, 150);
        border-radius: 1%;
    }
    tr:nth-child(even) {
        background-color: #eee;
    }
</style>