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


    var playerOneGuess = "";
    var playerTwoGuess = "";
    var refDatabase = firebase.database().ref();
    var dbPlayerOneChoice = firebase.database().ref().child("playerOneChoice");
    var dbPlayerTwoChoice = firebase.database().ref().child("playerTwoChoice");
   var whoAmI;
    var userProfile = { name: "", wins: 0, losses: 0, choice: "" };

    refDatabase.child("playerOne").remove();
    refDatabase.child("playerTwo").remove();

    //   dbPlayerOneChoice.on("value", snap =>$("#playerOneChoice").text(snap.val()));

    dbPlayerOneChoice.on("value", function (data) {
        console.log(data.val())
        $("#playerOneChoice").text(data.val());
    })

    dbPlayerTwoChoice.on("value", function (data) {
        console.log(data.val())
        $("#playerTwoChoice").text(data.val());
    })



    $("#SaveNameButton").on("click", function () {

        if ($("#playerName").val() !== "") {
            userProfile.name = $("#playerName").val().trim();
            if (false) {  //Need to figure out if player one already exists
                refDatabase.child("playerTwo").set(userProfile);
                console.log("playerOne Detected");
                whoAmI="playerTwo";
            } else {
                refDatabase.child("playerOne").set(userProfile);
                console.log(userProfile);
                whoAmI=eval("playerOne");
            }
        }
    })

    $("#playerOne").on("click", ".selection", function () {
        console.log($(this).attr("data-choice"));
        playerOneGuess = $(this).attr("data-choice");
        refDatabase.child("/playerOne/"+"choice").set(playerOneGuess);
    })
})