const Movie = require('../models/movie');
const NewError = require('../errors/error');

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
    trailer,
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
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((e) => {
      if (e.name === 'ValidationError') next(new NewError('Переданы некорректные данные при создании фильма.', 400));
      else next(e);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NewError('Фильм с указанным _id не найдена.', 404);
      }
      if (req.user._id !== movie.owner.toHexString()) {
        throw new NewError('Вы не можете удалить чужой фильм.', 403);
      } else {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
    })
    .then(() => {
      res.status(200).send({ message: 'Фильм удалён' });
    })
    .catch((e) => {
      if (e.name === 'CastError') next(new NewError('Переданы некорректные данные.', 400));
      else next(e);
    });
};
