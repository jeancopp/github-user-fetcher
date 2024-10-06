import {fetchGitHubUser, fetchUserTechnologies} from "./GitHubService";
import {insertUser} from "../repository/UserRepository";
import {
  insertTechnology,
  linkUserToTechnology
} from "../repository/TechnologyRepository";
import {FetchUserDto} from "../dto/FetchUserDto";
import {UserTechnologies} from "../entity/User";

export default async function fetchUserService(userData: FetchUserDto)
  : Promise<UserTechnologies | null> {
  const user = await fetchGitHubUser(userData);
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

    console.trace(
      `Technologies for user ${userData.username} stored.`
    );
  }

  return {
    ...savedUser,
    technologies,
  }
}