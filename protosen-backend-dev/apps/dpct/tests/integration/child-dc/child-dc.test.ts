import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { ChildDCFactory } from '../../factories/childDC.factory';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Child DC API', () => {
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

    // Create owner DC (required for child)
    ownerDC = await db.OwnerDiplomaticCard.create(
      OwnerDCFactory.buildMinimal(user.user.id, institution.id)
    );
  });

  describe('POST /api/card/child/', () => {
    it('should create child DC as authenticated user', async () => {
      const childDCData = ChildDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await authenticatedPost(
        '/api/card/child/',
        user.accessToken!,
        childDCData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('firstName', childDCData.firstName);
      expect(response.body.data || response.body).toHaveProperty('documentStage', EDocumentState.PENDING);
    });

    it('should fail without authentication', async () => {
      const childDCData = ChildDCFactory.buildMinimal(
        user.user.id,
        institution.id,
        ownerDC.id
      );

      const response = await request
        .post('/api/card/child/')
        .send(childDCData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const response = await authenticatedPost(
        '/api/card/child/',
        user.accessToken!,
        { firstName: '' } // Invalid: missing required fields
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card/child/', () => {
    it('should get all child DCs as authenticated user', async () => {
      // Create some child DCs
      await db.ChildDC.create(ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));
      await db.ChildDC.create(ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id));

      const response = await authenticatedGet(
        '/api/card/child/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card/child/');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/child/:id', () => {
    it('should get child DC by id', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedGet(
        `/api/card/child/${childDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', childDC.id);
    });

    it('should return 404 for non-existent child DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/child/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/child/:id', () => {
    it('should update child DC', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await authenticatedPatch(
        `/api/card/child/${childDC.id}`,
        user.accessToken!,
        updateData
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail for non-existent child DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPatch(
        `/api/card/child/${fakeId}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/child/pointfocal/validate/:id', () => {
    it('should validate child DC as point focal', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/child/pointfocal/validate/${childDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PUT /api/card/child/admin/validate/:id', () => {
    it('should validate child DC as ADMIN', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/child/admin/validate/${childDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject child DC as ADMIN', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/child/admin/validate/${childDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid documents' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/child/admin/validate/${childDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/child/superadmin/validate/:id', () => {
    it('should validate child DC as SUPERADMIN', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/child/superadmin/validate/${childDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPut(
        `/api/card/child/superadmin/validate/${childDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/child/set-printed/:id', () => {
    it('should set child DC as printed', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/child/set-printed/${childDC.id}`,
        user.accessToken!,
        { travellingNumber: childDC.travellingNumber }
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/child/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/child/undo-print/${childDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildPrinted(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedPatch(
        `/api/card/child/undo-print/${childDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/card/child/:id', () => {
    it('should delete child DC as SUPERADMIN', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/child/${childDC.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedChildDC = await db.ChildDC.findByPk(childDC.id);
      expect(deletedChildDC).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const childDC = await db.ChildDC.create(
        ChildDCFactory.buildMinimal(user.user.id, institution.id, ownerDC.id)
      );

      const response = await authenticatedDelete(
        `/api/card/child/${childDC.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });
});
