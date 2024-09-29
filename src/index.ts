import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import {FetchUserDto} from "./dto/FetchUserDto";
import fetchUserService from "./service/FetchUserService";


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

        .demandCommand(1, 'You need to specify a command')
        .help()
        .strict()
        .parse();
};

main()
    .catch((error) => {
        console.error('An unexpected error occurred:', error.message);
    });
