import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import fetchUserService from "./service/FetchUserService";
import {FetchUserDto} from "./dto/FetchUserDto";

import listUserService from "./service/ListUserService";
import {ListUserDto} from "./dto/ListUserDto";
import {UserTechnologiesDto} from "./dto/UserTechnologiesDto";

const main = async (): Promise<void> => {
  yargs(hideBin(process.argv))
    .command(
      'fetch-user <username>',
      'Fetch a GitHub user and store in the database',
      (yargs) => {
        yargs.positional('username', {
          describe: 'GitHub username',
          type: 'string',
        });
      },
      async (args): Promise<void> => {
        if (args.help) {
          yargs.showHelp();
          return;
        }

        const user: FetchUserDto = {username: args.username as string};
        const storedUser: UserTechnologiesDto | null =
          await fetchUserService(user);

        if(storedUser){
          console.log(
            `User(${user.username}) found and stored in the database.`
          );
        }else{
          console.log(`User not found`)
        }
      },
    )
    .command(
      'list-users',
      'List all users in the database',
      (yargs) => {
        yargs
          .option('location', {
            alias: 'l',
            type: 'string',
            description: 'Filter users by location',
          })
          .option('technology', {
            alias: 't',
            type: 'string',
            description: 'Filter users by technology',
          });
      },
      async (args): Promise<void> => {
        if (args.help) {
          yargs.showHelp();
          return;
        }

        const filter: ListUserDto = {
          location: args.location as string | undefined ?? null,
          technology: args.technology as string | undefined ?? null,
        };

        await listUserService(filter);
      },
    )
    .demandCommand(1, 'You need to specify a command')
    .help()
    .strict()
    .parse();
};

main()
  .catch((error): void => {
    console.error('An unexpected error occurred:', error.message);
  });
