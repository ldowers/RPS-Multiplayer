"use strict";

// Initialize Firebase
var config = {
	apiKey: "AIzaSyAqQY6zay0DEWSs1hzrFzf07lG1yBOcad0",
	authDomain: "multi-rps-405ba.firebaseapp.com",
	databaseURL: "https://multi-rps-405ba.firebaseio.com",
	storageBucket: "multi-rps-405ba.appspot.com",
	messagingSenderId: "341240646276"
};
firebase.initializeApp(config);

// Variables
var database = firebase.database();

var game = {
	playerNumber: 0,
	name1: "",
	name2: "",
	numWins1: 0,
	numWins2: 0,
	numLosses1: 0,
	numLosses2: 0,
	turn: 0,
	displayPlayers: function () {
		if (game.playerNumber == 1 && turn == 1) {
			$("#nameDisplay").empty();
			$("#nameDisplay").html("Hi " + game.name1 + "! You are Player " + game.playerNumber);
			$("#playerName1").html(game.name1);
			$("#playerName2").html("Waiting for Player 2");
			$("#playerResults1").html("Wins: " + game.numWins1 + " Losses: " + game.numLosses1);
		} else if (game.playerNumber ==2 && turn == 1) {
			$("#nameDisplay").empty();
			$("#nameDisplay").html("Hi " + game.name2 + "! You are Player " + game.playerNumber);
			$("#playerName1").html(game.name1);
			$("#playerName2").html(game.name2);
			console.log(game.name1, game.name2);
			$("#playerResults1").html("Wins: " + game.numWins1 + " Losses: " + game.numLosses1);
			$("#playerResults2").html("Wins: " + game.numWins2 + " Losses: " + game.numLosses2);
		} else {

		}
	}
};


// Event Handlers

database.ref().on("value", function(snapshot) {
	if (snapshot.child("players").exists()) {
		console.log("Player 2");
		game.playerNumber = 2;
		game.name1 = snapshot.val().players[0].name;
		game.turn = snapshot.val().players[0].turn;
	}
	else {
		console.log("Player 1");
		game.playerNumber = 1;
	}
}, function (errorCode) {
	console.log("Error: " + errorCode);
});

$("#startButton").on("click", function() {
	var name = $('#nameInput').val().trim();

	console.log("Name: " + name);
	
	if (game.playerNumber == 1) {
		game.name1 = name;
	} else {
		game.name2 = name;
	}

	game.displayPlayers();
	
	database.ref().set({
		players: [
		{name: game.name1, choice: "", losses: game.numLosses1, wins: game.numWins1},
		{name: game.name2, choice: "", losses: game.numLosses2, wins: game.numWins2}
		],
		turn: 1
	});
	
	return false;
});