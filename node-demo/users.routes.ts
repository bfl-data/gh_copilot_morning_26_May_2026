import { Router } from 'express';

import { createUser } from './users.controller.js';

/**
 * Builds the users router.
 *
 * @returns An Express router that handles POST /users.
 * @example
 * app.use(usersRouter);
 */
export function createUsersRouter(): Router {
  const router = Router();
  router.post('/users', createUser);
  return router;
}

export const usersRouter = createUsersRouter();