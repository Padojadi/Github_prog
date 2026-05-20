import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { OtherStaffDCFactory } from '../../factories/otherStaffDC.factory';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Other Staff DC API', () => {
  let institution: any;
  let user: any;
  let admin: any;
  let superAdmin: any;
  let ownerDC: any;

  beforeEach(async () => {
    await clearAllTables();

    institution = await db.Institution.create({
      name: 'Test Embassy',
      sigle: 'TEMB',
      type: 'PUBLIC',
    });

    user = await createUserAccount(institution.id);
    admin = await createAdminAccount(institution.id);
    superAdmin = await createSuperAdminAccount();

    ownerDC = await db.OwnerDiplomaticCard.create(
      OwnerDCFactory.buildMinimal(user.user.id, institution.id)
    );
  });

  describe('POST /api/card/otherstaff/', () => {
    it('should create other staff DC as authenticated user', async () => {
      const otherStaffData = OtherStaffDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await authenticatedPost(
        '/api/card/otherstaff/',
        user.accessToken!,
        otherStaffData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('firstName', otherStaffData.firstName);
    });

    it('should fail without authentication', async () => {
      const otherStaffData = OtherStaffDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await request
        .post('/api/card/otherstaff/')
        .send(otherStaffData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const response = await authenticatedPost(
        '/api/card/otherstaff/',
        user.accessToken!,
        { firstName: '' }
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card/otherstaff/', () => {
    it('should get all other staff DCs as authenticated user', async () => {
      await db.OtherStaffDC.create(OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/otherstaff/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card/otherstaff/');
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/otherstaff/:id', () => {
    it('should get other staff DC by id', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedGet(
        `/api/card/otherstaff/${otherStaffDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', otherStaffDC.id);
    });

    it('should return 404 for non-existent other staff DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/otherstaff/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/otherstaff/:id', () => {
    it('should update other staff DC', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/otherstaff/${otherStaffDC.id}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail for non-existent other staff DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPatch(
        `/api/card/otherstaff/${fakeId}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/otherstaff/pointfocal/validate/:id', () => {
    it('should validate other staff DC as point focal', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherstaff/pointfocal/validate/${otherStaffDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PUT /api/card/otherstaff/admin/validate/:id', () => {
    it('should validate other staff DC as ADMIN', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherstaff/admin/validate/${otherStaffDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject other staff DC as ADMIN', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherstaff/admin/validate/${otherStaffDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid documents' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/otherstaff/admin/validate/${otherStaffDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/otherstaff/superadmin/validate/:id', () => {
    it('should validate other staff DC as SUPERADMIN', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherstaff/superadmin/validate/${otherStaffDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/otherstaff/superadmin/validate/${otherStaffDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/otherstaff/set-printed/:id', () => {
    it('should set other staff DC as printed', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/otherstaff/set-printed/${otherStaffDC.id}`,
        user.accessToken!,
        { travellingNumber: otherStaffDC.travellingNumber }
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/otherstaff/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/otherstaff/undo-print/${otherStaffDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/otherstaff/undo-print/${otherStaffDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/card/otherstaff/:id', () => {
    it('should delete other staff DC as SUPERADMIN', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/otherstaff/${otherStaffDC.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      const deletedDC = await db.OtherStaffDC.findByPk(otherStaffDC.id);
      expect(deletedDC).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const otherStaffDC = await db.OtherStaffDC.create(
        OtherStaffDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/otherstaff/${otherStaffDC.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
