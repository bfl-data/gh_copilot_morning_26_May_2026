import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearUsers, createUser } from './users.controller.js';

type JsonResponse = {
  error?: string;
  id?: string;
  email?: string;
  name?: string;
};

type MockResponse = Response<JsonResponse> & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

function createMockResponse(): MockResponse {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as MockResponse;

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
}

/**
 * Creates a minimal request object for controller tests.
 *
 * @param body Request body to attach to the mock Express request.
 * @returns A typed mock request.
 * @example
 * createMockRequest({ email: 'user@example.com', name: 'User' });
 */
function createMockRequest(body: unknown): Request {
  return { body } as Request;
}

describe('createUser', () => {
  beforeEach(() => {
    clearUsers();
    vi.restoreAllMocks();
  });

  it('creates a new user and returns 201', async () => {
    const response = createMockResponse();
    const request = createMockRequest({
      email: '  ADA@Example.com ',
      name: ' Ada Lovelace ',
    });

    await createUser(request, response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        email: 'ada@example.com',
        name: 'Ada Lovelace',
      }),
    );
  });

  it('returns 400 when name or email is missing', async () => {
    const response = createMockResponse();
    const request = createMockRequest({ email: 'user@example.com' });

    await createUser(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'name and email are required',
    });
  });

  it('returns 409 when the email already exists', async () => {
    const firstResponse = createMockResponse();
    const duplicateResponse = createMockResponse();
    const firstRequest = createMockRequest({
      email: 'user@example.com',
      name: 'First User',
    });
    const duplicateRequest = createMockRequest({
      email: 'USER@example.com',
      name: 'Second User',
    });

    await createUser(firstRequest, firstResponse);
    await createUser(duplicateRequest, duplicateResponse);

    expect(duplicateResponse.status).toHaveBeenCalledWith(409);
    expect(duplicateResponse.json).toHaveBeenCalledWith({
      error: 'email already exists',
    });
  });
});