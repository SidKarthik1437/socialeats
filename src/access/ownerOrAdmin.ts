import type { Access } from 'payload/config';
import type { User } from '../payload-types';

export const ownerOrAdmin: Access<any, User> = ({ req: { user } }) => {
  if (user) {
    if (user.role === 'admin') {
      return true;
    }

    return {
      'createdBy': {
        equals: user.id,
      },
    };
  }

  return false;
};
