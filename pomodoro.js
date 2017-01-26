// Progress bar object
var bar = new ProgressBar.SemiCircle(progressBar, {
  strokeWidth: 6,
  easing: 'easeInOut',
  duration: 0,
  color: '#8000FF',
  trailColor: '#fff',
  trailWidth: 1,
  svgStyle: null
});

$(document).ready(function() {
  // default timer object
  var timerObj = {
    hours: 0,
    minutes: 25,
    seconds: 0
  };
  // default session and break timer minutes
  var sessionMin = timerObj.minutes;
  var breakMin = 5;
  // Use seconds accumulated and total seconds for animation
  var secondsAccumulated = 0;
  var totalSeconds = timerObj.minutes * 60;
  var timerInt;           // timer interval
  var timerOn = false;    // Is timer active
  var currentTimer = "Session"; // title
  // Colors for the timer animation
  var breakColor = '#FF8000';
  var sessionColor = '#0080FF';

  $("#title").html(currentTimer);
  $("#timer").html(constructTimer(timerObj));
  $("#session").html(sessionMin);
  $("#break").html(breakMin);

  // Start the timer
  $("#timerStart").on('click', function() {
    timerOn = true;
    // Decrease 1 second every 1000 ms
    timerInt = setInterval(function() {
      secondsAccumulated++;
      decreaseOneSecond(timerObj);
      $("#timer").html(constructTimer(timerObj));
      bar.animate(secondsAccumulated / totalSeconds);

      // Switch to break timer or session timer
      if (secondsAccumulated == totalSeconds) {
        secondsAccumulated = 0;
        // Switch to break timer
        if (currentTimer == "Session") {
          currentTimer = "Break";
          $("#title").html(currentTimer);
          totalSeconds = breakMin * 60;
          changeTimerObjMins(timerObj, breakMin);
        }
        // Switch to session timer
        else {
          currentTimer = "Session";
          $("#title").html(currentTimer);
          totalSeconds = sessionMin * 60;
          changeTimerObjMins(timerObj, sessionMin);
        }
        $("#timer").html(constructTimer(timerObj));
      }
    }, 1000);
  });
  
  // Stop the timer
  $("#timerStop").on('click', function () {
    timerOn = false;
    clearInterval(timerInt);
  });
  
  // Add and remove minutes from session and break timer
  $(".timerMins").on('click', function(event) {
    if (! timerOn) {
      switch (event.target.id) {
          
        case "addSession":
          sessionMin++;
          $("#session").html(sessionMin);
          // Update session timer if it's the active timer
          if (currentTimer == "Session") {
            secondsAccumulated = 0;
            totalSeconds = sessionMin * 60;
            changeTimerObjMins(timerObj, sessionMin);
            $("#timer").html(constructTimer(timerObj));
          }
          break;
          
        case "minusSession":
          if (sessionMin > 1) {
            sessionMin--;
            $("#session").html(sessionMin);
            
            if (currentTimer == "Session") {
              secondsAccumulated = 0;
              totalSeconds = sessionMin * 60;
              changeTimerObjMins(timerObj, sessionMin);
              $("#timer").html(constructTimer(timerObj));
            }
          }
          break;
          
        case "addBreak":
          breakMin++;
          $("#break").html(breakMin);
          // Update break timer if it's the active timer
          if (currentTimer == "Break") {
            secondsAccumulated = 0;
            totalSeconds = breakMin * 60;
            changeTimerObjMins(timerObj, breakMin);
            $("#timer").html(constructTimer(timerObj));
          }
          break;
          
        case "minusBreak":
          if (breakMin > 1) {
            breakMin--;
            $("#break").html(breakMin);
            
            if (currentTimer == "Break") {
              secondsAccumulated = 0;
              totalSeconds = breakMin * 60;
              changeTimerObjMins(timerObj, breakMin);
              $("#timer").html(constructTimer(timerObj));
            }
          }
          break;
      }
    }
  });
});

/*
 * Constructs the timer from hour, minutes, and seconds
 * @timerObj: object holding all the timer parameters
 */
function constructTimer(timerObj) {
  var timer = "";

  // Add hours
  if (timerObj.hours > 0) {
    timer = timerObj.hours + ':';
  }

  // Add minutes
  if (timerObj.minutes < 10) {
    timer = '0' + timerObj.minutes + ':';
  }
  else {
    timer = timerObj.minutes + ':';
  }

  // Add seconds
  if (timerObj.seconds > 0 && timerObj.seconds < 10) {
    timer = timer + '0' + timerObj.seconds;
  } else if (timerObj.seconds >= 10) {
    timer = timer + timerObj.seconds;
  }
  // If seconds == 0, add 00 to timer
  else {
    timer = timer + '00';
  }

  return timer;
}

/*
 * Decreases the timer by one second
 * @timerObj: object holding the timer parameters
 */
function decreaseOneSecond(timerObj) {
  timerObj.seconds = timerObj.seconds - 1;

  // Check to reduce hours, minutes, seconds
  if (timerObj.seconds < 0 &&
    timerObj.minutes == 0 &&
    timerObj.hours > 0) {
    timerObj.hours = timerObj.hours - 1;
    timerObj.minutes = 59;
    timerObj.seconds = 59;
  }
  // Check to reduce minutes, seconds
  else if (timerObj.seconds < 0 &&
    timerObj.minutes != 0) {
    timerObj.minutes = timerObj.minutes - 1;
    timerObj.seconds = 59;
  }
  // Else, it's the last minute
  else if (timerObj.seconds < 0) {
    timerObj.seconds = 0;
  }
}

/*
* Changes the timer object minutes when the user changes
* the length of the session and resets seconds to zero
* @timerObj: object containing timer parameters
* @newMins: new minutes to put in timer object
*/
function changeTimerObjMins(timerObj, newMins) {
  timerObj.hours = Math.floor(newMins / 60);
  timerObj.minutes = newMins % 60;
  timerObj.seconds = 0;
}