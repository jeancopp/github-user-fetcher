import axios from 'axios';
import {
  fetchGitHubUser,
  fetchUserTechnologies
} from '../../src/service/GitHubService';
import {FetchUserDto} from "../../src/dto/FetchUserDto";
import {User} from "../../src/entity/User";


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const searchValues: FetchUserDto = {
  username: 'username',
};
describe('GitHubService', (): void => {
  describe('fetchGitHubUser', (): void => {
    beforeEach((): void => {
      jest.clearAllMocks();
    });

    it('should fetch GitHub user data', async (): Promise<void> => {
      let data: {
        name: string;
        location: string;
        id: number;
        login: string
      } = {
        id: 1,
        login: searchValues.username,
        name: 'User Name',
        location: 'Oeiras',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data,
        status: 200,
      });
      const user: (User | null) = await fetchGitHubUser(searchValues);

      expect(user)
        .toHaveProperty('github_id', data.id);
      expect(user)
        .toHaveProperty('login', data.login);
      expect(user)
        .toHaveProperty('name', data.name);
      expect(user)
        .toHaveProperty('location', data.location);

    });
    it('given non existent user should return null', async ()
      : Promise<void> => {
      const searchValues: FetchUserDto = {
        username: 'non-existent-user',
      };

      mockedAxios.get.mockResolvedValueOnce({
        status: 404,
      });
      const user: User | null = await fetchGitHubUser(searchValues);

      expect(user)
        .toBeNull();

    });
    it('when server return 50x should throw an error', async ()
      : Promise<void> => {
      const errorMessage: string = 'Internal Server Error';
      const error: Error = new Error(errorMessage);
      (error as any).response = {
        status: 500,
        statusText: errorMessage,
        data: {
          message: errorMessage,
        },
      };

      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(fetchGitHubUser(searchValues))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('fetchUserTechnologies', (): void => {
    beforeEach((): void => {
      jest.clearAllMocks();
    });

    it('should return a valid tech list', async (): Promise<void> => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {language: 'JavaScript'},
          {language: 'TypeScript'},
          {language: null},
          {language: 'Python'},
          {language: 'JavaScript'},
        ],
        status: 200,
      });

      const technologies: string[] = await fetchUserTechnologies(searchValues);

      expect(technologies)
        .toEqual(['JavaScript', 'TypeScript', 'Python']);
    });

    it('when user does not have any repository should return an empty list',
      async (): Promise<void> => {
        mockedAxios.get.mockResolvedValueOnce({
          data: [],
          status: 200,
        });

        const technologies: string[] = await fetchUserTechnologies(searchValues);

        expect(technologies).toEqual([]);
      });

    it('when the user is not found should return an empty list', async (): Promise<void> => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {},
        status: 404,
      });

      const technologies: string[] = await fetchUserTechnologies(searchValues);

      expect(technologies).toEqual([]);
    });

    it('when repositories have no language should handle it normally', async (): Promise<void> => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {language: null},
          {},
          {language: 'Go'},
          {language: undefined},
        ],
        status: 200,
      });

      const technologies: string[] = await fetchUserTechnologies(searchValues);
      expect(technologies).toEqual(['Go']);
    });

    it('when server return 5xx should trigger an error', async (): Promise<void> => {
      const errorMessage: string = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
      await expect(fetchUserTechnologies(searchValues)).rejects.toThrow(errorMessage);
    });
  });

});