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

	GameData.ensureIndexesCleanup = async function ensureIndexesCleanup() {
		try {
			const indexes = await GameData.collection.indexes();
			const gameNameIndex = indexes.find((index) => index.name === 'gameName_1');
			if (gameNameIndex?.unique) {
				await GameData.collection.dropIndex('gameName_1');
				console.log('Dropped legacy unique index on gameName');
			}
		} catch (error) {
			const ignorableCodes = new Set(['IndexNotFound', 'NamespaceNotFound']);
			if (!ignorableCodes.has(error.codeName) && error.code !== 27 && error.code !== 26) {
				console.error('Failed to adjust GameData indexes:', error.message);
			}
		}
	};
	module.exports = GameData