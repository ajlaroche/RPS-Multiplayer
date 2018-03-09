$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAzDsMkOE-RIRuLLX5oN9fu2SBJ5g-7BRw",
        authDomain: "rps-multiplayer-fe4e4.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-fe4e4.firebaseio.com",
        projectId: "rps-multiplayer-fe4e4",
        storageBucket: "",
        messagingSenderId: "651993058334"
      };
      firebase.initializeApp(config);


    var guesses = ["r", "p", "s"]
    var playerOneGuess = "";
    var playerTwoGuess = "";
    var dbPlayerOneChoice=firebase.database().ref().child("playerOneChoice");
    var resultTest = "";

      dbPlayerOneChoice.on("value", snap =>$("#playerOneChoice").text(snap.val()));

    $("#playerOne").on("click",".selection", function(){
        console.log($(this).attr("data-choice"));
        playerOneGuess= $(this).attr("data-choice");
    })
})