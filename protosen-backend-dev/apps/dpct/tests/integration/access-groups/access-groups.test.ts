import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { AccessGroupFactory } from '../../factories/accessGroup.factory';
import db from '../../../database/models';

describe('Access Groups API', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  describe('POST /api/accessgroup/', () => {
    it('should create access group as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const accessGroupData = AccessGroupFactory.build({ name: 'Test Group' });

      const response = await authenticatedPost(
        '/api/accessgroup/',
        superAdmin.accessToken!,
        accessGroupData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('name', 'Test Group');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('permissions');
    });

    it('should fail to create access group without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const accessGroupData = AccessGroupFactory.build();

      const response = await authenticatedPost(
        '/api/accessgroup/',
        user.accessToken!,
        accessGroupData
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail to create access group without authentication', async () => {
      const accessGroupData = AccessGroupFactory.build();

      const response = await request
        .post('/api/accessgroup/')
        .send(accessGroupData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedPost(
        '/api/accessgroup/',
        superAdmin.accessToken!,
        { name: '' } // Invalid: missing required fields
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/accessgroup/', () => {
    it('should get all access groups as authenticated user', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);

      // Create some access groups
      await db.AccessGroup.create(AccessGroupFactory.build({ name: 'Group 1' }));
      await db.AccessGroup.create(AccessGroupFactory.build({ name: 'Group 2' }));

      const response = await authenticatedGet(
        '/api/accessgroup/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/accessgroup/');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/accessgroup/:id', () => {
    it('should get access group by id as authenticated user', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const accessGroup = await db.AccessGroup.create(AccessGroupFactory.build({ name: 'Test Group' }));

      const response = await authenticatedGet(
        `/api/accessgroup/${accessGroup.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', accessGroup.id);
      expect(response.body).toHaveProperty('name', 'Test Group');
    });

    it('should return 404 for non-existent access group', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/accessgroup/${fakeId}`,
        user.accessToken!
      );

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const accessGroup = await db.AccessGroup.create(AccessGroupFactory.build());

      const response = await request.get(`/api/accessgroup/${accessGroup.id}`);

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/accessgroup/:id', () => {
    it('should update access group as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const accessGroup = await db.AccessGroup.create(AccessGroupFactory.build({ name: 'Old Name' }));

      const updateData = {
        name: 'Updated Name',
        permissions: ['read:all', 'write:all'],
        editable: false,
      };

      const response = await authenticatedPut(
        `/api/accessgroup/${accessGroup.id}`,
        superAdmin.accessToken!,
        updateData
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body.permissions).toContain('read:all');
    });

    it('should fail to update without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const accessGroup = await db.AccessGroup.create(AccessGroupFactory.build());

      const response = await authenticatedPut(
        `/api/accessgroup/${accessGroup.id}`,
        user.accessToken!,
        { name: 'Updated' }
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent access group', async () => {
      const superAdmin = await createSuperAdminAccount();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPut(
        `/api/accessgroup/${fakeId}`,
        superAdmin.accessToken!,
        { name: 'Updated', permissions: ['read:all'], editable: true }
      );

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/accessgroup/:id', () => {
    it('should delete access group as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const accessGroup = await db.AccessGroup.create(AccessGroupFactory.build());

      const response = await authenticatedDelete(
        `/api/accessgroup/${accessGroup.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedAccessGroup = await db.AccessGroup.findByPk(accessGroup.id);
      expect(deletedAccessGroup).toBeNull();
    });

    it('should fail to delete without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const accessGroup = await db.AccessGroup.create(AccessGroupFactory.build());

      const response = await authenticatedDelete(
        `/api/accessgroup/${accessGroup.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent access group', async () => {
      const superAdmin = await createSuperAdminAccount();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedDelete(
        `/api/accessgroup/${fakeId}`,
        superAdmin.accessToken!
      );

      expect(response.status).toBe(404);
    });
  });
});
