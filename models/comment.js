var mongoose = require('mongoose');

//reference to the Schema constructor
var Schema = mongoose.Schema;

//new CommentSchema
var CommentSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

//create model from schema
var Comment = mongoose.model('Comment', CommentSchema);

//Export Comment model
module.exports = Comment;