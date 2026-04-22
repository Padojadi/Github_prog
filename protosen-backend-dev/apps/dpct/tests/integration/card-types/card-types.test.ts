import { request, authenticatedGet, authenticatedPost, authenticatedPut, authenticatedDelete } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createSuperAdminAccount, createUserAccount } from '../../helpers/auth.helper';
import { CardTypeFactory } from '../../factories/cardType.factory';
import db from '../../../database/models';

describe('Card Types API', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  describe('POST /api/card-types/', () => {
    it('should create card type as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const cardTypeData = CardTypeFactory.build({ name: 'DC-TEST' });

      const response = await authenticatedPost(
        '/api/card-types/',
        superAdmin.accessToken!,
        cardTypeData
      );

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('name', 'DC-TEST');
      expect(response.body).toHaveProperty('id');
    });

    it('should fail to create card type without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const cardTypeData = CardTypeFactory.build();

      const response = await authenticatedPost(
        '/api/card-types/',
        user.accessToken!,
        cardTypeData
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail to create card type without authentication', async () => {
      const cardTypeData = CardTypeFactory.build();

      const response = await request
        .post('/api/card-types/')
        .send(cardTypeData);

      expect([401, 403]).toContain(response.status);
    });

    it('should fail with invalid data', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedPost(
        '/api/card-types/',
        superAdmin.accessToken!,
        { name: '' } // Invalid: empty name
      );

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /api/card-types/', () => {
    it('should get all card types as authenticated user', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);

      // Create some card types
      await db.CardType.create(CardTypeFactory.build({ name: 'DC' }));
      await db.CardType.create(CardTypeFactory.build({ name: 'CT' }));

      const response = await authenticatedGet(
        '/api/card-types/',
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/card-types/');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/card-types/:id', () => {
    it('should get card type by id as authenticated user', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const cardType = await db.CardType.create(CardTypeFactory.build({ name: 'DC' }));

      const response = await authenticatedGet(
        `/api/card-types/${cardType.id}`,
        user.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', cardType.id);
      expect(response.body).toHaveProperty('name', 'DC');
    });

    it('should return 404 for non-existent card type', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedGet(
        `/api/card-types/${fakeId}`,
        user.accessToken!
      );

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const cardType = await db.CardType.create(CardTypeFactory.build());

      const response = await request.get(`/api/card-types/${cardType.id}`);

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /api/card-types/:id', () => {
    it('should update card type as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const cardType = await db.CardType.create(CardTypeFactory.build({ name: 'DC' }));

      const updateData = {
        name: 'DC-UPDATED',
        description: 'Updated description',
        observation: ['New observation'],
      };

      const response = await authenticatedPut(
        `/api/card-types/${cardType.id}`,
        superAdmin.accessToken!,
        updateData
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'DC-UPDATED');
      expect(response.body).toHaveProperty('description', 'Updated description');
    });

    it('should fail to update without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const cardType = await db.CardType.create(CardTypeFactory.build());

      const response = await authenticatedPut(
        `/api/card-types/${cardType.id}`,
        user.accessToken!,
        { name: 'Updated' }
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent card type', async () => {
      const superAdmin = await createSuperAdminAccount();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedPut(
        `/api/card-types/${fakeId}`,
        superAdmin.accessToken!,
        { name: 'Updated' }
      );

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/card-types/:id', () => {
    it('should delete card type as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();
      const cardType = await db.CardType.create(CardTypeFactory.build());

      const response = await authenticatedDelete(
        `/api/card-types/${cardType.id}`,
        superAdmin.accessToken!
      );

      expect([200, 204]).toContain(response.status);

      // Verify deletion
      const deletedCardType = await db.CardType.findByPk(cardType.id);
      expect(deletedCardType).toBeNull();
    });

    it('should fail to delete without SUPERADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);
      const cardType = await db.CardType.create(CardTypeFactory.build());

      const response = await authenticatedDelete(
        `/api/card-types/${cardType.id}`,
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should return 404 for non-existent card type', async () => {
      const superAdmin = await createSuperAdminAccount();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await authenticatedDelete(
        `/api/card-types/${fakeId}`,
        superAdmin.accessToken!
      );

      expect(response.status).toBe(404);
    });
  });
});
