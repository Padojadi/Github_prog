import { signJwt } from '../../src/shared/libs/jwt/jwt';
import db from '../../database/models';
import { RoleEnum } from '../../src/modules/user/types/user.types';
import argon2 from 'argon2';

export interface TestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleEnum;
  organismId?: string;
  phone: string;
  accessToken?: string;
}

/**
 * Generate JWT access token for testing
 */
export function generateAccessToken(payload: {
  id: string;
  email: string;
  role: RoleEnum;
  organismId?: string;
}): string {
  return signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '1h',
  });
}

/**
 * Generate JWT refresh token for testing
 */
export function generateRefreshToken(payload: { id: string }): string {
  return signJwt(payload, 'refreshTokenPrivateKey', {
    expiresIn: '100h',
  });
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
  role: RoleEnum = RoleEnum.USER,
  overrides: Partial<TestUser> = {}
): Promise<TestUser> {
  const defaultData = {
    email: `test-${role.toLowerCase()}-${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
    phone: '+1234567890',
    role,
    status: 'active' as const,
    password: await argon2.hash('Test1234!'),
    verificationCode: null,
    verificationCodeExpiration: null,
    isVerified: true,
  };

  const userData = { ...defaultData, ...overrides };

  const user = await db.User.create(userData);

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role as RoleEnum,
    organismId: user.organismId,
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as RoleEnum,
    organismId: user.organismId,
    phone: user.phone,
    accessToken,
  };
}

/**
 * Create a USER role test account
 */
export async function createUserAccount(
  organismId: string,
  overrides: Partial<TestUser> = {}
): Promise<TestUser> {
  return createTestUser(RoleEnum.USER, { organismId, ...overrides });
}

/**
 * Create an ADMIN role test account
 */
export async function createAdminAccount(
  organismId?: string,
  overrides: Partial<TestUser> = {}
): Promise<TestUser> {
  return createTestUser(RoleEnum.ADMIN, { organismId, ...overrides });
}

/**
 * Create a SUPERADMIN role test account
 */
export async function createSuperAdminAccount(
  overrides: Partial<TestUser> = {}
): Promise<TestUser> {
  return createTestUser(RoleEnum.SUPERADMIN, overrides);
}

/**
 * Create an institution for testing
 */
export async function createTestInstitution(name?: string) {
  const institution = await db.Institution.create({
    name: name || `Test Institution ${Date.now()}`,
    code: `TEST-${Date.now()}`,
    address: '123 Test Street',
    type: 'Embassy',
    status: 'active',
  });

  return institution;
}

/**
 * Delete test user
 */
export async function deleteTestUser(userId: string): Promise<void> {
  await db.User.destroy({ where: { id: userId } });
}

/**
 * Delete test institution
 */
export async function deleteTestInstitution(institutionId: string): Promise<void> {
  await db.Institution.destroy({ where: { id: institutionId } });
}
