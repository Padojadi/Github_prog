import { SetMetadata } from '@nestjs/common';
import { UserPermission } from 'src/constants/enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserPermission[]) =>
  SetMetadata(ROLES_KEY, roles);
