import {fetchGitHubUser, fetchUserTechnologies} from "./GitHubService";
import {insertUser} from "../repository/UserRepository";
import {
  insertTechnology,
  linkUserToTechnology
} from "../repository/TechnologyRepository";
import {FetchUserDto} from "../dto/FetchUserDto";
import {UserTechnologiesDto} from "../dto/UserTechnologiesDto";
import {User} from "../entity/User";
import db from "../repository/db";
import logger from "../helper/logger";

export default async function fetchUserService(userData: FetchUserDto)
  : Promise<UserTechnologiesDto | null> {
  try {
    logger.debug(`Fetching User ${userData.username}`);
    const user: User | null = await fetchGitHubUser(userData);
    if (null === user) {
      logger.debug(`User not found`);
      return null;
    }

    logger.debug(`Fetching User technologies`);
    const technologies: string[] = await fetchUserTechnologies(userData);

    logger.debug(`Stating transaction`);
    return await db.tx('insert-data', async trx => {
      logger.debug(`Persisting user`);
      const savedUser = await insertUser(trx, user);

      if (!technologies.length) {
        logger.debug(`User has no technologies found`);
        return {
          ...savedUser,
          technologies: [],
        }
      }

      logger.debug(`Persisting user technologies`);
      for (const technology of technologies) {
        const technologyId = await insertTechnology(trx, technology);

        await linkUserToTechnology(
          trx,
          savedUser.id!,
          technologyId,
        );
      }

      return {
        ...savedUser,
        technologies,
      }
    });
  }catch (err){
    logger.debug(`Error on fetching user process: ${err}`);
    throw new Error('Internal error on fetching user data');
  }
}