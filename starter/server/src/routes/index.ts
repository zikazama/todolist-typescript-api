import { Router } from 'express';

import {
  getTodos,
  getTodo,
  addTodo,
  updateTodo,
  removeTodo
} from '../controllers/todos/index';

const router = Router();

router.get('/api/todos', getTodos);

router.get('/api/todos/:id', getTodo);

router.post('/api/todos', addTodo);

router.put('/api/todos/:id', updateTodo);

router.delete('/api/todos/:id', removeTodo);

export default router;
