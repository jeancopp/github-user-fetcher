import {ListUserDto} from "../dto/ListUserDto";
import {findUsersByLocationAndTechnology} from "../repository/UserRepository";
import printf from "printf";
import {UserTechnologiesDto} from "../dto/UserTechnologiesDto";
import logger from "../helper/logger";

interface UserPrintDto {
  login: string;
  name: string;
  location: string;
  technologies: string[];
}

export const printData =
  (user: UserPrintDto | UserTechnologiesDto, asJson: boolean= false): void => {
  logger.debug('PrintData called')
  if(asJson) {
    logger.info(JSON.stringify({
      login: user.login,
      name: user.name || 'No Name',
      location: user.location || 'Unknown',
      technologies: user.technologies.join(','),
    }, null, 2));
    return;
  }

  logger.info(
    printf(
      '|%-20s|%-40s|%-20s|%-50s|',
      user.login,
      user.name || 'No Name',
      user.location || "Unknown",
      user.technologies.join(',')
    )
  )
};

const listUserService = async function (filter: ListUserDto): Promise<void> {
  const users: UserTechnologiesDto[] =
    await findUsersByLocationAndTechnology(filter);

  if (users.length === 0) {
    logger.info('No users found.');
    return;
  }

  printData({
    login: 'LOGIN',
    name: 'NAME',
    location: 'LOCATION',
    technologies: ['TECHNOLOGIES'],
  });

  users.forEach( (u:UserTechnologiesDto) => printData(u));
}

export default listUserService;