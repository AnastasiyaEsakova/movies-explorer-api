const dataBaseUrl = 'mongodb://localhost:27017/moviesdb';
const type = 'production';
const testJwt = 'dev-secret';

const failedPath = 'Маршрут не найден';
const serverError = 'На сервере произошла ошибка';
const exit = 'Выход';
const authMessage = 'Необходима авторизация.';

const badRequestMovieMessage = 'Переданы некорректные данные при создании фильма.';
const notFoundMovieMessage = 'Фильм с указанным _id не найден.';
const forbiddenMovieMesaage = 'Вы не можете удалить чужой фильм.';
const deleteMovie = 'Фильм удалён';
const badRequestMessage = 'Переданы некорректные данные.';

const badRequestUserMessage = 'Переданы некорректные данные при обновлении профиля.';
const badRequestNewUserMessage = 'Переданы некорректные данные при создании пользователя.';
const authBadEmail = 'Пользователь с такой почтой уже существует.';
const authFailData = 'Передан неверный логин или пароль.';

const crashTest = 'Сервер сейчас упадёт';

module.exports = {
  failedPath,
  serverError,
  exit,
  authMessage,
  badRequestMovieMessage,
  notFoundMovieMessage,
  forbiddenMovieMesaage,
  deleteMovie,
  badRequestMessage,
  badRequestUserMessage,
  badRequestNewUserMessage,
  authFailData,
  authBadEmail,
  crashTest,
  dataBaseUrl,
  type,
  testJwt,
};
