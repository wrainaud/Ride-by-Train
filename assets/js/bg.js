// William Rainaud
// Rutgers Coding Bootcamp 
// Homework 7 - Train Scheduler

// Ready Document
$(document).ready(function(){
	// debugger;

	function pexelsGet(){
	  var pexelURL = "http://api.pexels.com/v1/search?query=train+query&per_page=15&page=1"
	  var authkey = "563492ad6f91700001000001be480b819db8420a648ce3420de38bf3";


	  $.ajax({
	    method: "GET",
	    url: pexelURL,
    	headers: {
    		"Authorization": "563492ad6f91700001000001be480b819db8420a648ce3420de38bf3"
		}
		})


	  .done(function(response) {

	  	console.log(response)

	  // var pexelItem = response.data;

	  // var newImage = pexelItem.photos.url;

	  console.log(response.photos[0].url)

	  // for (var i = 0; i < pexelItem.length; i++){

	  	
	  })

	};

	pexelsGet();

	function setBackground() {
		$.supersized({

        // Functionality
        slide_interval     : 4000,    // Length between transitions
        transition         : 1,    // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed   : 1000,    // Speed of transition
        performance        : 1,    // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)

        // Size & Position
        min_width          : 0,    // Min width allowed (in pixels)
        min_height         : 0,    // Min height allowed (in pixels)
        vertical_center    : 1,    // Vertically center background
        horizontal_center  : 1,    // Horizontally center background
        fit_always         : 0,    // Image will never exceed browser width or height (Ignores min. dimensions)
        fit_portrait       : 1,    // Portrait images will not exceed browser height
        fit_landscape      : 0,    // Landscape images will not exceed browser width

        // Components
        slide_links        : 'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        slides             : [    // Slideshow Images
                                 {image : '../images/backgrounds/1.jpg'},
                                 {image : '../images/backgrounds/2.jpg'},
                                 {image : '../images/backgrounds/3.jpg'},
                             ]

    	})
	};

	setBackground();


});
	