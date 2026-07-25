# Tests Documentation

## Overview

This directory contains all automated tests for the Protosen DPCT API.

## Structure

```
tests/
├── integration/          # Integration tests (API endpoints)
│   ├── auth/            # Authentication tests
│   ├── users/           # User management tests
│   ├── cards/           # Card tests (owner, spouse, child, etc.)
│   ├── files/           # File upload tests
│   ├── institutions/    # Institution tests
│   └── stats/           # Statistics tests
├── unit/                # Unit tests (services, repositories)
│   ├── services/        # Service layer tests
│   └── repositories/    # Repository layer tests
├── helpers/             # Test utilities
│   ├── auth.helper.ts   # Authentication helpers
│   ├── request.helper.ts # HTTP request helpers
│   └── db.helper.ts     # Database helpers
├── factories/           # Test data factories
│   ├── user.factory.ts
│   ├── institution.factory.ts
│   └── childDC.factory.ts
├── setup.ts             # Global test setup
└── README.md            # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Integration Tests Only
```bash
npm run test:integration
```

### Unit Tests Only
```bash
npm run test:unit
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Environment

Tests run with `NODE_ENV=test` and use a separate test database configured in `.env.test`.

**IMPORTANT**: Never run tests against your production or development database!

## Test Database Setup

1. Create a test database:
```sql
CREATE DATABASE dpct_test;
```

2. Update `.env.test` with your test database credentials

3. Run tests - migrations will run automatically

## Writing Tests

### Integration Test Example

```typescript
import { request, authenticatedPost } from '../../helpers/request.helper';
import { createUserAccount, createTestInstitution } from '../../helpers/auth.helper';

describe('POST /api/card/child', () => {
  let userToken: string;
  let institution: any;

  beforeAll(async () => {
    institution = await createTestInstitution();
    const user = await createUserAccount(institution.id);
    userToken = user.accessToken!;
  });

  it('should create a child card', async () => {
    const response = await authenticatedPost('/api/card/child', userToken, {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-01',
      // ... other fields
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

### Unit Test Example

```typescript
import { ChildDCService } from '@/services/card/child/childDC.service';

describe('ChildDCService', () => {
  let service: ChildDCService;

  beforeEach(() => {
    service = new ChildDCService();
  });

  it('should validate child age', () => {
    const isValid = service.validateAge('2000-01-01');
    expect(isValid).toBe(false); // Too old
  });
});
```

## Helpers

### Authentication Helpers

- `createUserAccount()` - Create USER role account
- `createAdminAccount()` - Create ADMIN role account
- `createSuperAdminAccount()` - Create SUPERADMIN role account
- `generateAccessToken()` - Generate JWT token
- `createTestInstitution()` - Create test institution

### Request Helpers

- `authenticatedGet(url, token)` - GET with auth
- `authenticatedPost(url, token, data)` - POST with auth
- `authenticatedPut(url, token, data)` - PUT with auth
- `authenticatedPatch(url, token, data)` - PATCH with auth
- `authenticatedDelete(url, token)` - DELETE with auth
- `authenticatedUpload(url, token)` - File upload with auth

### Database Helpers

- `clearAllTables()` - Clear all data
- `seedBasicData()` - Seed required data
- `resetDatabase()` - Reset DB schema

## Factories

Use factories to generate test data:

```typescript
import { UserFactory } from '../factories/user.factory';
import { ChildDCFactory } from '../factories/childDC.factory';

const userData = UserFactory.build({ email: 'custom@example.com' });
const childData = ChildDCFactory.build({ firstName: 'Custom' });
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `beforeEach/afterEach` to clean state
3. **Descriptive Names**: Test names should describe what they test
4. **Arrange-Act-Assert**: Structure tests with AAA pattern
5. **Mock External Services**: Don't call real external APIs
6. **Fast Tests**: Keep tests fast (< 100ms when possible)

## Coverage Goals

- Services: > 90%
- Repositories: > 85%
- Controllers: > 80% (via integration tests)

## Troubleshooting

### Database Connection Error
- Check `.env.test` credentials
- Ensure test database exists
- Check PostgreSQL is running

### Port Already in Use
- Test server runs on PORT+1 (5003)
- Kill process using the port: `lsof -ti:5003 | xargs kill`

### Tests Hanging
- Check for unclosed database connections
- Ensure `afterAll` hooks are running
- Use `--forceExit` flag: `npm test -- --forceExit`
