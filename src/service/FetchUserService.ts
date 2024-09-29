import {fetchGitHubUser, fetchUserTechnologies} from "./GitHubService";
import {insertUser} from "../repository/UserRepository";
import {insertTechnology, linkUserToTechnology} from "../repository/TechnologyRepository";
import {FetchUserDto} from "../dto/FetchUserDto";

export default async function fetchUserService(userData: FetchUserDto) {
    const user = await fetchGitHubUser(userData);

    const savedUser = await insertUser(user);
    console.trace(`User ${userData.username} stored in the database.`);

    const technologies = await fetchUserTechnologies(userData);

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
        `Technologies for user ${userData.username} stored in the database.`,
    );
}