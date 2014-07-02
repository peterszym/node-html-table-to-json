var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


var players = [];
var json = { players: players };

// var teams = [
// 	'ducks',
// 	'coyotes',
// 	'bruins',
// 	'sabres',
// 	'flames',
// 	'hurricanes',
// 	'blackhawks',
// 	'avalanche',
// 	'bluejackets',
// 	'stars',
// 	'redwings',
// 	'oilers',
// 	'panthers',
// 	'kings',
// 	'wild',
// 	'canadiens',
// 	'predators',
// 	'devils',
// 	'islanders',
// 	'rangers',
// 	'senators',
// 	'flyers',
// 	'penguins',
// 	'sharks',
// 	'blues',
// 	'lightning',
// 	'mapleleafs',
// 	'canucks',
// 	'capitals',
// 	'jets'
// ];




/**
 * Get all players from a team
 */

function Team(team, year, req, res){
	url = 'http://'+ team +'.nhl.com/club/stats.htm?season='+ year +'';
	var json = {};

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var headings = [];

			// get headers to build our json key from
			$('.tieUp').filter(function(){
				var header = $(this).find('.hdr').first();

				header.find('td').each(function(index) {
					headings[index] = $(this).find('a').attr('title').toLowerCase().replace(/ /g, '-');
				});
			});

			// get player stats
			$('.tieUp').filter(function(){

				var playerRows = $(this).find('.hdr').first().nextAll();


				playerRows.each(function(index) {
					var tds = $(this).find('td');
					var player = {};

					player['team'] = team;
					tds.each(function(index) {
						var td = $(this).text();
						player[headings[index]] = td;
					});

					players.push(player);


				});



			});




		}




	});

}


app.get('/team/:team', function(req, res){

	// for (var i = 0; i < teams.length; i++) {
	// Team(teams[i], 2014, req, res);
	// }

	Team(req.params.team, 2014, req, res);


	fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
		console.log('Saved to file output.json');
	});



	res.send(json);

});

app.listen('1337');
console.log('Server: http://localhost:1337/');
exports = module.exports = app;
