import logger from "./helper/logger";
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import fetchUserService from "./service/FetchUserService";
import {FetchUserDto} from "./dto/FetchUserDto";

import listUserService, {printData} from "./service/ListUserService";
import {ListUserDto} from "./dto/ListUserDto";
import {UserTechnologiesDto} from "./dto/UserTechnologiesDto";
import {sanitizeFilter, sanitizeUsername} from "./helper/sanitize";


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
        yargs
          .option('print', {
            alias: 'p',
            type: 'boolean',
            description: 'Print user data',
          })
      },
      async (args): Promise<void> => {
        if (args.help) {
          yargs.showHelp();
          return;
        }

        const user: FetchUserDto = {
          username: sanitizeUsername(args.username as string)
        };
        const storedUser: UserTechnologiesDto | null =
          await fetchUserService(user);

        if (!storedUser) {
          logger.info(`User not found`);
          return;
        }

        logger.info(
          `User(${user.username}) found and stored in the database.`
        );

        if (args.print) {
          printData(storedUser, true);
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

        const filter: ListUserDto = sanitizeFilter({
          location: args.location as string | undefined ?? null,
          technology: args.technology as string | undefined ?? null,
        });
        await listUserService(filter);
        return;
      },
    )
    .demandCommand(1, 'You need to specify a command')
    .help()
    .strict()
    .parse();
};

main()
  .catch((error): void => {
    logger.error('An unexpected error occurred:', error.message);
  });
