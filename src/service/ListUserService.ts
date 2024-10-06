import {ListUserDto} from "../dto/ListUserDto";
import {findUsersByLocationAndTechnology} from "../repository/UserRepository";
import printf from "printf";
import {UserTechnologiesDto} from "../dto/UserTechnologiesDto";

interface UserPrintDto {
  login: string;
  name: string;
  location: string;
  technologies: string[];
}

export const printData = (user: UserPrintDto | UserTechnologiesDto): void =>
  console.log(
    printf(
      '|%-20s|%-40s|%-20s|%-50s|',
      user.login,
      user.name || 'No Name',
      user.location || "Unknown",
      user.technologies.join(',')
    )
  );

const listUserService = async function (filter: ListUserDto): Promise<void> {
  const users: UserTechnologiesDto[] =
    await findUsersByLocationAndTechnology(filter);

  if (users.length === 0) {
    console.log('No users found.');
    return;
  }

  printData({
    login: 'LOGIN',
    name: 'NAME',
    location: 'LOCATION',
    technologies: ['TECHNOLOGIES'],
  });

  users.forEach(printData);
}

export default listUserService;