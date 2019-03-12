// 1. Initialize Firebase
// 2. Create button for adding new train schedules - then update the html + update the database
// 3. Create a way to retrieve train schedule from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCIkBrK-UTWjjA6eiV49kaOT6-ehppu5YE",
        authDomain: "trainscheduler-d5dce.firebaseapp.com",
        databaseURL: "https://trainscheduler-d5dce.firebaseio.com",
        projectId: "trainscheduler-d5dce",
        storageBucket: "trainscheduler-d5dce.appspot.com",
        messagingSenderId: "690368485836"
      };
      firebase.initializeApp(config);
      //console.log(firebase);
    
    // a variable to reference the database
        var database = firebase.database();
    
    $("#searchButton").on("click", function (event) {
        event.preventDefault();    
        //alert ("You clicked Me!");
    // Capture user inputs and store them into variables
        var trainName = $("#trainNameInput").val().trim();
        var trainDest = $("#destinationInput").val().trim();
        var trainTime = $("#timeInput").val().trim();
        var trainFreq = $("#frequencyInput").val().trim();
        //console.log(trainInput);
    
    // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDest,
            time: trainTime,
            frequency: trainFreq
      };
    
    // Uploads train data to the database
       database.ref().push(newTrain);
    
    // Logs everything to console
       console.log(newTrain.name);
       console.log(newTrain.destination);
       console.log(newTrain.time);
       console.log(newTrain.frequency);
    
       alert("Train successfully added");
    
    // Clears all of the text-boxes
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#timeInput").val("");
        $("#frequencyInput").val("");
    });
    
    // Firebase watcher
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());
        var newName = childSnapshot.val().name;
        var newDest = childSnapshot.val().destination;
        var newTime = childSnapshot.val().time;
        var newFreq = childSnapshot.val().frequency;
    
        console.log(newName);
        console.log(newDest);
        console.log(newTime);
        console.log(newFreq);
    
    // MOMENT.JS
    
    trainTime = 0;
    
    // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);
    
    // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
    // Difference between the current time and first train (trainTime)
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + timeDiff);
    
    // Time apart (remainder)
        var tRemainder = timeDiff % newFreq;
        console.log(tRemainder);
    
    // Minutes Until Next Train
        var tMinutesTillTrain = newFreq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
    // Next Train Time
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    
    // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(newName), // train name
            $("<td>").text(newDest), // destination
            $("<td>").text(newFreq), // frequency
            $("<td>").text(newTime), // next arrival 
            $("<td>").text(tMinutesTillTrain) // minutes away 
        );
    
    // Append new row to table
            $("#trainTable > tbody").append(newRow);
    });
    })