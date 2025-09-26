const router = require('express').Router()
     const controller = require('../controllers/controllers')

     router.post('/fetchRAWGGame', controller.fetchRAWGGame)
     router.post('/fetchIGDBGame', controller.fetchIGDBGame)

     module.exports = router