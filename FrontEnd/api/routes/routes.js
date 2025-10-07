const router = require('express').Router()
     const controller = require('../controllers/controllers')
     const AIcontroler = require('../controllers/AIresponse.controller')
     const fetchSuggestions = require('../controllers/searchInputHandler')

     router.post('/fetchRAWGGame', controller.fetchRAWGGame)
     router.post('/fetchIGDBGame', controller.fetchIGDBGame)
     router.post('/getAIResponse', AIcontroler.main)
     router.post('/searchInputHandler', fetchSuggestions.searchInputHandler)


     module.exports = router