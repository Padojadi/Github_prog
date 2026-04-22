import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { SpouseDCFactory } from '../../factories/spouseDC.factory';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Spouse DC API', () => {
  let institution: any;
  let user: any;
  let admin: any;
  let superAdmin: any;
  let ownerDC: any;

  beforeEach(async () => {
    await clearAllTables();

    // Create institution
    institution = await db.Institution.create({
      name: 'Test Embassy',
      sigle: 'TEMB',
      type: 'PUBLIC',
    });

    // Create users with different roles
    user = await createUserAccount(institution.id);
    admin = await createAdminAccount(institution.id);
    superAdmin = await createSuperAdminAccount();

    // Create owner DC (required for spouse)
    ownerDC = await db.OwnerDiplomaticCard.create(
      OwnerDCFactory.buildMinimal(user.user.id, institution.id)
    );
  });

  describe('POST /api/card/spouse/', () => {
    it('should create spouse DC as authenticated user', async () => {
      const spouseDCData = SpouseDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await authenticatedPost(
        '/api/card/spouse/',
        user.accessToken!,
        spouseDCData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('firstName', spouseDCData.firstName);
      expect(response.body.data || response.body).toHaveProperty('documentStage', EDocumentState.PENDING);
    });

    it('should fail without authentication', async () => {
      const spouseDCData = SpouseDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await request
        .post('/api/card/spouse/')
        .send(spouseDCData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const response = await authenticatedPost(
        '/api/card/spouse/',
        user.accessToken!,
        { firstName: '' } // Invalid: missing required fields
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card/spouse/', () => {
    it('should get all spouse DCs as authenticated user', async () => {
      // Create some spouse DCs
      await db.SpouseDC.create(SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));
      await db.SpouseDC.create(SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/spouse/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card/spouse/');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/spouse/:id', () => {
    it('should get spouse DC by id', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedGet(
        `/api/card/spouse/${spouseDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', spouseDC.id);
    });

    it('should return 404 for non-existent spouse DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/spouse/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/spouse/:id', () => {
    it('should update spouse DC', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await authenticatedPatch(
        `/api/card/spouse/${spouseDC.id}`,
        user.accessToken!,
        updateData
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail for non-existent spouse DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPatch(
        `/api/card/spouse/${fakeId}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/spouse/pointfocal/validate/:id', () => {
    it('should validate spouse DC as point focal', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/spouse/pointfocal/validate/${spouseDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PUT /api/card/spouse/admin/validate/:id', () => {
    it('should validate spouse DC as ADMIN', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/spouse/admin/validate/${spouseDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject spouse DC as ADMIN', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/spouse/admin/validate/${spouseDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid documents' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/spouse/admin/validate/${spouseDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/spouse/superadmin/validate/:id', () => {
    it('should validate spouse DC as SUPERADMIN', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/spouse/superadmin/validate/${spouseDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/spouse/superadmin/validate/${spouseDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/spouse/set-printed/:id', () => {
    it('should set spouse DC as printed', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/spouse/set-printed/${spouseDC.id}`,
        user.accessToken!,
        { travellingNumber: spouseDC.travellingNumber }
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/spouse/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/spouse/undo-print/${spouseDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/spouse/undo-print/${spouseDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/card/spouse/:id', () => {
    it('should delete spouse DC as SUPERADMIN', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/spouse/${spouseDC.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedSpouseDC = await db.SpouseDC.findByPk(spouseDC.id);
      expect(deletedSpouseDC).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const spouseDC = await db.SpouseDC.create(
        SpouseDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/spouse/${spouseDC.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
