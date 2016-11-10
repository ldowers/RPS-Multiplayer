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


// When first loaded or when players list changes