import listUserService from '../../src/service/ListUserService';
import {
  findUsersByLocationAndTechnology
} from '../../src/repository/UserRepository';
import {User} from '../../src/entity/User';
import {ListUserDto} from '../../src/dto/ListUserDto';

jest.mock('../../src/repository/UserRepository');

const users: User[] = [
  {
    id: 1,
    github_id: 123456,
    login: 'user1',
    name: 'User One',
    location: 'Location A',
    meta_data: {},
  },
  {
    id: 2,
    github_id: 234567,
    login: 'user2',
    name: 'User Two',
    location: 'Location',
    meta_data: {},
  },
];

const filter: ListUserDto = {
  location: 'Location A',
  technology: 'JavaScript',
};

describe('ListUserService', (): void => {
  let consoleSpy: jest.SpyInstance;
  beforeEach((): void => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach((): void => {
    consoleSpy.mockRestore();
  });

  it('Should print that no users was found',
    async (): Promise<void> => {
      (findUsersByLocationAndTechnology as jest.Mock)
        .mockResolvedValueOnce([]);

      await listUserService(filter);

      expect(consoleSpy).toHaveBeenCalledWith('No users found.');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

  it('Should print all the found users', async (): Promise<void> => {
    //given
    (findUsersByLocationAndTechnology as jest.Mock)
      .mockResolvedValueOnce(users);

    //when
    await listUserService(filter);

    //then
    expect(consoleSpy).toHaveBeenCalledTimes(3);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('LOGIN'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('NAME'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('LOCATION'));

    users.forEach(({name, location, login}:
           { name?: string; location?: string; login: string }): void => {
      expect(consoleSpy)
        .toHaveBeenCalledWith(expect.stringContaining(login));
      expect(consoleSpy)
        .toHaveBeenCalledWith(expect.stringContaining(name || 'No Name'));
      expect(consoleSpy)
        .toHaveBeenCalledWith(expect.stringContaining(location || 'Unknown'));
    })
  });

  it('When call database should trigger an error ', async () => {
    (findUsersByLocationAndTechnology as jest.Mock).mockRejectedValueOnce(new Error('Database Error'));
    await expect(listUserService(filter)).rejects.toThrow('Database Error');
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});