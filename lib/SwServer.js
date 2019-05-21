const express = require('express');
const path = require('path');
const SwService = require('../services/SwService');
const NotFoundError = require('../lib/NotFoundError');

const hostname = '127.0.0.1';
const port = process.env.PORT || 4000;

class SwServer {

  constructor() {
    this.swService = new SwService();

    const app = express();
    const publicPath = path.join(__dirname, '../app/public');

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '/../app/index.html'));
    });

    app.get('/api/:command', this.serveApi.bind(this));

    app.use(express.static(publicPath));

    app.listen(port, function () {
      console.log(`SwServer app listening on port ${port}!`);
      console.log(` > Serving public content from: ${publicPath.toString()}`);
    });
  }

  /**
   *
   * @param {request} req
   * @param {response} resp
   */
  async serveApi(req, resp) {
    let result = [];
    switch(req.params.command) {
      case 'characters':
        if (!req.query || !req.query.movie) {
          resp.status(400).send({ error: 'Please specify movie by query parameter "movie"!' });
          return;
        }

        try {
          result = await this.swService.charactersByMovie(req.query.movie);
        } catch(e) {
        }
        break;
      case 'movies':
        try {
          result = await this.swService.filmIds();
        } catch(e) {
        }
        break;
      case 'matchingCharacters':
        const movies = ((req.query && req.query.movies) || '').split(',');
        if (movies.length !== 2) resp.status(400).send({ error: 'Please specify exactly two movies by query parameter "movies" providing the titles separated by a comma!' });
        try {
          result = await this.swService.matchingCharacters(...movies);
        } catch(e) {
        }
        break;
      case 'tall':
        if (!req.query || !req.query.height) {
          resp.status(400).send({ error: 'Please specify the min. height to search using query parameter "height" and providing the height in cm without the unit!' });
          return;
        }
        try {
          result = await this.swService.charactersByHeight(req.query.height);
        } catch(e) {
        }
        break;
    }
    if (typeof e !== 'undefined') {
      e.name === 'NotFoundError'
        ? resp.status(404).send('Not Found')
        : resp.status(500).send({ error: e })
      ;
      return;
    }
    resp.status(200).send({ data: result });
  }
}

module.exports = SwServer;
