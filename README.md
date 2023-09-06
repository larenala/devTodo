# Todo App

This is a simple project to add developer todos in a list and tick them off one by one.

The project uses Vue with Typescript and Axios on the frontend. Backend is built using Node.js and Express.

Tasks are written to a file (todos.json) in server/.

There is a simple REST API at /api/todos with following actions:

- GET /api/todos: Get all the todos for the current day
- POST /api/todos:  Adds a new todo to today's list
- PUT /api/todos/:id: Update a todo's status to done
- PUT /api/todos: Updates dates on all todos to current date
- DELETE /api/todos/:id: Delete a todo by id

## Client - how to get running

In todoApp/client run the following to install the dependencies and start the project in development mode. 

```sh
npm install

npm run dev
```

The frontend should now be running at http://localhost:5173

To build the project, run

```sh
npm run build
```

## Server - how to get running

In todoApp/server run the following to install the dependencies and start the project in development mode. 

```sh
npm install

npm run dev
```

The server should be running at http://localhost:8080/. This path should return the current version.
