export default function(req, res, next) {
  const LIMIT = 20
  const PAGE = 1
  if (!req.query.page || req.query.page <= 0) {
    req.query.page = PAGE
  }
  if (!req.query.limit || req.query.limit <= 0) {
    req.query.limit = LIMIT
  }
  res.locals.pagination = {
    page: req.query.page,
    limit: req.query.limit,
  }
  next()
}
