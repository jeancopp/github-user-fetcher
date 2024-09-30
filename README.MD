# GitHub Users Fetcher

Hello there!

This application retrieves and stores GitHub user data in a PostgreSQL database.
To use it, you must first complete the setup below.
Then, there are two possible command options: one for data consumption and one for listing.

## Setup

Just copying and pasting this followed commands will allow you to then run the app.
If you want to use another database instance, just check .env details after creation of this file and ignore the compose up.

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run migrate
npm run build
```

## Commands

### Fetch user
Fetch a GitHub user and store in the database.
```bash
node dist\index.js fetch-user <username>
Positionals:
  username  GitHub username                                  [string] [required]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```


### List stored users
This command list all users in the database.

```bash
node .\dist\index.js list-users

Options:
      --version     Show version number                                [boolean]
  -l, --location    Filter users by location                            [string]
  -t, --technology  Filter users by technology                          [string]
      --help        Show help                                          [boolean]
```

## Development
During the development, it was created the two features presented.
After that, it was created tests to check the behavior of the business rules.

You can run the tests using ``npm run test`` or check the coverage by ``npm run test:coverage``

## Future implementations:
- Integration tests
- Other commands
- Improvements on the presentation layer
- Improve coverage on the tests