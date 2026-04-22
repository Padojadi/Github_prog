import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedPatch, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { OwnerDCFactory } from '../../factories/ownerDC.factory';
import db from '../../../database/models';
import { EDocumentState } from '../../../src/types/card.types';

describe('Owner DC API', () => {
  let institution: any;
  let user: any;
  let admin: any;
  let superAdmin: any;

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
  });

  describe('POST /api/card/owner/', () => {
    it('should create owner DC as authenticated user', async () => {
      const ownerDCData = OwnerDCFactory.buildMinimal(user.user.id, institution.id);

      const response = await authenticatedPost(
        '/api/card/owner/',
        user.accessToken!,
        ownerDCData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body.data || response.body).toHaveProperty('firstName', ownerDCData.firstName);
      expect(response.body.data || response.body).toHaveProperty('lastName', ownerDCData.lastName);
      expect(response.body.data || response.body).toHaveProperty('documentStage', EDocumentState.PENDING);
    });

    it('should fail without authentication', async () => {
      const ownerDCData = OwnerDCFactory.buildMinimal(user.user.id, institution.id);

      const response = await request
        .post('/api/card/owner/')
        .send(ownerDCData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const response = await authenticatedPost(
        '/api/card/owner/',
        user.accessToken!,
        { firstName: '' } // Invalid: missing required fields
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card/owner/', () => {
    it('should get all owner DCs as SUPERADMIN', async () => {
      // Create some owner DCs
      await db.OwnerDiplomaticCard.create(OwnerDCFactory.buildMinimal(user.user.id, institution.id));
      await db.OwnerDiplomaticCard.create(OwnerDCFactory.buildMinimal(user.user.id, institution.id));

      const response = await authenticatedGet(
        '/api/card/owner/',
        superAdmin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const response = await authenticatedGet(
        '/api/card/owner/',
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card/owner/admin/list', () => {
    it('should get owner DCs for admin institution', async () => {
      // Create owner DC for this institution
      await db.OwnerDiplomaticCard.create(OwnerDCFactory.buildMinimal(user.user.id, institution.id));

      const response = await authenticatedGet(
        '/api/card/owner/admin/list',
        admin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toBeDefined();
    });

    it('should work for regular user', async () => {
      const response = await authenticatedGet(
        '/api/card/owner/admin/list',
        user.accessToken!
      );

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/card/owner/:id', () => {
    it('should get owner DC by id', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await authenticatedGet(
        `/api/card/owner/${ownerDC.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body.data || response.body).toHaveProperty('id', ownerDC.id);
    });

    it('should return 404 for non-existent owner DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card/owner/${fakeId}`,
        user.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/owner/:id', () => {
    it('should update owner DC', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await authenticatedPatch(
        `/api/card/owner/${ownerDC.id}`,
        user.accessToken!,
        updateData
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail for non-existent owner DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPatch(
        `/api/card/owner/${fakeId}`,
        user.accessToken!,
        { firstName: 'Updated' }
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/card/owner/:id', () => {
    it('should update owner DC with PUT', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const updateData = OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
        firstName: 'Complete',
        lastName: 'Update',
      });

      const response = await authenticatedPut(
        `/api/card/owner/${ownerDC.id}`,
        user.accessToken!,
        updateData
      );

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('PUT /api/card/owner/pointfocal/validate/:id', () => {
    it('should validate owner DC as point focal', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
          documentStage: EDocumentState.PENDING,
        })
      );

      const response = await authenticatedPut(
        `/api/card/owner/pointfocal/validate/${ownerDC.id}`,
        user.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await request
        .put(`/api/card/owner/pointfocal/validate/${ownerDC.id}`)
        .send({});

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/owner/admin/validate/:id', () => {
    it('should validate owner DC as ADMIN', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/owner/admin/validate/${ownerDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject owner DC as ADMIN', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
          documentStage: EDocumentState.ONHOLD,
        })
      );

      const response = await authenticatedPut(
        `/api/card/owner/admin/validate/${ownerDC.id}`,
        admin.accessToken!,
        { approve: false, rejectReason: 'Invalid documents' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without ADMIN authorization', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await authenticatedPut(
        `/api/card/owner/admin/validate/${ownerDC.id}`,
        user.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card/owner/superadmin/validate/:id', () => {
    it('should validate owner DC as SUPERADMIN', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/owner/superadmin/validate/${ownerDC.id}`,
        superAdmin.accessToken!,
        { approve: true }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should reject owner DC as SUPERADMIN', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
          documentStage: EDocumentState.CONFIRMED,
        })
      );

      const response = await authenticatedPut(
        `/api/card/owner/superadmin/validate/${ownerDC.id}`,
        superAdmin.accessToken!,
        { approve: false, rejectReason: 'Policy violation' }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await authenticatedPut(
        `/api/card/owner/superadmin/validate/${ownerDC.id}`,
        admin.accessToken!,
        { approve: true }
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/owner/set-printed/:id', () => {
    it('should set owner DC as printed', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id, {
          documentStage: EDocumentState.APPROVED,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/owner/set-printed/${ownerDC.id}`,
        user.accessToken!,
        { travellingNumber: ownerDC.travellingNumber }
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await request
        .patch(`/api/card/owner/set-printed/${ownerDC.id}`)
        .send({ travellingNumber: ownerDC.travellingNumber });

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PATCH /api/card/owner/undo-print/:id', () => {
    it('should undo print status as SUPERADMIN', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildPrinted({
          creatorId: user.user.id,
          organismId: institution.id,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/owner/undo-print/${ownerDC.id}`,
        superAdmin.accessToken!,
        {}
      );

      expect([200, 201]).toContain(response.status);
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildPrinted({
          creatorId: user.user.id,
          organismId: institution.id,
        })
      );

      const response = await authenticatedPatch(
        `/api/card/owner/undo-print/${ownerDC.id}`,
        user.accessToken!,
        {}
      );

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('DELETE /api/card/owner/:id', () => {
    it('should delete owner DC as SUPERADMIN', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await authenticatedDelete(
        `/api/card/owner/${ownerDC.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedOwnerDC = await db.OwnerDiplomaticCard.findByPk(ownerDC.id);
      expect(deletedOwnerDC).toBeNull();
    });

    it('should fail without SUPERADMIN authorization', async () => {
      const ownerDC = await db.OwnerDiplomaticCard.create(
        OwnerDCFactory.buildMinimal(user.user.id, institution.id)
      );

      const response = await authenticatedDelete(
        `/api/card/owner/${ownerDC.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent owner DC', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedDelete(
        `/api/card/owner/${fakeId}`,
        superAdmin.accessToken!
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('Workflow Integration Test', () => {
    it('should complete full card workflow from creation to print', async () => {
      // Step 1: Create card
      const ownerDCData = OwnerDCFactory.buildMinimal(user.user.id, institution.id);
      const createResponse = await authenticatedPost(
        '/api/card/owner/',
        user.accessToken!,
        ownerDCData
      );
      expect([200, 201]).toContain(createResponse.status);
      const cardId = (createResponse.body.data || createResponse.body).id;

      // Step 2: Point Focal validation
      const pointFocalResponse = await authenticatedPut(
        `/api/card/owner/pointfocal/validate/${cardId}`,
        user.accessToken!,
        {}
      );
      expect([200, 201]).toContain(pointFocalResponse.status);

      // Step 3: Admin validation
      const adminResponse = await authenticatedPut(
        `/api/card/owner/admin/validate/${cardId}`,
        admin.accessToken!,
        { approve: true }
      );
      expect([200, 201]).toContain(adminResponse.status);

      // Step 4: SuperAdmin validation
      const superAdminResponse = await authenticatedPut(
        `/api/card/owner/superadmin/validate/${cardId}`,
        superAdmin.accessToken!,
        { approve: true }
      );
      expect([200, 201]).toContain(superAdminResponse.status);

      // Step 5: Set as printed
      const printResponse = await authenticatedPatch(
        `/api/card/owner/set-printed/${cardId}`,
        user.accessToken!,
        { travellingNumber: ownerDCData.travellingNumber }
      );
      expect([200, 201]).toContain(printResponse.status);
    });
  });
});
