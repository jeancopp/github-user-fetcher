import db from './db';
import {User} from '../entity/User';
import {ListUserDto} from "../dto/ListUserDto";
import {IDatabase} from "pg-promise";

export const insertUser = async (trx: IDatabase<User>, user: User):
  Promise<User> => {
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
  return await trx.one(query, user);
};

export const findUsersByLocationAndTechnology =
    async (filter: ListUserDto): Promise<User[]> => await db.any(
      `
          SELECT u.*
          FROM users u
          WHERE upper(coalesce(u.location, ''))
              like (upper(coalesce($1, u.location, '')) || '%')
            and exists(
                select 1
                from user_stack us
                join public.technologies t on t.id = us.tech_id
                where us.user_id = u.id
                 and upper(t.name) like upper(coalesce($2, t.name)))
      `,
      [filter.location, filter.technology],
    );
