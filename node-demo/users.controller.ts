import type { Request, Response } from 'express';

type UserRecord = {
  id: string;
  email: string;
  name: string;
};

type CreateUserBody = {
  email: string;
  name: string;
};

type ErrorResponse = {
  error: string;
};

type CreateUserResponse = {
  id: string;
  email: string;
  name: string;
};

const usersByEmail = new Map<string, UserRecord>();

/**
 * Clears the in-memory user store.
 *
 * @returns Nothing.
 * @example
 * clearUsers();
 */
export function clearUsers(): void {
  usersByEmail.clear();
}

function parseCreateUserBody(body: unknown): CreateUserBody | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const { email, name } = body as Record<string, unknown>;
  if (typeof email !== 'string' || typeof name !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  if (!normalizedEmail || !normalizedName) {
    return null;
  }

  return {
    email: normalizedEmail,
    name: normalizedName,
  };
}

/**
 * Creates a new user for POST /users requests.
 *
 * @param req Express request containing a JSON body with `email` and `name`.
 * @param res Express response that returns either the created user or a validation error.
 * @returns A JSON response with the created user and HTTP 201 on success.
 * @throws Never intentionally throws; unexpected errors are allowed to bubble.
 * @example
 * app.post('/users', createUser);
 */
export async function createUser(
  req: Request,
  res: Response<CreateUserResponse | ErrorResponse>,
): Promise<Response<CreateUserResponse | ErrorResponse>> {
  const input = parseCreateUserBody(req.body as unknown);

  if (!input) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  if (usersByEmail.has(input.email)) {
    return res.status(409).json({ error: 'email already exists' });
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
  };

  usersByEmail.set(user.email, user);

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}