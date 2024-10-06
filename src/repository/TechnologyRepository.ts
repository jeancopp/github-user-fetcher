import {IDatabase} from "pg-promise";

const insertTechnology =
  async (trx: IDatabase<number>, name: string): Promise<number> => {
    const result = await trx.one(
      `
          INSERT INTO technologies (name)
          VALUES (trim(upper($1)))
          ON CONFLICT (name)
              DO UPDATE SET name = EXCLUDED.name
          RETURNING id
      `,
      [name],
    );
    return result.id;
};

const linkUserToTechnology = async (
  trx: IDatabase<void>,
  userId: number,
  technologyId: number,
): Promise<void> => {
  await trx.none(
    `
        INSERT INTO user_stack (user_id, tech_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `,
    [userId, technologyId],
  );
};

export {
  insertTechnology,
  linkUserToTechnology,
}