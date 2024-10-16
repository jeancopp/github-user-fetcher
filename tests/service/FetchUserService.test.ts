import {
  fetchGitHubUser,
  fetchUserTechnologies
} from '../../src/service/GitHubService';
import {insertUser} from '../../src/repository/UserRepository';
import {
  insertTechnology,
  linkUserToTechnology
} from '../../src/repository/TechnologyRepository';
import {FetchUserDto} from '../../src/dto/FetchUserDto';

import fetchUserService from '../../src/service/FetchUserService';
import {User} from "../../src/entity/User";
import db from '../../src/repository/db';

jest.mock('../../src/service/GitHubService');
jest.mock('../../src/repository/UserRepository');
jest.mock('../../src/repository/TechnologyRepository');
jest.mock('../../src/repository/db');

describe('fetchUserService', (): void => {
  const userDto: FetchUserDto = {username: 'testuser'};
  const user: User = {
    github_id: 123456,
    login: userDto.username,
    name: 'User On GitHub',
    location: 'Github City',
    meta_data: {},
  };

  const mockTechnologies: string[] = ['JavaScript', 'TypeScript'];
  const mockTrx = jest.fn();

  beforeEach(():void => {
    jest.clearAllMocks();
    (db.tx as jest.Mock).mockImplementation((_, cb) => cb(mockTrx));
  });

  it('should insert user with their stack into the db',
    async (): Promise<void> => {
      //given
      (fetchGitHubUser as jest.Mock).mockResolvedValueOnce(user);
      (insertUser as jest.Mock).mockResolvedValueOnce({id: 1});
      (fetchUserTechnologies as jest.Mock)
        .mockResolvedValueOnce(mockTechnologies);
      (insertTechnology as jest.Mock).mockResolvedValueOnce(1);
      (linkUserToTechnology as jest.Mock)
        .mockResolvedValueOnce(undefined);

      //when
      await fetchUserService(userDto);

      //then
      expect(fetchGitHubUser).toHaveBeenCalledTimes(1);
      expect(fetchGitHubUser).toHaveBeenCalledWith(userDto);
      expect(insertUser).toHaveBeenCalledTimes(1);
      expect(insertUser).toHaveBeenCalledWith(mockTrx, user);
      expect(fetchUserTechnologies).toHaveBeenCalledTimes(1);
      expect(fetchUserTechnologies).toHaveBeenCalledWith(userDto);
      expect(insertTechnology).toHaveBeenCalledTimes(mockTechnologies.length);
      mockTechnologies.forEach(tech => {
        expect(insertTechnology).toHaveBeenCalledWith(mockTrx, tech);
      });
      expect(linkUserToTechnology).toHaveBeenCalledTimes(mockTechnologies.length);

    });

  it('should not call any item', async ():Promise<void> => {
    // given
    (fetchGitHubUser as jest.Mock).mockResolvedValueOnce(null);
    // when
    await fetchUserService(userDto);

    // then
    expect(insertUser).not.toHaveBeenCalled();
    expect(fetchUserTechnologies).not.toHaveBeenCalled();
    expect(insertTechnology).not.toHaveBeenCalled();
    expect(linkUserToTechnology).not.toHaveBeenCalled();
  });
});
