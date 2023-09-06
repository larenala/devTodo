import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { CreateTodo, Priority, TaskTodo } from './types';

const app = express();

app.use(cors());

app.use(express.json());


app.get('/', (__request, response) => {
  return response.send('version 1');
});

app.get('/api/todos', (__request, response) => {
  fs.readFile('./todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    return response.json(JSON.parse(data));
  });
});


const addId = (todo: CreateTodo): TaskTodo => {
  const id = randomUUID();
  return { 
    ...todo, 
    id,
    date: new Date(),
    done: false, 
  };
};

const parseString = (stringToParse: unknown) => {
  if (typeof stringToParse !== 'string') {
    throw new Error('Task name must be a string');
  }
  return stringToParse;
};

const isPriority = (prio: unknown): prio is Priority => {
  if (typeof prio != 'number') throw new Error('Wrong data type.'); 
  return Object.values(Priority).map((p) => p).includes(prio);
};


const validateTodoFields = (todo: unknown): CreateTodo => {
  if (typeof todo != 'object' || !todo) throw new Error('There was a problem with data.');
  if (!('task' in todo)) throw new Error('Task is a required field.');
  return {
    task: parseString(todo.task),
    priority: 'priority' in todo && isPriority(todo.priority) ? todo.priority : Priority.Medium,
  };
};

app.post('/api/todos', (request, response) => {
  const todo = validateTodoFields(request.body);
  if (!todo) {
    return response.status(400).json({ error: 'Task name is required.' });
  }
  const todoWithId = addId(todo);
  fs.readFile('./todos.json', 'utf8', (err, data: string) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData: TaskTodo[] = JSON.parse(data);
    const todos = jsonData.concat(todoWithId);
    fs.writeFile('./todos.json', JSON.stringify(todos), err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  });
  return response.json(todo);
});

app.put('/api/todos/:id', (request, response) => {
  const id = request.params.id;
  const updatedTodo: TaskTodo = request.body;
  let todos: TaskTodo[] = [];
  fs.readFile('./todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData: TaskTodo[] = JSON.parse(data);
    jsonData.map((item: TaskTodo) => {
      if (item.id == id) {
        todos = todos.concat(updatedTodo);
      } else {
        todos = todos.concat(item);
      }
    });
    fs.writeFile('./todos.json', JSON.stringify(todos), err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  });

  return response.json(todos);

});

app.put('/api/todos', (request, response) => {
  const ids: string[] = request.body;
  let todos: TaskTodo[] = [];
  fs.readFile('./todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData: TaskTodo[] = JSON.parse(data);
    jsonData.map((item: TaskTodo) => {
      if (ids.includes(item.id)) {
        item.date = new Date();
        todos = todos.concat(item);
      } else {
        todos = todos.concat(item);
      }
    });

    fs.writeFile('./todos.json', JSON.stringify(todos), err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  });

  return response.json(todos);
});

app.delete('/api/todos/:id', (request, response) => {
  const id = request.params.id;
  let todos: TaskTodo[] = [];
  fs.readFile('./todos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData: TaskTodo[] = JSON.parse(data);
    todos = jsonData.filter((todo: TaskTodo) => todo.id !== id);
    fs.writeFile('./todos.json', JSON.stringify(todos), err => {
      if (err) {
        console.error(err);
      }
      return response.status(204).end();
    });
  });
});

const PORT = 8080;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

