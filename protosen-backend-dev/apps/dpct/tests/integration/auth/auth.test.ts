import { request } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { UserFactory } from '../../factories/user.factory';
import db from '../../../database/models';
import argon2 from 'argon2';

describe('Authentication API', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create a user
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      const user = await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: true,
      });

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should fail with invalid email', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test1234!',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with invalid password', async () => {
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: true,
      });

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with unverified account', async () => {
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: false,
      });

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: password,
        });

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with missing credentials', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register new user as ADMIN', async () => {
      // Create an admin user first
      const adminPassword = 'Admin1234!';
      const hashedAdminPassword = await argon2.hash(adminPassword);

      const admin = await db.User.create({
        ...UserFactory.build({ role: 'ADMIN' }),
        email: 'admin@example.com',
        password: hashedAdminPassword,
        isVerified: true,
      });

      // Login as admin to get token
      const loginResponse = await request
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: adminPassword,
        });

      const adminToken = loginResponse.body.accessToken;

      // Register new user
      const response = await request
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          phone: '+221771234567',
          password: 'NewUser1234!',
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('email', 'newuser@example.com');
    });

    it('should fail without ADMIN authorization', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          phone: '+221771234567',
          password: 'NewUser1234!',
        });

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: true,
      });

      // Login first
      const loginResponse = await request
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: password,
        });

      const refreshToken = loginResponse.body.refreshToken;

      // Refresh token
      const response = await request
        .post('/api/auth/refresh')
        .send({
          refreshToken: refreshToken,
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        });

      expect([401, 400]).toContain(response.status);
    });
  });

  describe('POST /api/auth/super_admin/register', () => {
    it('should register new user as SUPERADMIN', async () => {
      // Create a superadmin user first
      const superAdminPassword = 'SuperAdmin1234!';
      const hashedPassword = await argon2.hash(superAdminPassword);

      await db.User.create({
        ...UserFactory.build({ role: 'SUPERADMIN' }),
        email: 'superadmin@example.com',
        password: hashedPassword,
        isVerified: true,
      });

      // Login as superadmin
      const loginResponse = await request
        .post('/api/auth/login')
        .send({
          email: 'superadmin@example.com',
          password: superAdminPassword,
        });

      const superAdminToken = loginResponse.body.accessToken;

      // Register new user
      const response = await request
        .post('/api/auth/super_admin/register')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          email: 'newadmin@example.com',
          firstName: 'New',
          lastName: 'Admin',
          phone: '+221771234567',
          password: 'NewAdmin1234!',
          role: 'ADMIN',
        });

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const response = await request
        .post('/api/auth/super_admin/register')
        .send({
          email: 'newadmin@example.com',
          firstName: 'New',
          lastName: 'Admin',
          phone: '+221771234567',
          password: 'NewAdmin1234!',
        });

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('POST /api/auth/confirmemail', () => {
    it('should confirm email with valid verification code', async () => {
      const verificationCode = '123456';
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: false,
        verificationCode: verificationCode,
        verificationCodeExpiration: new Date(Date.now() + 3600000), // 1 hour from now
      });

      const response = await request
        .post('/api/auth/confirmemail')
        .send({
          email: 'test@example.com',
          verificationCode: verificationCode,
        });

      expect([200, 201]).toContain(response.status);
    });

    it('should fail with invalid verification code', async () => {
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: false,
        verificationCode: '123456',
        verificationCodeExpiration: new Date(Date.now() + 3600000),
      });

      const response = await request
        .post('/api/auth/confirmemail')
        .send({
          email: 'test@example.com',
          verificationCode: 'wrong-code',
        });

      expect([400, 401]).toContain(response.status);
    });

    it('should fail with expired verification code', async () => {
      const password = 'Test1234!';
      const hashedPassword = await argon2.hash(password);

      await db.User.create({
        ...UserFactory.build(),
        email: 'test@example.com',
        password: hashedPassword,
        isVerified: false,
        verificationCode: '123456',
        verificationCodeExpiration: new Date(Date.now() - 3600000), // 1 hour ago
      });

      const response = await request
        .post('/api/auth/confirmemail')
        .send({
          email: 'test@example.com',
          verificationCode: '123456',
        });

      expect([400, 401, 410]).toContain(response.status);
    });
  });
});
