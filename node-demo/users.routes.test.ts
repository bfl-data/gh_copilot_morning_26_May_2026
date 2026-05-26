import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createUser } from './users.controller.js';
import { createUsersRouter, usersRouter } from './users.routes.js';

type RouteLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean | undefined>;
    stack: Array<{
      handle: unknown;
    }>;
  };
};

type RouterWithStack = {
  stack: RouteLayer[];
};

/**
 * Finds the configured `/users` route on an Express router.
 *
 * @param router Express router instance to inspect.
 * @returns The registered route layer for `/users`.
 * @example
 * const route = getUsersRoute(createUsersRouter());
 */
function getUsersRoute(router: unknown): NonNullable<RouteLayer['route']> {
  const routerWithStack = router as RouterWithStack;
  const layer = routerWithStack.stack.find(
    (candidate) => candidate.route?.path === '/users',
  );

  expect(layer?.route).toBeDefined();

  return layer!.route;
}

describe('users.routes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a new router instance for each call', () => {
    // Arrange
    const firstRouter = createUsersRouter();

    // Act
    const secondRouter = createUsersRouter();

    // Assert
    expect(firstRouter).not.toBe(secondRouter);
  });

  it('should register POST /users with the createUser handler', () => {
    // Arrange
    const router = createUsersRouter();

    // Act
    const route = getUsersRoute(router);

    // Assert
    expect(route.methods.post).toBe(true);
    expect(route.methods.get).toBeUndefined();
    expect(route.stack).toHaveLength(1);
    expect(route.stack[0]?.handle).toBe(createUser);
  });

  it('should export a preconfigured usersRouter instance', () => {
    // Act
    const route = getUsersRoute(usersRouter);

    // Assert
    expect(route.methods.post).toBe(true);
    expect(route.stack).toHaveLength(1);
    expect(route.stack[0]?.handle).toBe(createUser);
  });
});
