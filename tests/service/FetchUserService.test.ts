
import { fetchGitHubUser, fetchUserTechnologies } from '../../src/service/GitHubService';
import { insertUser } from '../../src/repository/UserRepository';
import { insertTechnology, linkUserToTechnology } from '../../src/repository/TechnologyRepository';
import { FetchUserDto } from '../../src/dto/FetchUserDto';

import fetchUserService from '../../src/service/FetchUserService';
import {User} from "../../src/entity/User";

jest.mock('../../src/service/GitHubService');
jest.mock('../../src/repository/UserRepository');
jest.mock('../../src/repository/TechnologyRepository');

describe('fetchUserService', () => {
    const user: User = {
        github_id: 123456,
        login: 'userongithub',
        name: 'User On GitHub',
        location: 'Github City',
        meta_data: {},
    };

    const userDto: FetchUserDto = { username: 'testuser' };
    const mockTechnologies = ['JavaScript', 'TypeScript'];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should insert user with their stack into the db', async () => {
        //given
        (fetchGitHubUser as jest.Mock).mockResolvedValueOnce(user);
        (insertUser as jest.Mock).mockResolvedValueOnce({ id: 1 });
        (fetchUserTechnologies as jest.Mock).mockResolvedValueOnce(mockTechnologies);
        (insertTechnology as jest.Mock).mockResolvedValueOnce(1);
        (linkUserToTechnology as jest.Mock).mockResolvedValueOnce(undefined);

        //when
        await fetchUserService(userDto);

        //then
        expect(fetchGitHubUser).toHaveBeenCalledTimes(1);
        expect(fetchGitHubUser).toHaveBeenCalledWith(userDto);
        expect(insertUser).toHaveBeenCalledTimes(1);
        expect(insertUser).toHaveBeenCalledWith(user);
        expect(fetchUserTechnologies).toHaveBeenCalledTimes(1);
        expect(fetchUserTechnologies).toHaveBeenCalledWith(userDto);
        expect(insertTechnology).toHaveBeenCalledTimes(mockTechnologies.length);
        mockTechnologies.forEach(tech => {
            expect(insertTechnology).toHaveBeenCalledWith(tech);
        });
        expect(linkUserToTechnology).toHaveBeenCalledTimes(mockTechnologies.length);
    });

    it('should just log when user is not found', async () => {
        // given
        (fetchGitHubUser as jest.Mock).mockResolvedValueOnce(null);
        const consoleSpy =
            jest.spyOn(console, 'log').mockImplementation();

        // when
        await fetchUserService(userDto);

        // then
        expect(consoleSpy).toHaveBeenCalledWith('User not found!');

        expect(insertUser).not.toHaveBeenCalled();
        expect(fetchUserTechnologies).not.toHaveBeenCalled();
        expect(insertTechnology).not.toHaveBeenCalled();
        expect(linkUserToTechnology).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
