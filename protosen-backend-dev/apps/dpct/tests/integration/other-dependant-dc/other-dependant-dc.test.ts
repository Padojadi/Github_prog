import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { OtherDependantDCFactory } from '../../factories/otherDependantDC.factory';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Other Dependant DC API', () => {
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

  describe('POST /api/card/otherdependant/', () => {
    it('should create other dependant DC as authenticated user', async () => {
      const otherDependantData = OtherDependantDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await authenticatedPost(
        '/api/card/otherdependant/',
        user.accessToken!,
        otherDependantData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('firstName', otherDependantData.firstName);
    });

    it('should fail without authentication', async () => {
      const otherDependantData = OtherDependantDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await request
        .post('/api/card/otherdependant/')
        .send(otherDependantData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const response = await authenticatedPost(
        '/api/card/otherdependant/',
        user.accessToken!,
        { firstName: '' }
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card/otherdependant/', () => {
    it('should get all other dependant DCs as authenticated user', async () => {
      await db.OtherDependantDC.create(OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/otherdependant/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card/otherdependant/');
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/otherdependant/:id', () => {
    it('should get other dependant DC by id', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedGet(
        `/api/card/otherdependant/${otherDependantDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', otherDependantDC.id);
    });

    it('should return 404 for non-existent other dependant DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/otherdependant/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/otherdependant/:id', () => {
    it('should update other dependant DC', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/otherdependant/${otherDependantDC.id}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail for non-existent other dependant DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPatch(
        `/api/card/otherdependant/${fakeId}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/otherdependant/pointfocal/validate/:id', () => {
    it('should validate other dependant DC as point focal', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherdependant/pointfocal/validate/${otherDependantDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PUT /api/card/otherdependant/admin/validate/:id', () => {
    it('should validate other dependant DC as ADMIN', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherdependant/admin/validate/${otherDependantDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject other dependant DC as ADMIN', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherdependant/admin/validate/${otherDependantDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid documents' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/otherdependant/admin/validate/${otherDependantDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/otherdependant/superadmin/validate/:id', () => {
    it('should validate other dependant DC as SUPERADMIN', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/otherdependant/superadmin/validate/${otherDependantDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/otherdependant/superadmin/validate/${otherDependantDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/otherdependant/set-printed/:id', () => {
    it('should set other dependant DC as printed', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/otherdependant/set-printed/${otherDependantDC.id}`,
        user.accessToken!,
        { travellingNumber: otherDependantDC.travellingNumber }
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/otherdependant/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/otherdependant/undo-print/${otherDependantDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/otherdependant/undo-print/${otherDependantDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/card/otherdependant/:id', () => {
    it('should delete other dependant DC as SUPERADMIN', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/otherdependant/${otherDependantDC.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      const deletedDC = await db.OtherDependantDC.findByPk(otherDependantDC.id);
      expect(deletedDC).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const otherDependantDC = await db.OtherDependantDC.create(
        OtherDependantDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/otherdependant/${otherDependantDC.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
