import type { Access } from 'payload';
import type { User } from '../payload-types';

export const userIsOwnerOrAdmin: Access = ({ req: { user } }) => {
  if (user) {
    if (user.role === 'admin') {
      return true;
    }

    return {
      'user': {
        equals: user.id,
      },
    };
  }

  return false;
};
