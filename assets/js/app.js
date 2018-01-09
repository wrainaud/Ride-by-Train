$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyCUFU3piwDLNHVxl-O9kwudo852hMUo8x4",
    authDomain: "ride-by-train.firebaseapp.com",
    databaseURL: "https://ride-by-train.firebaseio.com",
    projectId: "ride-by-train",
    storageBucket: "",
    messagingSenderId: "203018430764"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var currentTime = moment();

  function clockTime() {
  	var Time = moment().format("LTS");
  	var unixTime = moment().format("X");
  	$("#current-time").html(Time);
  };

  setInterval(clockTime, 1000);

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

  $("#add-train-button").on("click", function(event) {

  	  event.preventDefault();

  	  var trainName = $("#train-name").val().trim();
  	  var trainDestination = $("#train-destination").val().trim();
  	  var trainTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X");
  	  var trainAddedTime = moment().format("X");
  	  var trainFrequency = $("#train-frequency").val().trim();

	  var newTrain = {
	    name: trainName,
	    destination: trainDestination,
	    time: trainTime,
	    lastupdated: trainAddedTime,
	    frequency: trainFrequency
	  };

	  database.ref().push(newTrain);

	  console.log(newTrain.name);
	  console.log(newTrain.destination);
	  console.log(newTrain.time);
	  console.log(newTrain.lastupdated);
	  console.log(newTrain.frequency);

	  $("#train-name").val("");
	  $("#train-destination").val("");
	  $("#first-train-time").val("");
	  $("#train-frequency").val("");
	});

  function updateTrains(childSnapshot) {

  	var newAddition;
  	var nextTrainTime;
  	var key = childSnapshot.key;
  	var trainName = childSnapshot.val().name;
  	var trainDestination = childSnapshot.val().destination;
  	var trainTime = childSnapshot.val().time;
  	var trainFrequency = childSnapshot.val().frequency;
  	var timeConverted = moment.unix(trainTime);

  	var timeDifference = moment().diff(moment(timeConverted, 'HH:mm'), 'minutes');
  	var timeCalculator = timeDifference % parseInt(trainFrequency);
  	var timeTotal = parseInt(trainFrequency) - timeCalculator;

  	if (timeTotal >= 0) {
  		nextTrainTime = moment().add(timeTotal, 'minutes').format('hh:mm A');
  	}
  	else{
  		nextTrainTime = timeConverted.format('hh:mm A');
  		timeTotal = Math.abs(timeDifference - 1);
  	}


  	newAddition = $('<tr>');
  		newAddition.addClass(key);
  		newAddition.append($('<td>').text(trainName))
  				   .append($('<td>').text(trainDestination))
  				   .append($('<td>').text(nextTrainTime))
  				   .append($('<td>').text(trainFrequency))
  				   .append($('<td>').text(timeTotal))
  				   .append($('<button>').addClass("btn btn-danger delete glyphicon glyphicon-ban-circle")
                                  .attr("data-train", key)
                                  .html($('<i>')));
  	$('#train-table-body').append(newAddition);
  }

  function trainChange (childSnapshot) {

  	var newAddition;
  	var nextTrainTime;
  	var key = childSnapshot.key;
  	var trainName = childSnapshot.val().name;
  	var trainDestination = childSnapshot.val().destination;
  	var trainTime = childSnapshot.val().time;
  	var trainFrequency = childSnapshot.val().frequency;
  	var timeConverted = moment.unix(trainTime);

  	var timeDifference = moment().diff(moment(timeConverted, 'HH:mm'), 'minutes');
  	var timeCalculator = timeDifference % parseInt(trainFrequency);
  	var timeTotal = parseInt(trainFrequency) - timeCalculator;

  	if (timeTotal >= 0) {
  		nextTrainTime = moment().add(timeTotal, 'minutes').format('hh:mm A');
  	}
  	else{
  		nextTrainTime = timeConverted.format('hh:mm A');
  		timeTotal = Math.abs(timeDifference - 1);
  	}

  	$('.' + key).empty();
  	$('.' + key).append(
		$('<td>').text(trainName),
    	$('<td>').text(trainDestination),
    	$('<td>').text(nextTrainTime),
    	$('<td>').text(trainFrequency),
    	$('<td>').text(timeTotal),
    	$('<button>').addClass("btn btn-danger delete glyphicon glyphicon-ban-circle")
                   .attr("data-train", key)
                   .html($('<i>')));
    				
  }

  	database.ref().on('child_added', function(childSnapshot) {
        updateTrains(childSnapshot);
    });

    database.ref().on('child_changed', function(childSnapshot) {
        trainChange(childSnapshot);
	});
	
    $(document).on('click', '.delete', function(event) {
        var key = $(this).attr('data-train');
        database.ref(key).remove();
        $('.' + key).remove();
    });

});

