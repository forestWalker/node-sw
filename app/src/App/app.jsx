'use strict';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      title: '',
      matching1: '',
      matching2: '',
      height: null,
      movies: [],
      loading: true,
      error: null,
      resultTitle: ''
    };

    this.fetchCharacters = this.fetchCharacters.bind(this);
    this.handleTitleSearch = this.handleTitleSearch.bind(this);
    this.handleHeightSearch = this.handleHeightSearch.bind(this);
    this.handleMatchingSearch = this.handleMatchingSearch.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getMovies();
  }

  fetchCharacters(url) {
    this.setState({ loading: true, characters: [] });

    fetch(url)
      .then(res => res.json())
      .then(res => res && res.data)
      .then(characters => this.setState({ characters, loading: false }))
      .catch(e => {
        this.setState({ loding: false, error: e.message })
      })
    ;

  }
  handleTitleSearch(title) {
    this.setState({ title, resultTitle: `Characters from: „${title}“` });

    this.fetchCharacters('/api/characters?movie=' + encodeURIComponent(title));
  }

  handleMatchingSearch(matching1, matching2) {
    if (matching1 === false) {
      this.setState({ matching2 });
      matching1 = this.state.matching1;
    } else if (matching2 === false) {
      this.setState({ matching1 });
      matching2 = this.state.matching2;
    }

    if (!matching1 || !matching2) return;

    this.setState({ resultTitle: `Characters appearing in both „${matching1}“ and „${matching2}“` });

    this.fetchCharacters('/api/matchingCharacters?movies=' + encodeURIComponent([ matching1, matching2 ].join(',')));
  }

  handleHeightSearch(height) {
    this.setState({ height, resultTitle: `Characters at least ${height} cm tall` });

    this.fetchCharacters('/api/tall?height=' + height);
  }

  getMovies() {
    this.setState({ loading: true });
    fetch('/api/movies')
      .then(res => res.json())
      .then(res => res && res.data && res.data.data.allFilms)
      .then(movies => this.setState({ movies, loading: false }))
      .catch(e => {
        this.setState({ loding: false, error: e.message })
      })
    ;
  }

  render() {
    const { movies, characters, loading, error, title, height, resultTitle } = this.state;
    return (
      <div className='app-container container-fluid p-5 border rounded d-flex flex-column'>
        <h2 className='text-center mb-3'>StarWars API</h2>

        <div className='search-controls row'>
          <div className='col-12'>
            <div className='form-group row'>
              <label className='col-form-label col-4' htmlFor='min_height'>Movie</label>
              <select className='form-control col-8' onChange={event => this.handleTitleSearch(event.target.value)}>
                {movies.length && <option value='' key='0'> - select a movie - </option>}
                {movies.length
                  ? movies.map(movie => <option key={movie.id} value={movie.title}>{ movie.title }</option>)
                  : (<option key='-1' value='loading'>Loading movies...</option>)
                }
              </select>
            </div>

            <div className='form-group row'>
              <label className='col-form-label col-4' htmlFor='min_height'>Enter height:</label>
              <input type='number' placeholder='Height' id='min_height' className='col-4' onChange={event => this.setState({ height: event.target.value })} value={ height } />
              <button className='btn btn-primary col-3 offset-1' disabled={loading} onClick={(event) => this.handleHeightSearch(height)}>{loading ? 'Searching...' : 'Run!'}</button>
            </div>

            <div className='form-group row'>

              <label className='col-form-label col-4 mb-1' htmlFor='min_height'>Movie 1</label>
              <select className='form-control col-8 mb-1' onChange={event => this.handleMatchingSearch(event.target.value, false)}>
                {movies.length && <option value='' key='0'> - select first movie - </option>}
                {movies.length
                 ? movies.map(movie => <option key={movie.id} value={movie.title}>{ movie.title }</option>)
                 : (<option key='-1' value='loading'>Loading movies...</option>)
                }
              </select>

              <label className='col-form-label col-4' htmlFor='min_height'>Movie 2</label>
              <select className='form-control col-8' onChange={event => this.handleMatchingSearch(false, event.target.value)}>
                {movies.length && <option value='' key='0'> - select second movie - </option>}
                {movies.length
                 ? movies.map(movie => <option key={movie.id} value={movie.title}>{ movie.title }</option>)
                 : (<option key='-1' value='loading'>Loading movies...</option>)
                }
              </select>
            </div>

          </div>
        </div>

        <h3>{resultTitle}</h3>
        <div className='result-container row flex-grow-1 overflow-auto border rounded'>
          <div className='col-12 d-flex'>
            {error && <div className='message message-danger'>{error}</div>}
            {loading &&
              <div className="spinner-border justify-self-center m-auto" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            }
            {!!characters.length &&
            <ul className='list-unstyled'>
              {characters.map(character => <li key={character.name}>{ character.name } // {character.gender}, {character.height || 'n/a '}cm</li>)}
            </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

