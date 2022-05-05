import { Request, Response } from 'express';

import TodoModel from '../../models/todo';
import { Todo } from '../../types/todo';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const todos: Todo[] = await TodoModel.find();

  res.status(200).json({ todos });
};

export const getTodo = async (req: Request, res: Response): Promise<void> => {
  await TodoModel.findById(req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    } else {
      res.status(200).json({ result });
    }
  });
};

export const addTodo = async (req: Request, res: Response): Promise<void> => {
  const body: Pick<Todo, 'title' | 'status'> = req.body;

  if (!body.title || !body.status) {
    res.status(401).json({
      status: 401,
      errorMessage: 'validationError: complete the field'
    });

    return;
  }

  const newTodoModel = new TodoModel({
    title: body.title,
    status: body.status
  });

  const newTodo = await newTodoModel.save();
  const updateAllTodosAfterSave = await TodoModel.find();

  res.status(201).json({
    message: 'added todo',
    addedTodo: newTodo,
    allTodosAfterAddition: updateAllTodosAfterSave
  });
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    params: { id },
    body
  } = req;

  if (!body.title || !body.status || !id) {
    res.status(401).json({
      status: 401,
      errorMessage: 'validationError: complete the field'
    });

    return;
  }

  const updateTodo = await TodoModel.findByIdAndUpdate({ _id: id }, body);
  const updateAllTodosAfterUpdate = await TodoModel.find();

  if (!updateTodo) {
    res.status(501).json({
      status: 501,
      errorMessage: 'Failed to update'
    });

    return;
  }

  res.status(200).json({
    message: 'Todo successfully edited',
    updateTodo,
    todos: updateAllTodosAfterUpdate
  });
};

export const removeTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    params: { id }
  } = req;

  if (!id) {
    res.status(401).json({
      status: 401,
      errorMessage: 'validationError: complete the field'
    });

    return;
  }

  const removedTodo = await TodoModel.findByIdAndRemove(id);
  const updateAllTodosAfterUpdate = await TodoModel.find();

  if (!removedTodo) {
    res.status(501).json({
      status: 501,
      errorMessage: 'Failed to remove'
    });

    return;
  }

  res.status(200).json({
    message: 'Todo successfully removed',
    removedTodo,
    todos: updateAllTodosAfterUpdate
  });
};
