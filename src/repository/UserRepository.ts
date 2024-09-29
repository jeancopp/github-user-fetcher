import db from './db';
import {User} from '../entity/User';

export const insertUser = async (user: User): Promise<User> => {
    const query = `
    INSERT INTO users (
      github_id, login, name, location, meta_data, created_at, updated_at
    ) VALUES (
      $[github_id], $[login], $[name], $[location], $[meta_data], NOW(), NOW()
    )
    ON CONFLICT (github_id) DO UPDATE SET
      login = EXCLUDED.login,
      name = EXCLUDED.name,
      location = EXCLUDED.location,
      meta_data = EXCLUDED.meta_data,
      updated_at = NOW()
    RETURNING *;
  `;
    return await db.one(query, user);
};
