import type { Access } from 'payload/config';
import type { User } from '../payload-types';

export const userIsOwnerOrAdmin: Access<any, User> = ({ req: { user } }) => {
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
