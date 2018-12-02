$(document).ready(function () {
    /* configure toggle and initiate start/reset game */
    let toggleButton = $("#startGame");
    let mainContent = $("#mainContent");

    toggleButton.on("click", function () {

        if (toggleButton.attr("data-click-state") == 1) {
            toggleButton.attr("data-click-state", 0)
            toggleButton.text("Start");
            toggleButton.removeClass("btn-outline-danger");
            toggleButton.addClass("btn-outline-success");
            timer.reset();
        } else {
            toggleButton.attr("data-click-state", 1)
            toggleButton.text("End");
            toggleButton.removeClass("btn-outline-success");
            toggleButton.addClass("btn-outline-danger");
            startGame(false);
        };

        /* show/hide main content*/
        mainContent.slideToggle("slow");
    });

    /* setup timer */
    let intervalId;

    let clockRunning = false;

    let timer = {
        time: 0,
        reset: function () {
            clearInterval(intervalId);
            clockRunning = false;
            timer.time = 0;

            $("#totalTime").text("00:00:00");
        },
        start: function () {
            if (!clockRunning) {
                intervalId = setInterval(timer.count, 1000);
                clockRunning = true;
            }
        },
        count: function () {
            timer.time++;

            let converted = timer.timeConverter(timer.time);

            $("#totalTime").text(converted);
        },
        timeConverter: function (t) {
            let hours = Math.floor(t / 3600);
            t = t % 3600;

            let minutes = Math.floor(t / 60);
            t = t % 60;

            let seconds = Math.floor(t);

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            if (minutes === 0) {
                minutes = "00";
            } else if (minutes < 10) {
                minutes = "0" + minutes;
            }

            if (hours === 0) {
                hours = "00";
            } else if (hours < 10) {
                hours = "0" + hours;
            }

            return hours + ":" + minutes + ":" + seconds;
        }
    };

    /* setup hover effects on crystals */
    let crystalGroup = $(".crystal");
    crystalGroup.hover(function () {
        $(this).css({
            "background-color": "rgb(32,32,32)",
            "border": "2px solid " + $(this).attr("id"),
            "-webkit-transition": "box-shadow linear 1s",
            "transition": "box-shadow linear 1s"
        });
    }, function () {
        $(this).css({
            "background-color": "transparent",
            "border": "none"
        });
    });

    /* fx to randomize target score and crystal values */
    function arrayList(min, max, length) {
        let arr = []
        while (arr.length < length) {
            min = Math.ceil(min);
            max = Math.floor(max);
            let num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (arr.indexOf(num) === -1) arr.push(num);
        }
        return arr;
    };

    /* global vars for the game */
    let arrCrystal;
    let redCounter;
    let whiteCounter;
    let pinkCounter;
    let yellowCounter;
    let arrCompScore;
    let compScore;
    let userScore;
    let winCount;
    let lossCount;

    /* main fx to start a game/round */
    function startGame(isReset) {
        startNewRound(isReset);

        arrCompScore = [];
        compScore = 0;
        arrCompScore = arrayList(19, 120, 1);
        compScore = arrCompScore[0];
        $("#compScore").html(compScore);

        if (!isReset) {
            timer.start();
        };
    };

    /* fx to start a new round */
    function startNewRound(isReset) {
        resetVar(isReset);

        arrCrystal = arrayList(1, 12, 4);
        $("#red").attr("data-value", arrCrystal[0]);
        $("#white").attr("data-value", arrCrystal[1]);
        $("#pink").attr("data-value", arrCrystal[2]);
        $("#yellow").attr("data-value", arrCrystal[3]);
    };

    /* onclick event for crystals */
    $(".crystal").on("click", function () {
        let crystalVal = $(this).attr("data-value");

        /* crystal click counter */
        let crystalId = $(this).attr("id");
        switch (crystalId) {
            case "red":
                redCounter++;
                $("#redCounter").html(redCounter);
                break;
            case "white":
                whiteCounter++;
                $("#whiteCounter").html(whiteCounter);
                break;
            case "pink":
                pinkCounter++;
                $("#pinkCounter").html(pinkCounter);
                break;
            case "yellow":
                yellowCounter++;
                $("#yellowCounter").html(yellowCounter);
                break;
        }

        $("#userScore").html(userScore);
        userScore += parseInt(crystalVal);
        $("#userScore").html(userScore);

        /* score validation */
        if (userScore >= compScore) {
            if (userScore === compScore) {
                winCount += 1;
                $("#totalWins").html(winCount);
                $("#userWin").removeClass("d-none");
                $("#userWin").addClass("inline-flex");
            } else {
                lossCount += 1;
                $("#totalLosses").html(lossCount);
                $("#compWin").removeClass("d-none");
                $("#compWin").addClass("inline-flex");
            };

            setTimeout(function () {
                $("#userWin").removeClass("inline-flex");
                $("#userWin").addClass("d-none");
                $("#compWin").removeClass("inline-flex");
                $("#compWin").addClass("d-none");
                startGame(true);
            }, 1000);
        };
    });

    /* onclick event for reset button */
    $("#resetGame").on("click", function () {
        startNewRound(true);
    });

    /* reset vars */
    function resetVar(isReset) {
        arrCrystal = [];
        redCounter = 0;
        whiteCounter = 0;
        pinkCounter = 0;
        yellowCounter = 0;
        $("#redCounter").html(redCounter);
        $("#whiteCounter").html(whiteCounter);
        $("#pinkCounter").html(pinkCounter);
        $("#yellowCounter").html(yellowCounter);

        userScore = 0;
        $("#userScore").html(0);
        if (!isReset) {
            winCount = 0;
            $("#totalWins").html(winCount);
            lossCount = 0;
            $("#totalLosses").html(lossCount);
        }
    };
});