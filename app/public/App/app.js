'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
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

    _this.fetchCharacters = _this.fetchCharacters.bind(_this);
    _this.handleTitleSearch = _this.handleTitleSearch.bind(_this);
    _this.handleHeightSearch = _this.handleHeightSearch.bind(_this);
    _this.handleMatchingSearch = _this.handleMatchingSearch.bind(_this);
    _this.getMovies = _this.getMovies.bind(_this);
    _this.getMovies();
    return _this;
  }

  _createClass(App, [{
    key: 'fetchCharacters',
    value: function fetchCharacters(url) {
      var _this2 = this;

      this.setState({ loading: true, characters: [] });

      fetch(url).then(function (res) {
        return res.json();
      }).then(function (res) {
        return res && res.data;
      }).then(function (characters) {
        return _this2.setState({ characters: characters, loading: false });
      }).catch(function (e) {
        _this2.setState({ loding: false, error: e.message });
      });
    }
  }, {
    key: 'handleTitleSearch',
    value: function handleTitleSearch(title) {
      this.setState({ title: title, resultTitle: 'Characters from: \u201E' + title + '\u201C' });

      this.fetchCharacters('/api/characters?movie=' + encodeURIComponent(title));
    }
  }, {
    key: 'handleMatchingSearch',
    value: function handleMatchingSearch(matching1, matching2) {
      if (matching1 === false) {
        this.setState({ matching2: matching2 });
        matching1 = this.state.matching1;
      } else if (matching2 === false) {
        this.setState({ matching1: matching1 });
        matching2 = this.state.matching2;
      }

      if (!matching1 || !matching2) return;

      this.setState({ resultTitle: 'Characters appearing in both \u201E' + matching1 + '\u201C and \u201E' + matching2 + '\u201C' });

      this.fetchCharacters('/api/matchingCharacters?movies=' + encodeURIComponent([matching1, matching2].join(',')));
    }
  }, {
    key: 'handleHeightSearch',
    value: function handleHeightSearch(height) {
      this.setState({ height: height, resultTitle: 'Characters at least ' + height + ' cm tall' });

      this.fetchCharacters('/api/tall?height=' + height);
    }
  }, {
    key: 'getMovies',
    value: function getMovies() {
      var _this3 = this;

      this.setState({ loading: true });
      fetch('/api/movies').then(function (res) {
        return res.json();
      }).then(function (res) {
        return res && res.data && res.data.data.allFilms;
      }).then(function (movies) {
        return _this3.setState({ movies: movies, loading: false });
      }).catch(function (e) {
        _this3.setState({ loding: false, error: e.message });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state = this.state,
          movies = _state.movies,
          characters = _state.characters,
          loading = _state.loading,
          error = _state.error,
          title = _state.title,
          height = _state.height,
          resultTitle = _state.resultTitle;

      return React.createElement(
        'div',
        { className: 'app-container container-fluid p-5 border rounded d-flex flex-column' },
        React.createElement(
          'h2',
          { className: 'text-center mb-3' },
          'StarWars API'
        ),
        React.createElement(
          'div',
          { className: 'search-controls row' },
          React.createElement(
            'div',
            { className: 'col-12' },
            React.createElement(
              'div',
              { className: 'form-group row' },
              React.createElement(
                'label',
                { className: 'col-form-label col-4', htmlFor: 'min_height' },
                'Movie'
              ),
              React.createElement(
                'select',
                { className: 'form-control col-8', onChange: function onChange(event) {
                    return _this4.handleTitleSearch(event.target.value);
                  } },
                movies.length && React.createElement(
                  'option',
                  { value: '', key: '0' },
                  ' - select a movie - '
                ),
                movies.length ? movies.map(function (movie) {
                  return React.createElement(
                    'option',
                    { key: movie.id, value: movie.title },
                    movie.title
                  );
                }) : React.createElement(
                  'option',
                  { key: '-1', value: 'loading' },
                  'Loading movies...'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'form-group row' },
              React.createElement(
                'label',
                { className: 'col-form-label col-4', htmlFor: 'min_height' },
                'Enter height:'
              ),
              React.createElement('input', { type: 'number', placeholder: 'Height', id: 'min_height', className: 'col-4', onChange: function onChange(event) {
                  return _this4.setState({ height: event.target.value });
                }, value: height }),
              React.createElement(
                'button',
                { className: 'btn btn-primary col-3 offset-1', disabled: loading, onClick: function onClick(event) {
                    return _this4.handleHeightSearch(height);
                  } },
                loading ? 'Searching...' : 'Run!'
              )
            ),
            React.createElement(
              'div',
              { className: 'form-group row' },
              React.createElement(
                'label',
                { className: 'col-form-label col-4 mb-1', htmlFor: 'min_height' },
                'Movie 1'
              ),
              React.createElement(
                'select',
                { className: 'form-control col-8 mb-1', onChange: function onChange(event) {
                    return _this4.handleMatchingSearch(event.target.value, false);
                  } },
                movies.length && React.createElement(
                  'option',
                  { value: '', key: '0' },
                  ' - select first movie - '
                ),
                movies.length ? movies.map(function (movie) {
                  return React.createElement(
                    'option',
                    { key: movie.id, value: movie.title },
                    movie.title
                  );
                }) : React.createElement(
                  'option',
                  { key: '-1', value: 'loading' },
                  'Loading movies...'
                )
              ),
              React.createElement(
                'label',
                { className: 'col-form-label col-4', htmlFor: 'min_height' },
                'Movie 2'
              ),
              React.createElement(
                'select',
                { className: 'form-control col-8', onChange: function onChange(event) {
                    return _this4.handleMatchingSearch(false, event.target.value);
                  } },
                movies.length && React.createElement(
                  'option',
                  { value: '', key: '0' },
                  ' - select second movie - '
                ),
                movies.length ? movies.map(function (movie) {
                  return React.createElement(
                    'option',
                    { key: movie.id, value: movie.title },
                    movie.title
                  );
                }) : React.createElement(
                  'option',
                  { key: '-1', value: 'loading' },
                  'Loading movies...'
                )
              )
            )
          )
        ),
        React.createElement(
          'h3',
          null,
          resultTitle
        ),
        React.createElement(
          'div',
          { className: 'result-container row flex-grow-1 overflow-auto border rounded' },
          React.createElement(
            'div',
            { className: 'col-12 d-flex' },
            error && React.createElement(
              'div',
              { className: 'message message-danger' },
              error
            ),
            loading && React.createElement(
              'div',
              { className: 'spinner-border justify-self-center m-auto', role: 'status' },
              React.createElement(
                'span',
                { className: 'sr-only' },
                'Loading...'
              )
            ),
            !!characters.length && React.createElement(
              'ul',
              { className: 'list-unstyled' },
              characters.map(function (character) {
                return React.createElement(
                  'li',
                  { key: character.name },
                  character.name,
                  ' // ',
                  character.gender,
                  ', ',
                  character.height || 'n/a ',
                  'cm'
                );
              })
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);