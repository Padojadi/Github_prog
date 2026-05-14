import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { RenewOwnerDCFactory } from '../../factories/renewOwnerDC.factory';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Renew Owner DC API', () => {
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

    // Create a printed owner DC that can be renewed
    ownerDC = await db.OwnerDiplomaticCard.create(
      OwnerDCFactory.buildPrinted(user.user.id, institution.id)
    );
  });

  describe('POST /api/card/renew/owner/create/:id', () => {
    it('should create renewal from existing owner DC as authenticated user', async () => {
      const response = await authenticatedPost(
        `/api/card/renew/owner/create/${ownerDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('previousCardId', ownerDC.id);
    });

    it('should fail without authentication', async () => {
      const response = await request
        .post(`/api/card/renew/owner/create/${ownerDC.id}`)
        .send({});

      expect([401, 403]).toContain(response.status);
    });

    it('should fail for non-existent owner DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPost(
        `/api/card/renew/owner/create/${fakeId}`,
        user.accessToken!,
        {}
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('GET /api/card/renew/owner/', () => {
    it('should get all renew owner DCs as SUPERADMIN', async () => {
      await db.RenewOwnerDC.create(RenewOwnerDCFactory.buildMinimal(ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/renew/owner/',
        superAdmin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const response = await authenticatedGet(
        '/api/card/renew/owner/',
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/renew/owner/admin/list', () => {
    it('should get admin list as authenticated user', async () => {
      await db.RenewOwnerDC.create(RenewOwnerDCFactory.buildMinimal(ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/renew/owner/admin/list',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card/renew/owner/admin/list');
      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/renew/owner/:id', () => {
    it('should get renew owner DC by id', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id)
      );

      const response = await authenticatedGet(
        `/api/card/renew/owner/${renewOwnerDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', renewOwnerDC.id);
    });

    it('should return 404 for non-existent renew owner DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/renew/owner/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/renew/owner/pointfocal/validate/:id', () => {
    it('should validate renew owner DC as point focal', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/renew/owner/pointfocal/validate/${renewOwnerDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id)
      );

      const response = await request
        .put(`/api/card/renew/owner/pointfocal/validate/${renewOwnerDC.id}`)
        .send({});

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/renew/owner/admin/validate/:id', () => {
    it('should validate renew owner DC as ADMIN', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/renew/owner/admin/validate/${renewOwnerDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject renew owner DC as ADMIN', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/renew/owner/admin/validate/${renewOwnerDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid renewal request' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/renew/owner/admin/validate/${renewOwnerDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/renew/owner/superadmin/validate/:id', () => {
    it('should validate renew owner DC as SUPERADMIN', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/renew/owner/superadmin/validate/${renewOwnerDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/renew/owner/superadmin/validate/${renewOwnerDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/renew/owner/set-printed/:id', () => {
    it('should set renew owner DC as printed', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/renew/owner/set-printed/${renewOwnerDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildMinimal(ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await request
        .patch(`/api/card/renew/owner/set-printed/${renewOwnerDC.id}`)
        .send({});

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/renew/owner/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildPrinted(ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/renew/owner/undo-print/${renewOwnerDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const renewOwnerDC = await db.RenewOwnerDC.create(
        RenewOwnerDCFactory.buildPrinted(ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/renew/owner/undo-print/${renewOwnerDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
