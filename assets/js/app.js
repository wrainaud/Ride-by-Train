// William Rainaud
// Rutgers Coding Bootcamp 
// Homework 7 - Train Scheduler

// Ready Document
$(document).ready(function(){


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCUFU3piwDLNHVxl-O9kwudo852hMUo8x4",
    authDomain: "ride-by-train.firebaseapp.com",
    databaseURL: "https://ride-by-train.firebaseio.com",
    projectId: "ride-by-train",
    storageBucket: "",
    messagingSenderId: "203018430764"
  };
  firebase.initializeApp(config);

  // declare variable for Firebase database
  var database = firebase.database();

  // declare variable for Current Time
  var currentTime = moment();

  // Function for Time Format
  function clockTime() {
  	var Time = moment().format("HH:mm:ss");
  	var unixTime = moment().format("X");
  	$("#current-time").html(Time);
  };

  setInterval(clockTime, 1000);

  	
  // Function for updating Time
  function timeUpdate() {
    database.ref().once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          currentTime = moment().format("X");
          database.ref(childSnapshot.key).update({
              lastupdated: currentTime,
            });
        });
    });
  }

  setInterval(timeUpdate, 10000);
  }

  // Button for Adding Trains
  $("#add-train-button").on("click", function(event) {

  	  // prevent page from reloading
  	  event.preventDefault();

  	  // Grabs user input
  	  var trainName = $("#train-name").val().trim();
  	  var trainDestination = $("#train-destination").val().trim();
  	  var trainTime = moment($("#first-train-time").val().trim(), "HH/MM").format("X");
  	  var trainAddedTime = moment().format("X");
  	  var trainFrequency = moment($("#train-frequency").val().trim(), "MM").format("X");

  	  console.log(trainTime)

	  // Creates local "temporary" object for holding employee data
	  var newTrain = {
	    name: trainName,
	    destination: trainDestination,
	    time: trainTime,
	    lastupdated: trainAddedTime,
	    frequency: trainFrequency,
	  };

	  // Uploads employee data to the database
	  database.ref().push(newTrain);

	  // Logs everything to console
	  console.log(newTrain.name);
	  console.log(newTrain.destination);
	  console.log(newTrain.time);
	  console.log(newTrain.lastupdated);
	  console.log(newTrain.frequency);

	  // Alert
	  alert("Employee successfully added");

	  // Clears all of the text-boxes
	  $("#train-name").val("");
	  $("#train-destination").val("");
	  $("#first-train-time").val("");
	  $("#train-frequency").val("");
	});

 });