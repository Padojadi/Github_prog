import { faker } from '@faker-js/faker';
import { RoleEnum } from '../../src/types/roles';

export interface UserFactoryData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: RoleEnum;
  organismId?: string;
  password?: string;
  status?: 'active' | 'inactive';
  isVerified?: boolean;
}

export class UserFactory {
  static build(overrides: UserFactoryData = {}) {
    return {
      email: overrides.email || faker.internet.email(),
      firstName: overrides.firstName || faker.person.firstName(),
      lastName: overrides.lastName || faker.person.lastName(),
      phone: overrides.phone || faker.phone.number('+2430#########'),
      role: overrides.role || RoleEnum.USER,
      organismId: overrides.organismId,
      password: overrides.password || 'Test1234!',
      status: overrides.status || 'active',
      isVerified: overrides.isVerified !== undefined ? overrides.isVerified : true,
      verificationCode: null,
      verificationCodeExpiration: null,
    };
  }

  static buildMany(count: number, overrides: UserFactoryData = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}
