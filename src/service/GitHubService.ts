import axios from 'axios';
import {User} from '../entity/User';
import {FetchUserDto} from "../dto/FetchUserDto";

const GITHUB_API_URL = 'https://api.github.com';

export const fetchGitHubUser = async (user: FetchUserDto): Promise<User> => {
    const response = await axios.get(`${GITHUB_API_URL}/users/${user.username}`);
    const data = response.data;

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

export const fetchUserTechnologies = async (
    user: FetchUserDto,
): Promise<string[]> => {
    const technologies = new Set<string>();

    const {data} = await axios.get(
        `${GITHUB_API_URL}/users/${user.username}/repos`,
    );

    data
        .filter((r: Repository) => !!r?.language)
        .forEach((r: Repository) => technologies.add(r?.language ?? ""))

    return Array.from(technologies.values());
};
