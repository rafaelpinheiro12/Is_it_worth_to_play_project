const mongoose = require('mongoose')
	const Schema   = mongoose.Schema

	const GameDataSchema = new mongoose.Schema({

		igdbId: {
		   type    : Number,
		   unique  : true,
		   sparse  : true,
		},
		gameName: { 
		   type     : String, 
		   required : true
		},
		igdbData: { 
		   type     : Schema.Types.Mixed, 
		   required : true
		},
		rawgData: { 
		   type     : Schema.Types.Mixed, 
		   required : true
		},
		aiData: { 
		   type     : Schema.Types.Mixed, 
		   required : true
		},
		timeStamp: {
		type: Date,
		default: Date.now
		}
	});

	const GameData = mongoose.model('GameData', GameDataSchema)
	module.exports = GameData