var mongoose = require('mongoose');
//reference to schema constructor
var Schema = mongoose.Schema;

//create  new schema object
var ArticleSchema = new Schema({
//Headline - the title of the article
	headline: {
		type: String,
		required: true,
		unique: true
	},
//Summary - a short summary of the article
	summary: {
		type: String,
		required: true
	},
	//link to article
	link:{
		type: String
	},
//URL - the url to the original article
	comment: {
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}
});

var Article = mongoose.model('Article', ArticleSchema);

//Export article model
module.exports = Article;