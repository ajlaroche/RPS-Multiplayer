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
    var whoAmIname = "playerOne";
    var userProfile = { name: "", wins: 0, losses: 0, choice: "", status: "waiting" };
    var dbPlayerOneChoice = "";
    var dbPlayerTwochoice = "";
    var playerOneWins = 0;
    var playerOneLoss = 0;
    var playerTwoWins = 0;
    var playerTwoLoss = 0;
    var playerOneStatus = "waiting";
    var playerTwoStatus = "waiting";
    var playerOneName = "";
    var playerTwoName = "";
    var gameStatus;

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
            whoAmI = "/playerOne/";

        } else {
            whoAmI = "/playerTwo/";

        }
        console.log(enteredData.playerOne);
        console.log(whoAmI, whoAmIname);

    })

    //listen for user picks
    refDatabase.ref().on("value", function (snapshot) {
        dbPlayerOneChoice = snapshot.val().playerOne.choice;
        dbPlayerTwochoice = snapshot.val().playerTwo.choice;
        playerOneWins = snapshot.val().playerOne.wins;
        
        playerOneName = snapshot.val().playerOne.name;
        playerTwoName = snapshot.val().playerTwo.name;
        playerOneStatus = snapshot.val().playerOne.status;
        playerTwoStatus = snapshot.val().playerTwo.status;
        gameStatus = snapshot.val().Winner;
        // playerOneLoss = snapshot.val().playerOne.losses;
        playerTwoWins = snapshot.val().playerTwo.wins;
        
        // playerTwoLoss = snapshot.val().playerTwo.losses;
        $("#playerOnePick").text(dbPlayerOneChoice);
        $("#playerTwoPick").text(dbPlayerTwochoice);
        $("#headerPlayerOne").text(snapshot.val().playerOne.name);
        $("#headerPlayerTwo").text(snapshot.val().playerTwo.name);
        $("#announceWinner").text(snapshot.val().Winner);

        if (gameStatus === "waiting") {
            $(".selection").show();
            $(".picks").hide();
        } else {
            $(".selection").hide();
            $(".picks").show();
        }
        console.log(snapshot.val());

    })

    //enter user names
    $("#SaveNameButton").on("click", function () {

        if ($("#playerName").val() !== "") {
            userProfile.name = $("#playerName").val().trim();
            if (whoAmI === "/playerTwo/") {  //Need to figure out if player one already exists
                refDatabase.ref("playerTwo").set(userProfile);
                whoAmIname = "/playerTwo/name";
                console.log(whoAmIname);
            } else {
                refDatabase.ref("playerOne").set(userProfile);
                whoAmIname = "/playerOne/name";
                console.log(whoAmIname);
                console.log(userProfile);
            }
        }
        $("#playerName").val("");
    })
    $("#playerName").keypress(function (e) {
        if (e.keyCode == 13)
            $("#SaveNameButton").click();
    });



    $("#playerOne").on("click", ".selection", function () {
        if (whoAmI === "/playerOne/") {
            console.log($(this).attr("data-choice"));
            playerOneGuess = $(this).attr("data-choice");
            refDatabase.ref(whoAmI + "choice").set(playerOneGuess);
            refDatabase.ref(whoAmI + "status").set("Played");
            $(".selectionOne").hide();
            $("#playerOnePick").show();
            findWinner();

        }
    })
    $("#playerTwo").on("click", ".selection", function () {
        if (whoAmI === "/playerTwo/") {
            console.log($(this).attr("data-choice"));
            playerTwoGuess = $(this).attr("data-choice");
            refDatabase.ref(whoAmI + "choice").set(playerTwoGuess);
            refDatabase.ref(whoAmI + "status").set("Played");
            $(".selectionTwo").hide();
            $("#playerTwoPick").show();
            findWinner();
        }
    })

    //Find winner of game
    var playerOneTest = "";
    var playerTwoTest = "";
    var resultTest = "";
    var winner;


    var test = "playerOne";

    function findWinner() {
        if (playerOneStatus === "Played" && playerTwoStatus === "Played") {
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
                winner = playerOneName + " Wins!";
                playerOneWins++;
                playerTwoLoss = playerOneWins;
                refDatabase.ref("/playerOne/" + "wins").set(playerOneWins);
                refDatabase.ref("/playerTwo/" + "losses").set(playerTwoLoss);
            } else if (resultTest === "rr" || resultTest === "ss" || resultTest === "pp") {
                winner = "It's a Tie!"

            } else {
                winner = playerTwoName + " Wins!";
                playerTwoWins++;
                playerOneLoss = playerTwoWins;
                refDatabase.ref("/playerTwo/" + "wins").set(playerTwoWins);
                refDatabase.ref("/playerOne/" + "losses").set(playerOneLoss);

            }
            refDatabase.ref("Winner").set(winner);

            setTimeout(function () {
                refDatabase.ref("/playerOne/" + "choice").set("");
                refDatabase.ref("/playerTwo/" + "choice").set("");
                refDatabase.ref("/playerOne/" + "status").set("waiting");
                refDatabase.ref("/playerTwo/" + "status").set("waiting");
                refDatabase.ref("Winner").set("waiting");
                resultTest = "";
                playerOneTest = "";
                playerTwoTest = "";
                $(".selectionOne").show();
                $("#playerOnePick").hide();
                $(".selectionTwo").show();
                $("#playerTwoPick").hide();
            }, 5000);


            console.log(playerOneWins, playerOneLoss)


            console.log(winner);
        }
    }
    // refDatabase.ref(whoAmIname).onDisconnect().cancel();
    // refDatabase.ref(whoAmIname).onDisconnect().set("");
})