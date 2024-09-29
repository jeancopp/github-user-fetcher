import axios from 'axios';
import {FetchUserDto} from "../dto/FetchUserDto";

const GITHUB_API_URL = 'https://api.github.com';

export const fetchGitHubUser = async (user: FetchUserDto): Promise<object> => {
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
