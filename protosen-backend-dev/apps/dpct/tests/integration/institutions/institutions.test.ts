import { authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createUserAccount, createTestInstitution } from '../../helpers/auth.helper';
import { InstitutionFactory } from '../../factories/institution.factory';
import db from '../../../database/models';

describe('Institutions API', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  describe('GET /api/institution/', () => {
    it('should get all institutions as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      await createTestInstitution('Embassy 1');
      await createTestInstitution('Embassy 2');

      const response = await authenticatedGet('/api/institution/', superAdmin.accessToken!);

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeInstanceOf(Array);
      expect((response.body.data || response.body).length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const institution = await createTestInstitution();
      const user = await createUserAccount(institution.id);

      const response = await authenticatedGet('/api/institution/', user.accessToken!);

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('POST /api/institution/seeds', () => {
    it('should seed institutions as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedPost('/api/institution/seeds', superAdmin.accessToken!, {});

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const institution = await createTestInstitution();
      const user = await createUserAccount(institution.id);

      const response = await authenticatedPost('/api/institution/seeds', user.accessToken!, {});

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('POST /api/institution/', () => {
    it('should create institution as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const institutionData = InstitutionFactory.build();

      const response = await authenticatedPost('/api/institution/', superAdmin.accessToken!, institutionData);

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('name', institutionData.name);
      expect(response.body.data || response.body).toHaveProperty('code', institutionData.code);
    });

    it('should fail with missing required fields', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedPost('/api/institution/', superAdmin.accessToken!, {
        name: 'Test Embassy',
        // Missing code
      });

      expect([400, 422]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const institution = await createTestInstitution();
      const user = await createUserAccount(institution.id);
      const institutionData = InstitutionFactory.build();

      const response = await authenticatedPost('/api/institution/', user.accessToken!, institutionData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with duplicate code', async () => {
      const superAdmin = await createSuperAdminAccount();
      const institutionData = InstitutionFactory.build();

      // Create first institution
      await authenticatedPost('/api/institution/', superAdmin.accessToken!, institutionData);

      // Try to create duplicate
      const response = await authenticatedPost('/api/institution/', superAdmin.accessToken!, institutionData);

      expect([400, 409, 422]).toContain(response.status);
    });
  });

  describe('PUT /api/institution/update/:id', () => {
    it('should update institution as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const institution = await createTestInstitution('Original Name');

      const response = await authenticatedPut(
        `/api/institution/update/${institution.id}`,
        superAdmin.accessToken!,
        {
          name: 'Updated Name',
          address: 'New Address',
        }
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body.data || response.body).toHaveProperty('address', 'New Address');
    });

    it('should fail for non-existent institution', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedPut(
        '/api/institution/update/00000000-0000-0000-0000-000000000000',
        superAdmin.accessToken!,
        {
          name: 'Updated Name',
        }
      );

      expect([404, 400]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const institution = await createTestInstitution();
      const user = await createUserAccount(institution.id);

      const response = await authenticatedPut(
        `/api/institution/update/${institution.id}`,
        user.accessToken!,
        {
          name: 'Updated Name',
        }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/institution/:id', () => {
    it('should delete institution as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const institution = await createTestInstitution();

      const response = await authenticatedDelete(
        `/api/institution/${institution.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify institution is deleted
      const deletedInstitution = await db.Institution.findByPk(institution.id);
      expect(deletedInstitution).toBeNull();
    });

    it('should fail for non-existent institution', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedDelete(
        '/api/institution/00000000-0000-0000-0000-000000000000',
        superAdmin.accessToken!
      );

      expect([404, 400]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const institution = await createTestInstitution();
      const user = await createUserAccount(institution.id);

      const response = await authenticatedDelete(
        `/api/institution/${institution.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
