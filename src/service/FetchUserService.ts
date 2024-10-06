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

export default async function fetchUserService(userData: FetchUserDto)
  : Promise<UserTechnologiesDto | null> {
  const user: User | null = await fetchGitHubUser(userData);
  if (null === user) {
    return null;
  }
  const technologies: string[] = await fetchUserTechnologies(userData);

  return await db.tx('insert-data', async trx => {
    const savedUser = await insertUser(trx, user);

    if (!technologies.length) {
      return {
        ...savedUser,
        technologies: [],
      }
    }

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
}