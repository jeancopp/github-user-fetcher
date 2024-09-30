import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import {FetchUserDto} from "./dto/FetchUserDto";
import fetchUserService from "./service/FetchUserService";
import listUserService from "./service/ListUserService";
import {ListUserDto} from "./dto/ListUserDto";

const main = async () => {
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
      async (args) => {
        const user: FetchUserDto = {username: args.username as string};
        await fetchUserService(user);

        console.log(
          `Technologies for user ${user.username} stored in the database.`,
        );
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
      async (args) => {
        const filter : ListUserDto = {
          location: args.location as string|undefined ?? null,
          technology: args.technology as string|undefined ?? null,
        };

        await listUserService(filter)

      },
    )
    .demandCommand(1, 'You need to specify a command')
    .help()
    .strict()
    .parse();
};

main()
  .catch((error) => {
    console.error('An unexpected error occurred:', error.message);
  });
