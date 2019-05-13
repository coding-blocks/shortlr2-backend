import { Router } from 'express'

export const route = Router()

route.get('/join/:ref_code', (req, res) => {
  const { ref_code } = req.params
  const url = `https://account.codingblocks.com/signup?refcode=${ref_code}`
  res.redirect(url)
})
