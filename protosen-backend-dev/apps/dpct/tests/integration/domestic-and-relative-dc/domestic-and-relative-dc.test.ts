import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { DomesticAndRelativeDCFactory } from '../../factories/domesticAndRelativeDC.factory';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Domestic And Relative DC API', () => {
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

  describe('POST /api/card/domesticandrelative/', () => {
    it('should create domestic and relative DC as authenticated user', async () => {
      const domesticAndRelativeData = DomesticAndRelativeDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await authenticatedPost(
        '/api/card/domesticandrelative/',
        user.accessToken!,
        domesticAndRelativeData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('firstName', domesticAndRelativeData.firstName);
    });

    it('should fail without authentication', async () => {
      const domesticAndRelativeData = DomesticAndRelativeDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await request
        .post('/api/card/domesticandrelative/')
        .send(domesticAndRelativeData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const response = await authenticatedPost(
        '/api/card/domesticandrelative/',
        user.accessToken!,
        { firstName: '' }
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card/domesticandrelative/', () => {
    it('should get all domestic and relative DCs as authenticated user', async () => {
      await db.DomesticAndRelativeDC.create(DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/domesticandrelative/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card/domesticandrelative/');
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/domesticandrelative/:id', () => {
    it('should get domestic and relative DC by id', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedGet(
        `/api/card/domesticandrelative/${domesticAndRelativeDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', domesticAndRelativeDC.id);
    });

    it('should return 404 for non-existent domestic and relative DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/domesticandrelative/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/domesticandrelative/:id', () => {
    it('should update domestic and relative DC', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/domesticandrelative/${domesticAndRelativeDC.id}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail for non-existent domestic and relative DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPatch(
        `/api/card/domesticandrelative/${fakeId}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/domesticandrelative/pointfocal/validate/:id', () => {
    it('should validate domestic and relative DC as point focal', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/domesticandrelative/pointfocal/validate/${domesticAndRelativeDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PUT /api/card/domesticandrelative/admin/validate/:id', () => {
    it('should validate domestic and relative DC as ADMIN', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/domesticandrelative/admin/validate/${domesticAndRelativeDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject domestic and relative DC as ADMIN', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/domesticandrelative/admin/validate/${domesticAndRelativeDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid documents' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/domesticandrelative/admin/validate/${domesticAndRelativeDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/domesticandrelative/superadmin/validate/:id', () => {
    it('should validate domestic and relative DC as SUPERADMIN', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/domesticandrelative/superadmin/validate/${domesticAndRelativeDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/domesticandrelative/superadmin/validate/${domesticAndRelativeDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/domesticandrelative/set-printed/:id', () => {
    it('should set domestic and relative DC as printed', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/domesticandrelative/set-printed/${domesticAndRelativeDC.id}`,
        user.accessToken!,
        { travellingNumber: domesticAndRelativeDC.travellingNumber }
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/domesticandrelative/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/domesticandrelative/undo-print/${domesticAndRelativeDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/domesticandrelative/undo-print/${domesticAndRelativeDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/card/domesticandrelative/:id', () => {
    it('should delete domestic and relative DC as SUPERADMIN', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/domesticandrelative/${domesticAndRelativeDC.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      const deletedDC = await db.DomesticAndRelativeDC.findByPk(domesticAndRelativeDC.id);
      expect(deletedDC).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const domesticAndRelativeDC = await db.DomesticAndRelativeDC.create(
        DomesticAndRelativeDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/domesticandrelative/${domesticAndRelativeDC.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
