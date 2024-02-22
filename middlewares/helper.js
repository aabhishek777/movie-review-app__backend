export const parseData = (req, res, next) => {
  const { trailer, tags, cast, writers, genres } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (tags) req.body.tags = JSON.parse(tags);
  if (cast) req.body.cast = JSON.parse(cast);
  if (writers) req.body.writers = JSON.parse(writers);
  if (genres) req.body.genres = JSON.parse(genres);

  next();
};
