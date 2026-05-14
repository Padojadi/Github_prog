import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { PlaqueFactory } from '../../factories/plaque.factory';
import db from '../../../database/models';

describe('Plaque API', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  describe('POST /api/plaque/', () => {
    it('should create plaque as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const plaqueData = PlaqueFactory.build({ code: 'ABCD' });

      const response = await authenticatedPost(
        '/api/plaque/',
        superAdmin.accessToken!,
        plaqueData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('code', 'ABCD');
      expect(response.body).toHaveProperty('id');
    });

    it('should fail to create plaque without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const plaqueData = PlaqueFactory.build();

      const response = await authenticatedPost(
        '/api/plaque/',
        user.accessToken!,
        plaqueData
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail to create plaque without authentication', async () => {
      const plaqueData = PlaqueFactory.build();

      const response = await request
        .post('/api/plaque/')
        .send(plaqueData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with duplicate code', async () => {
      const superAdmin = await createSuperAdminAccount();

      // Create first plaque
      await db.Plaque.create(PlaqueFactory.build({ code: 'SAME' }));

      // Try to create duplicate
      const response = await authenticatedPost(
        '/api/plaque/',
        superAdmin.accessToken!,
        PlaqueFactory.build({ code: 'SAME' })
      );

      expect([400, 409, 422]).toContain(response.status);
    });
  });

  describe('GET /api/plaque/', () => {
    it('should get all plaques as authenticated user', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);

      // Create some plaques
      await db.Plaque.create(PlaqueFactory.build({ code: 'AAA1' }));
      await db.Plaque.create(PlaqueFactory.build({ code: 'BBB2' }));

      const response = await authenticatedGet(
        '/api/plaque/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/plaque/');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/plaque/:id', () => {
    it('should get plaque by id as authenticated user', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const plaque = await db.Plaque.create(PlaqueFactory.build({ code: 'TEST' }));

      const response = await authenticatedGet(
        `/api/plaque/${plaque.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', plaque.id);
      expect(response.body).toHaveProperty('code', 'TEST');
    });

    it('should return 404 for non-existent plaque', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/plaque/${fakeId}`,
        user.accessToken!
      );

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const plaque = await db.Plaque.create(PlaqueFactory.build());

      const response = await request.get(`/api/plaque/${plaque.id}`);

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/plaque/:id', () => {
    it('should update plaque as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const plaque = await db.Plaque.create(PlaqueFactory.build({ code: 'OLD1' }));

      const updateData = {
        code: 'NEW1',
        title: 'Updated Title',
      };

      const response = await authenticatedPut(
        `/api/plaque/${plaque.id}`,
        superAdmin.accessToken!,
        updateData
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('code', 'NEW1');
      expect(response.body).toHaveProperty('title', 'Updated Title');
    });

    it('should fail to update without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const plaque = await db.Plaque.create(PlaqueFactory.build());

      const response = await authenticatedPut(
        `/api/plaque/${plaque.id}`,
        user.accessToken!,
        { code: 'UPD1', title: 'Updated' }
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent plaque', async () => {
      const superAdmin = await createSuperAdminAccount();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPut(
        `/api/plaque/${fakeId}`,
        superAdmin.accessToken!,
        { code: 'NEW1', title: 'Updated' }
      );

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/plaque/:id', () => {
    it('should delete plaque as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const plaque = await db.Plaque.create(PlaqueFactory.build());

      const response = await authenticatedDelete(
        `/api/plaque/${plaque.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedPlaque = await db.Plaque.findByPk(plaque.id);
      expect(deletedPlaque).toBeNull();
    });

    it('should fail to delete without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const plaque = await db.Plaque.create(PlaqueFactory.build());

      const response = await authenticatedDelete(
        `/api/plaque/${plaque.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent plaque', async () => {
      const superAdmin = await createSuperAdminAccount();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedDelete(
        `/api/plaque/${fakeId}`,
        superAdmin.accessToken!
      );

      expect(response.status).toBe(404);
    });
  });
});
