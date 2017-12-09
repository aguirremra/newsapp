var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//scraping tool
var axios = require("axios");
var cheerio = require('cheerio');

var db = require('./models');

var PORT = process.env.PORT || 8080;

// Sets up the Express App
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static directory
app.use(express.static("public"));

// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsapp";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

//handlebars
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// Routes
// =============================================================
// require("./routes/api-routes.js")(app);
// require("./routes/html-routes.js")(app);

//Get Route
app.get('/', function(req, res){
	res.send(index.html);
});

//scrape articles and insert into DB
app.get('/scrape', function(req, res){
	var results = {};
	axios.get('http://www.rollingstone.com/news').then(function(response){
		var $ = cheerio.load(response.data);
		

		$('.content-card').each(function(i, element){

			results.headline = $(this).find('.content-card-title').text();
			results.summary = $(this).find('.content-card-description').text();
			results.link = $(this).find('a').attr('href');
			console.log(results);

		db.Article
		.create(results)
		.then(function(dbArticle){
			res.send("Scrape Complete");
		})
		.catch(function(err){
			// if(err){
			// 	res.json(err);
			// }
		});
		});
	});
});

app.get('/articles', function(req, res){
	db.Article
	.find({})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

app.get('/articles/:id', function(req, res){
	db.Article
	.findOne({_id: req.params.id})
	.populate('comment')
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

app.post('/articles/:id', function(req, res){
	db.Comment
	.create(req.body)
	.then(function(dbComment){
		return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
	})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

//MONGODB_URI: mongodb://heroku_1p9s78l9:cjduh8r5i5dq7nrv4kv7ckvd15@ds135876.mlab.com:35876/heroku_1p9s78l9
//start mongodb server manually
//"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
