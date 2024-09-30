import db from './db';

const insertTechnology =
  async (name: string): Promise<number> => {
    const result = await db.one(
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
  userId: number,
  technologyId: number,
): Promise<void> => {
  await db.none(
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