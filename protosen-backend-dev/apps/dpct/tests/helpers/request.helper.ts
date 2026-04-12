import supertest from 'supertest';
import app from '../../src/app.test';

/**
 * Create a supertest request instance
 */
export const request = supertest(app);

/**
 * Helper to make authenticated GET request
 */
export function authenticatedGet(url: string, token: string) {
  return request.get(url).set('Authorization', `Bearer ${token}`);
}

/**
 * Helper to make authenticated POST request
 */
export function authenticatedPost(url: string, token: string, data?: any) {
  return request
    .post(url)
    .set('Authorization', `Bearer ${token}`)
    .send(data);
}

/**
 * Helper to make authenticated PUT request
 */
export function authenticatedPut(url: string, token: string, data?: any) {
  return request
    .put(url)
    .set('Authorization', `Bearer ${token}`)
    .send(data);
}

/**
 * Helper to make authenticated PATCH request
 */
export function authenticatedPatch(url: string, token: string, data?: any) {
  return request
    .patch(url)
    .set('Authorization', `Bearer ${token}`)
    .send(data);
}

/**
 * Helper to make authenticated DELETE request
 */
export function authenticatedDelete(url: string, token: string) {
  return request
    .delete(url)
    .set('Authorization', `Bearer ${token}`);
}

/**
 * Helper to make authenticated multipart/form-data POST request
 */
export function authenticatedUpload(url: string, token: string) {
  return request
    .post(url)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'multipart/form-data');
}

/**
 * Helper to make authenticated multipart/form-data PUT request
 */
export function authenticatedUploadPut(url: string, token: string) {
  return request
    .put(url)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'multipart/form-data');
}
