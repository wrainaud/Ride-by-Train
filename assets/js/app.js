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
  // ---------------------------------------------------------------

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

  // Update Trains function
  function updateTrains(childSnapshot) {
  	// declare variables
  	var newAddition;
  	var nextTrainTime;
  	var key = childSnapshot.key;
  	var trainName = childSnapshot.val().name;
  	var trainDestination = childSnapshot.val().destination;
  	var trainTime = childSnapshot.val().time;
  	var trainFrequency = childSnapshot.val().frequency;
  	var timeConverted = moment.unix(trainTime);

  	var timeDifference = moment().diff(moment(timeConverted, 'HH:mm'), 'minutes');
  	var timeCalculator = timeDifference % parseInt(frequency);
  	var timeTotal = parseInt(frequency) - timeCalculator;

  	// If / Else Function to make sure the total time is greater than 0
  	if (timeTotal >= 0) {
  		nextTrainTime = moment().add(timeTotal, 'minutes').format('hh:mm A');
  	}
  	else{
  		nextTrainTime = timeConverted.format('hh:mm A');
  		timeTotal = Math.abs(timeDifference - 1);
  	}

  	// New train addition to database
  	newAddition = $('<tr>');
  		newAddition.addClass(key);
  		newAddition.append($('<td>').text(trainName))
  				   .append($('<td>').text(trainDestination))
  				   .append($('<td>').text(nextTrainTime))
  				   .append($('<td>').text(trainFrequency))
  				   .append($('<td>').text(timeTotal))
  				   .append($('<button>').addClass("delete clear button alert").attr("data-train", key).html($('<i>').text("Delete")));
  	$('tbody').append(newAddition);
  }

  // Train Change function
  function trainChange (childSnapshot) {
  	// declare variables
  	var newAddition;
  	var nextTrainTime;
  	var key = childSnapshot.key;
  	var trainName = childSnapshot.val().name;
  	var trainDestination = childSnapshot.val().destination;
  	var trainTime = childSnapshot.val().time;
  	var trainFrequency = childSnapshot.val().frequency;
  	var timeConverted = moment.unix(trainTime);

  	var timeDifference = moment().diff(moment(timeConverted, 'HH:mm'), 'minutes');
  	var timeCalculator = timeDifference % parseInt(frequency);
  	var timeTotal = parseInt(frequency) - timeCalculator;

  	// If / Else Function to make sure the total time is greater than 0
  	if (timeTotal >= 0) {
  		nextTrainTime = moment().add(timeTotal, 'minutes').format('hh:mm A');
  	}
  	else{
  		nextTrainTime = timeConverted.format('hh:mm A');
  		timeTotal = Math.abs(timeDifference - 1);
  	}

  	// New train addition to database
  	$('.' + key).empty();
  	$('.' + key).append(
		$('<td>').text(trainName),
    	$('<td>').text(trainDestination),
    	$('<td>').text(nextTrainTime),
    	$('<td>').text(trainFrequency),
    	$('<td>').text(timeTotal),
    	$('<button>').addClass("delete clear button alert")
    				 .attr("data-train", key)
    				 .html($('<i>')
    				 .text("Delete")));
  }

  	// Database listener to call updateTrains function
  	database.ref().on('child_added', function(childSnapshot) {
        updateTrains(childSnapshot);
    });

  	// Database listener to call trainChange function
    database.ref().on('child_changed', function(childSnapshot) {
        trainChange(childSnapshot);
    });


    $(document).on('click', '.delete', function(event) {
        var key = $(this).attr('data-train');
        database.ref(key).remove();
        $('.' + key).remove();
    });

});

