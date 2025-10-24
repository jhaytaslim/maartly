import { User, Tenant, Store } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: User & {
    tenant: Tenant;
    store: Store | null;
  };
}
