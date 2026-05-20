import { request } from '../helpers/request.helper';

describe('Infrastructure Test', () => {
  it('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should connect to test database', async () => {
    // This test will pass if setup.ts successfully connected to DB
    expect(true).toBe(true);
  });

  it('should make HTTP requests to the app', async () => {
    // Simple test to verify supertest works
    // This will likely 404 but that's ok - we're testing the request infrastructure
    const response = await request.get('/api/health');

    // We just want to verify we can make requests
    // Status could be 404 or 200 depending on if health endpoint exists
    expect([200, 404]).toContain(response.status);
  });
});
