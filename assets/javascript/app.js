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
    var whoAmIname = "";
    var userProfile = { name: "", wins: 0, losses: 0, choice: "", status: "waiting", online: true };
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
    var userName;

    refDatabase.ref("/playerOne/" + "choice").set("");
    refDatabase.ref("/playerTwo/" + "choice").set("");
    refDatabase.ref("/playerOne/" + "wins").set(0);
    refDatabase.ref("/playerTwo/" + "wins").set(0);
    refDatabase.ref("/playerOne/" + "losses").set(0);
    refDatabase.ref("/playerTwo/" + "losses").set(0);
    refDatabase.ref("chatbox").set("");

    var otherUser = firebase.auth().currentUser;
    setTimeout(function () { console.log(otherUser) }, 5000);

    //check if I'm player one or two
    function checkWhoAmI() {
        refDatabase.ref().once("value", function (snapshot) {
            var enteredData = snapshot.val();
            if (enteredData.playerOne.online === false) {
                whoAmI = "/playerOne/";
                // refDatabase.ref("/playerOne/" + "online").set(true);

            } else {
                whoAmI = "/playerTwo/";
                // refDatabase.ref("/playerTwo/" + "online").set(true);
            }
            whoAmIname = whoAmI + "online"

            console.log(enteredData.playerOne);
            console.log(whoAmI, whoAmIname);

        })
    }
    checkWhoAmI();

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

        playerTwoWins = snapshot.val().playerTwo.wins;

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

        if (whoAmI === "/playerOne/") {
            $("#gameScore").text("Wins: " + playerOneWins + " Losses: " + snapshot.val().playerOne.losses);
        } else {
            $("#gameScore").text("Wins: " + playerTwoWins + " Losses: " + snapshot.val().playerTwo.losses);
        }

       

    })

    //enter user names
    $("#SaveNameButton").on("click", function () {
        checkWhoAmI();
        if ($("#playerName").val() !== "") {
            userProfile.name = $("#playerName").val().trim();
            refDatabase.ref(whoAmI).onDisconnect().update({ name: "", online: false });
            if (whoAmI === "/playerTwo/") {  //Need to figure out if player one already exists
                refDatabase.ref("playerTwo").set(userProfile);
                // whoAmIname = "/playerTwo/name";
                console.log(whoAmIname);
                $("#whichPlayer").text("You are Player 2").show();
                $("#gameScore").show();
                $(".nameInputSection").hide();

            } else {
                refDatabase.ref("playerOne").set(userProfile);
                // whoAmIname = "/playerOne/name";
                console.log(whoAmIname);
                $("#whichPlayer").text("You are Player 1").show();
                $("#gameScore").show();
                $(".nameInputSection").hide();
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
    refDatabase.ref().onDisconnect().cancel();


    //Chat capability section starts here
    $("#sendTextButton").on("click", function () {
        var userChat = userProfile.name + ": " + $("#chatUserText").val().trim();
        if (userChat !== "") {
            refDatabase.ref("chatbox").push(userChat);
        }
        $("#chatUserText").val("");
    })

    $("#chatUserText").keypress(function (e) {
        if (e.keyCode == 13)
            $("#sendTextButton").click();
    });
    //listening event for when new children are added only
    refDatabase.ref("chatbox").on("child_added", function (snapshot) {
        var addText = $("<p></p>").text(snapshot.val());
        $("#chatText").append(addText);
    })
})