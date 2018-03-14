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
    var playerOneExist;
    var playerTwoExist;
    var gameStatus;
    var userName;

    refDatabase.ref("/playerOne/" + "choice").set("");
    refDatabase.ref("/playerTwo/" + "choice").set("");
    refDatabase.ref("/playerOne/" + "wins").set(0);
    refDatabase.ref("/playerTwo/" + "wins").set(0);
    refDatabase.ref("/playerOne/" + "losses").set(0);
    refDatabase.ref("/playerTwo/" + "losses").set(0);
    refDatabase.ref("/playerOne/" + "status").set("waiting");
    refDatabase.ref("/playerTwo/" + "status").set("waiting");
    refDatabase.ref("chatbox").set("");


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
        playerTwoWins = snapshot.val().playerTwo.wins;

        playerOneName = snapshot.val().playerOne.name;
        playerTwoName = snapshot.val().playerTwo.name;

        playerOneStatus = snapshot.val().playerOne.status;
        playerTwoStatus = snapshot.val().playerTwo.status;

        playerOneExist = snapshot.val().playerOne.online;
        playerTwoExist = snapshot.val().playerTwo.online;

        gameStatus = snapshot.val().Winner;

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
            $(".opposingPick").hide();
        }
        console.log(snapshot.val());

        if (whoAmI === "/playerOne/") {
            $("#gameScore").text("Wins: " + playerOneWins + " Losses: " + snapshot.val().playerOne.losses);
        } else {
            $("#gameScore").text("Wins: " + playerTwoWins + " Losses: " + snapshot.val().playerTwo.losses);
        }
        if (playerOneStatus === "waiting" && playerTwoStatus === "Played") {
            $("#playerOneCard").addClass("playerTurn");
        } else {
            $("#playerOneCard").removeClass("playerTurn");
        }
        if (playerOneStatus === "Played" && playerTwoStatus === "waiting") {
            $("#playerTwoCard").addClass("playerTurn");
        } else {
            $("#playerTwoCard").removeClass("playerTurn");
        }

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    })

    //enter user names
    $("#SaveNameButton").on("click", function () {
        checkWhoAmI(); //checks which player am I again in case second player has already logged
        if (playerOneExist === true && playerTwoExist === true) {
            $("#myModal").modal();
        } else {
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
                    $(".selectionOne").hide();
                    $("#playerOneOpposingPick").show();

                } else {
                    refDatabase.ref("playerOne").set(userProfile);
                    // whoAmIname = "/playerOne/name";
                    console.log(whoAmIname);
                    $("#whichPlayer").text("You are Player 1").show();
                    $("#gameScore").show();
                    $(".nameInputSection").hide();
                    $(".selectionTwo").hide();
                    $("#playerTwoOpposingPick").show();
                }
            }
        }
        $("#playerName").val("");
    })
    $("#playerName").keypress(function (e) {
        if (e.keyCode == 13)
            $("#SaveNameButton").click();
    });



    $("#playerOne").on("click", ".selection", function () {
        if (whoAmI === "/playerOne/" && playerOneExist === true && playerTwoExist === true) {
            console.log($(this).attr("data-choice"));
            playerOneGuess = $(this).attr("data-choice");
            refDatabase.ref(whoAmI + "choice").set(playerOneGuess);
            refDatabase.ref(whoAmI + "status").set("Played");
            $(".selectionOne").hide();
            $("#playerOnePick").show();
            $(".selectionTwo").hide();
            $("#playerTwoOpposingPick").show();
            findWinner();

        } else {
            alert("Please enter your name and wait for a second player to join.")
        }
    })
    $("#playerTwo").on("click", ".selection", function () {
        if (whoAmI === "/playerTwo/" && playerTwoExist === true && playerOneExist === true) {
            console.log($(this).attr("data-choice"));
            playerTwoGuess = $(this).attr("data-choice");
            refDatabase.ref(whoAmI + "choice").set(playerTwoGuess);
            refDatabase.ref(whoAmI + "status").set("Played");
            $(".selectionTwo").hide();
            $("#playerTwoPick").show();
            $(".selectionOne").hide();
            $("#playerOneOpposingPick").show();
            findWinner();
        } else {
            alert("Please enter your name and wait for a second player to join.")
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
        if (playerOneExist === true && playerTwoExist === true) {
            var userChat = userProfile.name + ": " + $("#chatUserText").val().trim();
            if (userChat !== "") {
                refDatabase.ref("chatbox").push(userChat);
            }
        } else {
            alert("There needs to be two named players for chat function to work");
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

    //Mouse events
    $(".card-text").on({
        mouseenter: function () {
            $(this).css({ "background-color": "#194769", "color": "#F6F6E9", "cursor": "pointer" })
        },
        mouseleave: function () {
            $(this).css({ "background-color": "white", "color": "black", "cursor": "default" })
        }
    })

    //Idle time calculator to reload page
    var idleTime = 0;
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    })
    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 9) { // 10 minutes
            window.location.reload();
        }
    }
})