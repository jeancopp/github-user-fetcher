import db from './db';
import {User} from '../entity/User';
import {ListUserDto} from "../dto/ListUserDto";
import {IDatabase} from "pg-promise";
import {UserTechnologiesDto} from "../dto/UserTechnologiesDto";

export const insertUser = async (trx: IDatabase<User>, user: User):
  Promise<User> => {
  const query = `
      INSERT INTO users (github_id, login, name, location, meta_data,
                         created_at, updated_at)
      VALUES ($[github_id], $[login], $[name], $[location], $[meta_data], NOW(),
                NOW())
      ON CONFLICT (github_id) DO UPDATE SET login      = EXCLUDED.login,
                                            name       = EXCLUDED.name,
                                            location   = EXCLUDED.location,
                                            meta_data  = EXCLUDED.meta_data,
                                            updated_at = NOW()
      RETURNING *;
  `;
  return await trx.one(query, user);
};

export const findUsersByLocationAndTechnology =
  async (filter: ListUserDto): Promise<UserTechnologiesDto[]> => await db.any(
    `
        SELECT u.*,
               json_agg(t.name) as technologies
        FROM users u
                 left JOIN user_stack us ON u.id = us.user_id
                 left JOIN technologies t ON us.tech_id = t.id
        WHERE upper(coalesce(u.location, '')) LIKE
              (upper(coalesce($1, u.location, '')) || '%')
          and upper(coalesce(t.name, '')) LIKE
              (upper(coalesce($2, t.name, '')) || '%')
        GROUP BY u.id, u.login;
    `,
    [filter.location, filter.technology],
  );
