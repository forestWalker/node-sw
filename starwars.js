#!/usr/bin/env node

const app = require('commander');
const SwCli = require('./lib/SwCli');
const SwServer = require('./lib/SwServer');

const swCli = new SwCli();

app
  .version('0.1.0')
  .description('StarWars GraphQL app')
;
app
  .command('characters <movie>')
  .description('Returns all the characters (names) of the movie')
  .action(swCli.charactersByMovie)
;
app
  .command('matchingCharacters <movie_1> <movie_2>')
  .description('returns all characters that play in BOTH movies')
  .action(swCli.matchingCharacters)
;
app
  .command('tall <height>')
  .description('returns all characters that are at least x cm tall(​height) (all movies)')
  .action(swCli.charactersByHeight)
;

app
  .command('serve')
  .description('start API and webapp')
  .action(() => {
    const server = new SwServer();
  })
;
app.parse(process.argv);
