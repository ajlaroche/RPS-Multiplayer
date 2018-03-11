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
    var refDatabase = firebase.database();
    var whoAmI = "";
    var userProfile = { name: "", wins: 0, losses: 0, choice: "" };
    var dbPlayerOneChoice = "";
    var dbPlayerTwochoice = "";
    var playerOneWins = 0;
    var playerOneLoss = 0;
    var playerTwoWins = 0;
    var playerTwoLoss = 0;

    refDatabase.ref("/playerOne/" + "choice").set("");
    refDatabase.ref("/playerTwo/" + "choice").set("");
    refDatabase.ref("/playerOne/" + "wins").set(0);
    refDatabase.ref("/playerTwo/" + "wins").set(0);
    refDatabase.ref("/playerOne/" + "losses").set(0);
    refDatabase.ref("/playerTwo/" + "losses").set(0);

    var otherUser = firebase.auth().currentUser;
    setTimeout(function () { console.log(otherUser) }, 5000);

    //check if I'm player one or two
    refDatabase.ref().once("value", function (snapshot) {
        var enteredData = snapshot.val();
        if (enteredData.playerOne.name === "") {
            whoAmI = "playerOne";
        } else {
            whoAmI = "playerTwo";
        }
        console.log(enteredData.playerOne);
        console.log(whoAmI);
    })

    //listen for user picks
    refDatabase.ref().on("value", function (snapshot) {
        dbPlayerOneChoice = snapshot.val().playerOne.choice;
        dbPlayerTwochoice = snapshot.val().playerTwo.choice;
        playerOneWins = snapshot.val().playerOne.wins;
        // playerOneLoss = snapshot.val().playerOne.losses;
        playerTwoWins = snapshot.val().playerTwo.wins;
        // playerTwoLoss = snapshot.val().playerTwo.losses;
        $("#playerOneChoice").text(dbPlayerOneChoice);
        $("#playerTwoChoice").text(dbPlayerTwochoice);
        console.log(snapshot.val());

    })

    //enter user names
    $("#SaveNameButton").on("click", function () {

        if ($("#playerName").val() !== "") {
            userProfile.name = $("#playerName").val().trim();
            if (whoAmI === "playerTwo") {  //Need to figure out if player one already exists
                refDatabase.ref("playerTwo").set(userProfile);
                console.log("playerOne Detected");
            } else {
                refDatabase.ref("playerOne").set(userProfile);
                console.log(userProfile);
            }
        }
    })
    $("#playerName").keypress(function (e) {
        if (e.keyCode == 13)
            $("#SaveNameButton").click();
    });



    $("#playerOne").on("click", ".selection", function () {
        if (whoAmI === "playerOne") {
            console.log($(this).attr("data-choice"));
            playerOneGuess = $(this).attr("data-choice");
            refDatabase.ref("/playerOne/" + "choice").set(playerOneGuess);
            findWinner();

        }
    })
    $("#playerTwo").on("click", ".selection", function () {
        if (whoAmI === "playerTwo") {
            console.log($(this).attr("data-choice"));
            playerTwoGuess = $(this).attr("data-choice");
            refDatabase.ref("/playerTwo/" + "choice").set(playerTwoGuess);
            findWinner();
        }
    })

    //Find winner of game
    var playerOneTest = "";
    var playerTwoTest = "";
    var resultTest = "";
    var winner;


    function findWinner() {
        if (dbPlayerOneChoice !== "" && dbPlayerTwochoice !== "") {
            switch (dbPlayerOneChoice) {
                case "rock":
                    playerOneTest = "r";
                    break;
                case "paper":
                    playerOneTest = "p";
                    break;
                case "scissors":
                    playerOneTest = "s";
            }
            switch (dbPlayerTwochoice) {
                case "rock":
                    playerTwoTest = "r";
                    break;
                case "paper":
                    playerTwoTest = "p";
                    break;
                case "scissors":
                    playerTwoTest = "s";
            }
            resultTest = playerOneTest + playerTwoTest;
            console.log(resultTest);
            if (resultTest === "rs" || resultTest === "pr" || resultTest === "sp") {
                winner = "playerOne";
                playerOneWins++;
                playerTwoLoss++;
                refDatabase.ref("/playerOne/" + "wins").set(playerOneWins);
                refDatabase.ref("/playerTwo/" + "losses").set(playerTwoLoss);
            } else if (resultTest === "rr" || resultTest === "ss" || resultTest === "pp") {
                winner = "It's a Tie!"

            } else {
                winner = "playerTwo";
                playerTwoWins++;
                playerOneLoss++;
                refDatabase.ref("/playerTwo/" + "wins").set(playerTwoWins);
                refDatabase.ref("/playerOne/" + "losses").set(playerOneLoss);

            }
            refDatabase.ref("/playerOne/" + "choice").set("");
            refDatabase.ref("/playerTwo/" + "choice").set("");

            console.log(playerOneWins, playerOneLoss)


            console.log(winner);
        }
    }
})