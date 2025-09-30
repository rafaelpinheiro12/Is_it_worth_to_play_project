const router = require('express').Router()
     const controller = require('../controllers/controllers')
     const AIcontroler = require('../controllers/AIresponse.controller')

     router.post('/fetchRAWGGame', controller.fetchRAWGGame)
     router.post('/fetchIGDBGame', controller.fetchIGDBGame)
     router.get('/getGameSharkDeals', controller.getGameSharkDeals)
     router.post('/getAIResponse', AIcontroler.main)


     module.exports = router