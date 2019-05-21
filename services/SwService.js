const fetch = require('node-fetch');
const NotFoundError = require('../lib/NotFoundError');

class SwService {
  constructor() {
    this.apiUrl = 'https://api.graphcms.com/simple/v1/swapi';
  }

  /**
   * API query
   *
   * @param {string} query
   * @param {object} [variables=null] Optional variables to pass with the query
   * @return {PromiseLike<Object>}
   */
  query(query, variables = null) {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
    .then(result => result.json())
    ;
  }

  /**
   * Find all film ids and titles
   * @return {PromiseLike<Object>}
   */
  filmIds() {
    return this.query(`
query {
  allFilms {
    id
    title
  }
}
`
    );
  }

  /**
   * Fetch characters for specific movieId
   *
   * @param {string} movieId
   * @return {PromiseLike<Object>}
   */
  charactersByMovieId(movieId) {
    return this.query(`
query charactersByFilmId($id: ID) {
  Film(id: $id) {
    characters {
      name
      height
      gender
    }
  }
}
`,
      { id: movieId }
    ).then(result => {
      if (result.data && result.data.Film) return result.data.Film.characters;
      else throw new NotFoundError(`! Film with ID:${movieId} not found!`);
    });
  }

  /**
   * Fetch characters from given movie
   * @param {string} title
   * @return {PromiseLike<object[]>}
   */
  charactersByMovie(title) {
    return this.filmIds()
      .then(res => res && res.data && res.data.allFilms)
      .then(films => films.find(film => film.title === title))
      .then(film => {
        if (!film) throw new NotFoundError(`! Film "${title}" not found!`);
        return this.charactersByMovieId(film.id);
      })
  }

  /**
   * Return the intersection of characters from the two movies
   * @param {string} movie1
   * @param {string} movie2
   * @return {Promise<Object[]>}
   */
  async matchingCharacters(movie1, movie2) {
    const [ res1, res2 ] = await Promise.all([ this.charactersByMovie(movie1), this.charactersByMovie(movie2) ]);
    return res1.filter(searchingCharacter => res2.filter(character => character.name === searchingCharacter.name).length);
  }

  /**
   * Return characters with min. height
   * @param {number} height
   * @return {PromiseLike<object[]>}
   */
  charactersByHeight(height) {
    return this.query(`
query {
  allPersons {
    name
    height
    gender
  }
}
    `)
      .then(res => res.data.allPersons)
      .then(persons => persons.filter(person => person.height >= height))
    ;
  }
}

module.exports = SwService;
