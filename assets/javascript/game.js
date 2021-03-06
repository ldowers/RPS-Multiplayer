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

// Variables ===================================================================
var database = firebase.database();

// Database reference variables
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var playersRef = database.ref("/players");
var turnRef = database.ref("/turn");
var chatRef = database.ref("/chat");

var currentPlayer = "";
var currentNumber = 0;
var numPlayers = 0;
var turn = 0;
var result = "";

var player1 = "";
var player2 = "";
var numWins1 = 0;
var numWins2 = 0;
var numLosses1 = 0;
var numLosses2 = 0;
var choice1 = "";
var choice2 = "";

// Functions ===================================================================

function newPlayer1 () {
	player1 = currentPlayer;
	numWins1 = 0;
	numLosses1 = 0;
	choice1 = "";

	if (player2 != "") {
		playersRef.set({
			1: {
				name: currentPlayer,
				wins: 0,
				losses: 0
			},
			2: {
				name: player2,
				wins: numWins2,
				losses: numLosses2
			}
		});
	} else {
		playersRef.set({
			1: {
				name: currentPlayer,
				wins: 0,
				losses: 0
			}
		});
	}

	playersRef.child("1").onDisconnect().remove();
};

function newPlayer2 () {
	player2 = currentPlayer;
	numWins2 = 0;
	numLosses2 = 0;
	choice2 = "";

	if (player1 != "") {
		playersRef.set({
			1: {
				name: player1,
				wins: numWins1,
				losses: numLosses1
			},
			2: {
				name: currentPlayer,
				wins: 0,
				losses: 0
			}
		});
	} else {
		playersRef.set({
			2: {
				name: currentPlayer,
				wins: 0,
				losses: 0
			}
		});
	}

	playersRef.child("2").onDisconnect().remove();
};

function displayPlayer() {
	$("#nameDisplay").empty();
	$("#nameDisplay").html("<div>Hi " + currentPlayer + "! You are Player " + currentNumber + "</div>");
	$("#nameDisplay").append('<div id="message-' + currentNumber + '"></div>');
};

function displayChoices() {
	var rockButton = '<button class="choice" id="rock" value="Rock">Rock</button>';
	var paperButton = '<button class="choice" id="paper" value="Paper">Paper</button>';
	var scissorsButton = '<button class="choice" id="scissors" value="Scissors">Scissors</button>';

	if (currentNumber == 1) {
		$("#playerChoice1").append(rockButton);
		$("#playerChoice1").append("<br>" + paperButton);
		$("#playerChoice1").append("<br>" + scissorsButton);
	}

	if (currentNumber == 2) {
		$("#playerChoice2").append(rockButton);
		$("#playerChoice2").append("<br>" + paperButton);
		$("#playerChoice2").append("<br>" + scissorsButton);
	}
};

function displayAnswer () {
	var answer = "";

	if (currentNumber == 1) {
		answer = '<div class="answer">' + choice1 + '</div>';
		$("#playerChoice1").empty();
		$("#playerChoice1").html(answer);
	}

	if (currentNumber == 2) {
		answer = '<div class="answer">' + choice2 + '</div>';
		$("#playerChoice2").empty();
		$("#playerChoice2").html(answer);
	}
}

function findResult () {
	if (choice1 == choice2) {
		result = "Tie Game!";
	}

	if(choice1 === "Rock" && choice2 == "Scissors"){
		numWins1++;	
		numLosses2++;
		result = player1 + " Wins!"
	}

	if(choice1 === "Rock" && choice2 == "Paper"){
		numLosses1++;
		numWins2++;
		result = player2 + " Wins!"
	}

	if(choice1 === "Paper" && choice2 == "Scissors"){
		numLosses1++;
		numWins2++;
		result = player2 + " Wins!"
	}

	if(choice1 === "Paper" && choice2 == "Rock"){
		numWins1++;
		numLosses2++;
		result = player1 + " Wins!"
	}

	if(choice1 === "Scissors" && choice2 == "Rock"){
		numLosses1++;
		numWins2++;
		result = player2 + " Wins!"
	}

	if(choice1 === "Scissors" && choice2 == "Paper"){
		numWins1++;
		numLosses2++;
		result = player1 + " Wins!"
	}

	playersRef.update({
		1: {
			name: player1,
			wins: numWins1,
			losses: numLosses1,
			choice: choice1
		},
		2: {
			name: player2,
			wins: numWins2,
			losses: numLosses2,
			choice: choice2
		}
	});
}

function displayResult () {
	var answer = "";

	if (currentNumber == 1) {
		answer = '<div class="answer">' + choice2 + '</div>';
		$("#playerChoice2").empty();
		$("#playerChoice2").html(answer);
	}

	if (currentNumber == 2) {
		answer = '<div class="answer">' + choice1 + '</div>';
		$("#playerChoice1").empty();
		$("#playerChoice1").html(answer);
	}

	$("#resultPanel").html(result);
}

function changeBorder() {
	if (turn == 1) {
		$("#playerPanel1").css({"border-color": "yellow", "border-width": "3px"});
		$("#playerPanel2").css({"border-color": "black", "border-width": "1px"});
	}

	if (turn == 2) {
		$("#playerPanel2").css({"border-color": "yellow", "border-width": "3px"});
		$("#playerPanel1").css({"border-color": "black", "border-width": "1px"});
	}
};

function resetDisplay() {
	$("#playerChoice1").empty();
	$("#playerChoice2").empty();
	$("#resultPanel").empty();
}

// Event Handlers ==============================================================

// Start button clicked
$("#startButton").on("click", function() {
	var name = $('#nameInput').val().trim();

	if (player1 == "") {
		currentPlayer = name;
		currentNumber = 1;

		newPlayer1();
		displayPlayer();
	}
	else if (player2 == "") {
		currentPlayer = name;
		currentNumber = 2;

		newPlayer2();
		displayPlayer();
	}

	if (player1 != "" && player2 != "") {
		turnRef.set(1);
	}

	return false;
});

// Rock, Paper, or Scissors clicked
$(document).on("click", ".choice", function() {
	console.log($(this).attr("value"));
	var answer = $(this).attr("value");

	if (currentNumber == 1) {
		choice1 = answer;

		playersRef.update({
			1: {
				name: player1,
				wins: numWins1,
				losses: numLosses1,
				choice: choice1
			}
		});

		displayAnswer();
		turnRef.set(2);
	}
	
	if (currentNumber == 2) {
		choice2 = answer;

		playersRef.update({
			2: {
				name: player2,
				wins: numWins2,
				losses: numLosses2,
				choice: choice2
			}
		});

		displayAnswer();
		turnRef.set(3);
	}
});

// Send button clicked for chat message
$("#sendButton").on("click", function() {

	// If there's a current player, save new chat message to Firebase
	if (currentPlayer != "") {
		chatRef.push(currentPlayer + ": " + $("#chatText").val());	
		$("#chatText").val("");

		chatRef.onDisconnect().remove();
	}

	return false;
});

// Prevent enter key in form input
$(document).on("keypress", "form", function(event) { 
    return event.keyCode != 13;
});

// Database Reference Handlers ================================================

// When player connected state changes...
connectedRef.on("value", function(snapshot) {
	if (snapshot.val()) {
		var con = connectionsRef.push(true);
		con.onDisconnect().remove();
	}
});

// When first loaded or when player connection list changes...
connectionsRef.on("value", function(snapshot) {

	// The number of online users is the number of children in the connections list.
	console.log (snapshot.numChildren());
	numPlayers = snapshot.numChildren();
});

// When first loaded or when players list changes...
playersRef.on("value", function(snapshot) {
	if (snapshot.child("1").exists()) {
		player1 = snapshot.child("1").val().name;
		numWins1 = snapshot.child("1").val().wins;
		numLosses1 = snapshot.child("1").val().losses;
		$("#playerName1").html(player1);
		$("#playerStats1").html("Wins: " + numWins1 + " Losses: " + numLosses1);

		if (snapshot.child("1").child("choice").exists()) {
			choice1 = snapshot.child("1").val().choice;
		}
	}

	if (snapshot.child("2").exists()) {
		player2 = snapshot.child("2").val().name;
		numWins2 = snapshot.child("2").val().wins;
		numLosses2 = snapshot.child("2").val().losses;
		$("#playerName2").html(player2);
		$("#playerStats2").html("Wins: " + numWins2 + " Losses: " + numLosses2);

		if (snapshot.child("2").child("choice").exists()) {
			choice2 = snapshot.child("2").val().choice;
		}
	}
});

// When player disconnects...
playersRef.once("child_removed", function(snapshot) {
	console.log("Player disconnected");

	// If player disconnects, delete turn & push chat message
	if (currentPlayer != "") {
		chatRef.push(snapshot.val().name + " has disconnected");
		turnRef.remove();
	}
});

// When first loaded or when turn number changes...
turnRef.on("value", function(snapshot) {
	if (snapshot.val()) {
		turn = snapshot.val();

		if (turn == 1) {
			resetDisplay();

			if (currentNumber == 1) {
				$("#message-1").html("It's Your Turn!");
				displayChoices();
			}

			if (currentNumber == 2) {
				$("#message-2").html("Waiting for " + player1 + " to choose.");
			}

			changeBorder();
		}

		if (turn == 2) {
			if (currentNumber == 1) {
				$("#message-1").html("Waiting for " + player2 + " to choose.");
			}

			if (currentNumber == 2) {
				$("#message-2").html("It's Your Turn!");
				displayChoices();
			}

			changeBorder();
		}

		if (turn == 3) {
			findResult();
			displayResult();

			if (currentNumber == 1) {
				setTimeout(function() {turnRef.set(1);}, 5000);	
			}
			
		}
	}
	else {
		resetDisplay();

		// Reset borders
		$("#playerPanel1").css({"border-color": "black", "border-width": "1px"});
		$("#playerPanel2").css({"border-color": "black", "border-width": "1px"});
		
		if (currentNumber == 1) {
			$("#message-1").empty();
			$("#playerName2").html("Waiting for Player 2");
			$("#playerStats2").empty();
		}

		if (currentNumber == 2) {
			$("#message-2").empty();
			$("#playerName1").html("Waiting for Player 1");
			$("#playerStats1").empty();

		}
	}
});

// When first loaded or when chat message added...
chatRef.on("child_added", function(childSnapshot) {
	if (childSnapshot.val()) {

		// Add chat message to chat panel display 
		$("#chatPanel").append("<p>" + childSnapshot.val() + "</p>");
	};
});