import {fetchGitHubUser, fetchUserTechnologies} from "./GitHubService";
import {insertUser} from "../repository/UserRepository";
import {
  insertTechnology,
  linkUserToTechnology
} from "../repository/TechnologyRepository";
import {FetchUserDto} from "../dto/FetchUserDto";
import {UserTechnologiesDto} from "../dto/UserTechnologiesDto";
import {User} from "../entity/User";

export default async function fetchUserService(userData: FetchUserDto)
  : Promise<UserTechnologiesDto | null> {
  const user: User|null = await fetchGitHubUser(userData);
  if (null === user) {
    return null;
  }

  const savedUser = await insertUser(user);
  const technologies = await fetchUserTechnologies(userData);

  if (technologies.length > 0) {
    for (const technology of technologies) {
      const technologyId = await insertTechnology(
        technology,
      );

      await linkUserToTechnology(
        savedUser.id!,
        technologyId,
      );
    }
  }

  return {
    ...savedUser,
    technologies,
  }
}