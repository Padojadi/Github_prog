import { request, authenticatedGet, authenticatedPatch, authenticatedPut, authenticatedPost, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createUserAccount, createAdminAccount, createSuperAdminAccount, createTestInstitution } from '../../helpers/auth.helper';
import { UserFactory } from '../../factories/user.factory';
import db from '../../../database/models';
import argon2 from 'argon2';

describe('Users API', () => {
  let institution: any;

  beforeAll(async () => {
    institution = await createTestInstitution();
  });

  beforeEach(async () => {
    await clearAllTables();
    // Recreate institution for each test
    institution = await createTestInstitution();
  });

  describe('GET /api/user/all', () => {
    it('should get all users as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      await createUserAccount(institution.id);
      await createUserAccount(institution.id);

      const response = await authenticatedGet('/api/user/all', superAdmin.accessToken!);

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeInstanceOf(Array);
      expect((response.body.data || response.body).length).toBeGreaterThanOrEqual(3);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const user = await createUserAccount(institution.id);

      const response = await authenticatedGet('/api/user/all', user.accessToken!);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/user/all');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/user/', () => {
    it('should get current user profile', async () => {
      const user = await createUserAccount(institution.id);

      const response = await authenticatedGet('/api/user/', user.accessToken!);

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', user.id);
      expect(response.body.data || response.body).toHaveProperty('email', user.email);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/user/');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/user/:id', () => {
    it('should get user by ID as ADMIN', async () => {
      const admin = await createAdminAccount(institution.id);
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedGet(`/api/user/${targetUser.id}`, admin.accessToken!);

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', targetUser.id);
    });

    it('should fail without ADMIN authorization', async () => {
      const user = await createUserAccount(institution.id);
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedGet(`/api/user/${targetUser.id}`, user.accessToken!);

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent user', async () => {
      const admin = await createAdminAccount(institution.id);

      const response = await authenticatedGet('/api/user/00000000-0000-0000-0000-000000000000', admin.accessToken!);

      expect([404, 400]).toContain(response.status);
    });
  });

  describe('PATCH /api/user/', () => {
    it('should update current user profile', async () => {
      const user = await createUserAccount(institution.id);

      const response = await authenticatedPatch('/api/user/', user.accessToken!, {
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
      });

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('firstName', 'UpdatedFirstName');
      expect(response.body.data || response.body).toHaveProperty('lastName', 'UpdatedLastName');
    });

    it('should fail with invalid data', async () => {
      const user = await createUserAccount(institution.id);

      const response = await authenticatedPatch('/api/user/', user.accessToken!, {
        email: 'invalid-email',
      });

      expect([400, 422]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const response = await request.patch('/api/user/').send({
        firstName: 'Test',
      });

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/user/update_password', () => {
    it('should update password with correct old password', async () => {
      const password = 'OldPassword123!';
      const hashedPassword = await argon2.hash(password);

      const userData = UserFactory.build();
      const user = await db.User.create({
        ...userData,
        password: hashedPassword,
        isVerified: true,
      });

      const loginResponse = await request.post('/api/auth/login').send({
        email: userData.email,
        password: password,
      });

      const token = loginResponse.body.accessToken;

      const response = await authenticatedPut('/api/user/update_password', token, {
        oldPassword: password,
        newPassword: 'NewPassword123!',
      });

      expect(response.status).toBe(200);
    });

    it('should fail with incorrect old password', async () => {
      const password = 'OldPassword123!';
      const hashedPassword = await argon2.hash(password);

      const userData = UserFactory.build();
      const user = await db.User.create({
        ...userData,
        password: hashedPassword,
        isVerified: true,
      });

      const loginResponse = await request.post('/api/auth/login').send({
        email: userData.email,
        password: password,
      });

      const token = loginResponse.body.accessToken;

      const response = await authenticatedPut('/api/user/update_password', token, {
        oldPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/user/send_code', () => {
    it('should send verification code to existing email', async () => {
      const user = await createUserAccount(institution.id);

      const response = await request.post('/api/user/send_code').send({
        email: user.email,
      });

      expect([200, 201]).toContain(response.status);
    });

    it('should fail with non-existent email', async () => {
      const response = await request.post('/api/user/send_code').send({
        email: 'nonexistent@example.com',
      });

      expect([404, 400]).toContain(response.status);
    });
  });

  describe('POST /api/user/reset_password', () => {
    it('should reset password with valid code', async () => {
      const verificationCode = '123456';
      const user = await db.User.create({
        ...UserFactory.build(),
        isVerified: true,
        verificationCode: verificationCode,
        verificationCodeExpiration: new Date(Date.now() + 3600000),
      });

      const response = await request.post('/api/user/reset_password').send({
        email: user.email,
        verificationCode: verificationCode,
        newPassword: 'NewPassword123!',
      });

      expect([200, 201]).toContain(response.status);
    });

    it('should fail with invalid code', async () => {
      const user = await db.User.create({
        ...UserFactory.build(),
        isVerified: true,
        verificationCode: '123456',
        verificationCodeExpiration: new Date(Date.now() + 3600000),
      });

      const response = await request.post('/api/user/reset_password').send({
        email: user.email,
        verificationCode: 'wrong-code',
        newPassword: 'NewPassword123!',
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should fail with expired code', async () => {
      const user = await db.User.create({
        ...UserFactory.build(),
        isVerified: true,
        verificationCode: '123456',
        verificationCodeExpiration: new Date(Date.now() - 3600000),
      });

      const response = await request.post('/api/user/reset_password').send({
        email: user.email,
        verificationCode: '123456',
        newPassword: 'NewPassword123!',
      });

      expect([400, 401, 410]).toContain(response.status);
    });
  });

  describe('POST /api/user/admin-reset_user_password', () => {
    it('should reset user password as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedPost(
        '/api/user/admin-reset_user_password',
        superAdmin.accessToken!,
        {
          userId: targetUser.id,
          newPassword: 'NewPassword123!',
        }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const user = await createUserAccount(institution.id);
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedPost(
        '/api/user/admin-reset_user_password',
        user.accessToken!,
        {
          userId: targetUser.id,
          newPassword: 'NewPassword123!',
        }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/user/super_admin/update/:id', () => {
    it('should update user as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedPut(
        `/api/user/super_admin/update/${targetUser.id}`,
        superAdmin.accessToken!,
        {
          firstName: 'AdminUpdated',
          lastName: 'Name',
        }
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('firstName', 'AdminUpdated');
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const user = await createUserAccount(institution.id);
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedPut(
        `/api/user/super_admin/update/${targetUser.id}`,
        user.accessToken!,
        {
          firstName: 'Test',
        }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/user/super_admin/delete/:id', () => {
    it('should delete user as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedDelete(
        `/api/user/super_admin/delete/${targetUser.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify user is deleted
      const deletedUser = await db.User.findByPk(targetUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const user = await createUserAccount(institution.id);
      const targetUser = await createUserAccount(institution.id);

      const response = await authenticatedDelete(
        `/api/user/super_admin/delete/${targetUser.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail for non-existent user', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedDelete(
        '/api/user/super_admin/delete/00000000-0000-0000-0000-000000000000',
        superAdmin.accessToken!
      );

      expect([404, 400]).toContain(response.status);
    });
  });
});
