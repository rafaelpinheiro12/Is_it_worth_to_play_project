const router = require('express').Router()
     const controller = require('../controllers/controllers')

     router.post('/', controller.fetchGame)

     module.exports = router