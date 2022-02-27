const Movie = require('../models/movie');
const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');
const { deleteMovie, badRequestMovieMessage, badRequestMessage } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const ownerId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((e) => {
      if (e.name === 'ValidationError') next(new BadRequest(badRequestMovieMessage));
      else next(e);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound();
      }
      if (req.user._id !== movie.owner.toHexString()) {
        throw new Forbidden();
      } else {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
    })
    .then(() => {
      res.status(200).send({ message: deleteMovie });
    })
    .catch((e) => {
      if (e.name === 'CastError') next(new BadRequest(badRequestMessage));
      else next(e);
    });
};
