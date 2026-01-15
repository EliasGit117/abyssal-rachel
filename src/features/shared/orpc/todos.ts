import { ORPCError } from '@orpc/server';
import * as z from 'zod';
import { authMiddleware, base } from '@/orpc/base.ts';
import { getLocale } from '@/paraglide/runtime';

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' }
];

export const TodoSchema = z.object({
  id: z.number().int().min(1),
  name: z.string()
});

const todosBase = base.route({ tags: ['todos'] });

export const listTodos = todosBase
  .route({ method: 'GET', path: '/todos', description: 'List todos' })
  .input(z.object({}))
  .output(z.array(TodoSchema))
  .handler(() => todos.map(item => ({ ...item, name: getLocale() })));

export const addTodo = todosBase
  .use(authMiddleware)
  .route({
    method: 'POST',
    path: '/todos',
    description: 'Create todo',
    successStatus: 201
  })
  .input(z.object({ name: z.string() }))
  .output(TodoSchema)
  .handler(({ input }) => {
    const newTodo = { id: todos.length + 1, name: input.name };
    todos.push(newTodo);
    return newTodo;
  });

export const deleteTodo = todosBase
  .route({
    method: 'DELETE',
    path: '/todos/{id}',
    description: 'Delete todo by id'
  })
  .input(z.object({ id: z.coerce.number().int().min(1) }))
  .output(TodoSchema)
  .handler(({ input }) => {
    const index = todos.findIndex((t) => t.id === input.id);
    if (index === -1) throw new ORPCError('NOT_FOUND');
    const [deleted] = todos.splice(index, 1);
    return deleted;
  });

export const todosRoutes = {
  list: listTodos,
  add: addTodo,
  delete: deleteTodo
};