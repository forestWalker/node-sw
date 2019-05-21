# StarWars GraphQL mini app

Simple app consisting of 3 parts:
* a common `SwService` which can serve the requests directly from the SW GraphQL API
* `SwServer` which can fire up an Express server serving a REST api to handle the requests and pass them to the `SwService`
* `SwCli` which is a command line interface using the `SwService` to provide console output

The app has a CLI entry point `starwars.js` which shebang support to run locally

## Installation

NodeJS 8 and NPM is required to run.

From the app root dir:

```bash
❯ npm i
```

## CLI
```
❯ ./starwars.js --help
Usage: starwars [options] [command]

StarWars GraphQL app

Options:
  -V, --version                           output the version number
  -h, --help                              output usage information

Commands:
  characters <movie>                      Returns all the characters (names) of the movie
  matchingCharacters <movie_1> <movie_2>  returns all characters that play in BOTH movies
  tall <height>                           returns all characters that are at least x cm tall(​height) (all movies)
  serve                                   start API and webapp
```

## Server app & API

Can be started with:
```bash
./starwars.js serve
```

The server will be run on the port 4000 and will provide the following endpoints:

**Get characters from episode**
```
/api/characters?movie=<movie title>
```
`movie` shoud contain the movie title to query characters from

**Get available movies with title and ID**
```
/api/movies
```

**Get characters appearing in both movies**
```
/api/matchingCharacters?movies=<movie1>,<movie2>
```
`movies` should contain the two movies separated by a comma

**Get characters at least x cm tall**
```
/api/tall?height=<height>
```
`height` should contain only the number in cms

## WebApp

When the server is running the webapp is available at `http(s)://<domain>:4000/` and will connect to the server's API endpoint to fetch content.
