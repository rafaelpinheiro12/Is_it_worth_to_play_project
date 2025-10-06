const mongoose = require('mongoose')
	const Schema   = mongoose.Schema

	const GameDataSchema = new mongoose.Schema({

		gameName: { 
		   type     : String, 
		   required : true,
		   unique   : true
		},
		igdbData: { 
		   type     : Array, 
		   required : true
		},
		rawgData: { 
		   type     : Array, 
		   required : true
		},
		aiData: { 
		   type     : Object, 
		   required : true
		}
	});

	const GameData = mongoose.model('GameData', GameDataSchema)
	module.exports = GameData