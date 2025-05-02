import { Test } from '@nestjs/testing';
import { RoleAccessGuard } from '../role-access.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../../schemas';
import { ErrorMessages } from '../../../../errorResponses/errorResponse.enum ';

describe('JWT Verification Guard', () => {
  let guard: RoleAccessGuard;

  // mockReflector
  let mockReflector = {
    getAll: jest.fn(),
  } as unknown as Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoleAccessGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = moduleRef.get(RoleAccessGuard);
  });

  // Make Mock ExecutionContext 
  const mockCtx = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      // In Mock Context User Role is USER
      getRequest: () => ({ user: { role: UserRole.USER } }),
    }),
  } as unknown as ExecutionContext;

  it('Should be defined', () => {
    expect(guard).toBeDefined();
    expect(mockReflector).toBeDefined();
  });

  it('Should be return true if any role not set', async () => {
    jest.spyOn(mockReflector, 'getAll').mockReturnValueOnce(undefined as never);
    expect(await guard.canActivate(mockCtx)).toEqual(true);
  });

  it('Should be Throw Forbidden if Route role Access  is ADMIN But User Role Is User', () => {
    jest
      .spyOn(mockReflector, 'getAll')
      .mockReturnValue([UserRole.ADMIN] as never);

    const res = guard.canActivate(mockCtx);
    expect(res).rejects.toThrow(ForbiddenException);
    expect(res).rejects.toThrow(ErrorMessages.INVALID_ACCESS);
  });

  it('Should be return true If Route Access Role is USER', async () => {
    jest
      .spyOn(mockReflector, 'getAll')
      .mockReturnValue([UserRole.USER] as never);

    const res = await guard.canActivate(mockCtx);
    expect(res).toEqual(true);
  });
});
