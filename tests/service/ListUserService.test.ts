import listUserService from '../../src/service/ListUserService';
import {
  findUsersByLocationAndTechnology
} from '../../src/repository/UserRepository';
import {User} from '../../src/entity/User';
import {ListUserDto} from '../../src/dto/ListUserDto';
import logger from "../../src/helper/logger";
import {UserTechnologiesDto} from "../../src/dto/UserTechnologiesDto";

jest.mock('../../src/helper/logger');
jest.mock('../../src/repository/UserRepository');


const users: UserTechnologiesDto[] = [
  {
    id: 1,
    github_id: 123456,
    login: 'user1',
    name: 'User One',
    location: 'Location A',
    meta_data: {},
    technologies: ['JAVA', 'PHP', 'NODE.JS'],
  },
  {
    id: 2,
    github_id: 234567,
    login: 'user2',
    name: 'User Two',
    location: 'Location',
    meta_data: {},
    technologies: ['.NET', 'RUBY'],
  },
];

const filter: ListUserDto = {
  location: 'Location A',
  technology: 'JavaScript',
};

describe('ListUserService', (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it('Should print that no users was found',
    async (): Promise<void> => {
      (findUsersByLocationAndTechnology as jest.Mock)
        .mockResolvedValueOnce([]);

      await listUserService(filter);

      expect(logger.info).toHaveBeenCalledWith('No users found.');
      expect(logger.info).toHaveBeenCalledTimes(1);
    });

  it('Should print all the found users', async (): Promise<void> => {
    //given
    (findUsersByLocationAndTechnology as jest.Mock)
      .mockResolvedValueOnce(users);

    //when
    await listUserService(filter);

    //then
    expect(logger.info).toHaveBeenCalledTimes(3);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('LOGIN'));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('NAME'));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('LOCATION'));

    users.forEach(({name, location, login}:
           { name?: string; location?: string; login: string }): void => {
      expect(logger.info)
        .toHaveBeenCalledWith(expect.stringContaining(login));
      expect(logger.info)
        .toHaveBeenCalledWith(expect.stringContaining(name || 'No Name'));
      expect(logger.info)
        .toHaveBeenCalledWith(expect.stringContaining(location || 'Unknown'));
    })
  });

  it('When call database should trigger an error ', async () => {
    (findUsersByLocationAndTechnology as jest.Mock).mockRejectedValueOnce(new Error('Database Error'));
    await expect(listUserService(filter)).rejects.toThrow('Database Error');
    expect(logger.info).not.toHaveBeenCalled();
  });
});