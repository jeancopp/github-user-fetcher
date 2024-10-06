import {ListUserDto} from "../dto/ListUserDto";
import {findUsersByLocationAndTechnology} from "../repository/UserRepository";
import {User} from "../entity/User";
import printf from "printf";

interface UserPrintDto {
  login: string;
  name: string;
  location: string;
}

const printData = (user: UserPrintDto | User): void =>
  console.log(
    printf(
      '|%-20s|%-50s|%-20s|',
      user.login,
      user.name || 'No Name',
      user.location || "Unknown"
    )
  );

const listUserService = async function (filter: ListUserDto): Promise<void> {
  const users: User[] =
    await findUsersByLocationAndTechnology(filter);

  if (users.length === 0) {
    console.log('No users found.');
    return;
  }

  printData({
    login: 'LOGIN',
    name: 'NAME',
    location: 'LOCATION',
  });

  users.forEach(printData);
}

export default listUserService;