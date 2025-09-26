const mongoose = require('mongoose')
	const Schema   = mongoose.Schema

	const GameDataSchema = new mongoose.Schema({

		gameName: { 
		   type     : String, 
		   required : true,
		   unique   : true
		},
		gameGenre: {
		   type     : String, 
		   required : true,
		},
		gamePlatform: {
		   type     : String,
		   required : true,
		},
		gameReleaseYear: {
		   type     : Number,
		   required : true,
		},
		gameDeveloper: {
		   type     : String,
		   required : true,
		},
		gamePublisher: {
		   type     : String,
		   required : true,
		},
		gameRating: {
		   type     : String,
		   required : true,
		},
		gameDescription: {
		   type     : String,
		   required : true,
		},
		gameCoverImageURL: {
		   type     : String,
		   required : true,
		},
		gameTrailerURL: {
		   type     : String,
		   required : true,
		},
		gamePrice: {
		   type     : Number,
		   required : true,
		},
		gameMultiplayer: {
		   type     : Boolean,
		   required : true,
		}
	});

	const GameData = mongoose.model('GameData', GameDataSchema)
	module.exports = GameData