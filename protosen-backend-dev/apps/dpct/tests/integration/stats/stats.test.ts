import { request, authenticatedGet } from '../../helpers/request.helper';
import { clearAllTables } from '../../helpers/db.helper';
import { createAdminAccount, createUserAccount, createSuperAdminAccount } from '../../helpers/auth.helper';
import db from '../../../database/models';

describe('Statistics API', () => {
  beforeEach(async () => {
    await clearAllTables();
  });

  describe('GET /api/stats/card', () => {
    it('should get card statistics as ADMIN', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const admin = await createAdminAccount(institution.id);

      const response = await authenticatedGet(
        '/api/stats/card',
        admin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      // Verify structure of statistics response
      if (response.body.data.length > 0) {
        const stat = response.body.data[0];
        expect(stat).toHaveProperty('name');
        expect(stat).toHaveProperty('total');
        expect(stat).toHaveProperty('onHold');
        expect(stat).toHaveProperty('pending');
        expect(stat).toHaveProperty('rejected');
        expect(stat).toHaveProperty('accepted');
        expect(stat).toHaveProperty('confirmed');
      }
    });

    it('should get card statistics as SUPERADMIN', async () => {
      const superAdmin = await createSuperAdminAccount();

      const response = await authenticatedGet(
        '/api/stats/card',
        superAdmin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should fail without ADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);

      const response = await authenticatedGet(
        '/api/stats/card',
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/stats/card');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/stats/card/renew', () => {
    it('should get renewal card statistics as ADMIN', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const admin = await createAdminAccount(institution.id);

      const response = await authenticatedGet(
        '/api/stats/card/renew',
        admin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      // Verify structure of statistics response
      if (response.body.data.length > 0) {
        const stat = response.body.data[0];
        expect(stat).toHaveProperty('name');
        expect(stat).toHaveProperty('total');
        expect(stat).toHaveProperty('onHold');
        expect(stat).toHaveProperty('pending');
        expect(stat).toHaveProperty('rejected');
        expect(stat).toHaveProperty('accepted');
        expect(stat).toHaveProperty('confirmed');
      }
    });

    it('should fail without ADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);

      const response = await authenticatedGet(
        '/api/stats/card/renew',
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/stats/card/renew');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('GET /api/stats/card/duplicata', () => {
    it('should get duplicata card statistics as ADMIN', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const admin = await createAdminAccount(institution.id);

      const response = await authenticatedGet(
        '/api/stats/card/duplicata',
        admin.accessToken!
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      // Verify structure of statistics response
      if (response.body.data.length > 0) {
        const stat = response.body.data[0];
        expect(stat).toHaveProperty('name');
        expect(stat).toHaveProperty('total');
        expect(stat).toHaveProperty('onHold');
        expect(stat).toHaveProperty('pending');
        expect(stat).toHaveProperty('rejected');
        expect(stat).toHaveProperty('accepted');
        expect(stat).toHaveProperty('confirmed');
      }
    });

    it('should fail without ADMIN authorization', async () => {
      const institution = await db.Institution.create({
        name: 'Test Institution',
        sigle: 'TEST',
        type: 'PUBLIC',
      });

      const user = await createUserAccount(institution.id);

      const response = await authenticatedGet(
        '/api/stats/card/duplicata',
        user.accessToken!
      );

      expect([401, 403]).toContain(response.status);
    });

    it('should fail without authentication', async () => {
      const response = await request.get('/api/stats/card/duplicata');

      expect([401, 403]).toContain(response.status);
    });
  });
});
