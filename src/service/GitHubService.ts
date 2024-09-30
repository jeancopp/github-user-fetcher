import {User} from '../entity/User';
import {FetchUserDto} from "../dto/FetchUserDto";
import {get} from "../helper/request";

const fetchGitHubUser = async (user: FetchUserDto): Promise<User | null> => {
  const {data, status} = await get(`/users/${user.username}`);

  if (status === 404) {
    return null;
  }

  return {
    github_id: data.id,
    login: data.login,
    name: data.name ?? "",
    location: data.location ?? "",
    meta_data: {
      bio: data.bio ?? "",
      public_repos: data.public_repos ?? 0,
      public_gists: data.public_gists ?? 0,
      followers: data.followers ?? 0,
      following: data.following ?? 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
  };
};

interface Repository {
    language: string | null
}

const fetchUserTechnologies = async (
  user: FetchUserDto,
): Promise<string[]> => {

  const {data, status} = await get(`/users/${user.username}/repos`);
  if (status === 404) {
    return [];
  }

  const technologies = new Set<string>();
  data
    .filter((r: Repository) => !!r?.language)
    .forEach((r: Repository) => technologies.add(r?.language ?? ""))

  return Array.from(technologies.values());
};

export {
  fetchGitHubUser,
  fetchUserTechnologies,
}