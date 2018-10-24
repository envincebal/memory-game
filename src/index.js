const card = document.getElementsByClassName("card");
const cardsArray = Array.prototype.slice.call(card); // Converts card elements to an array.
const moves = document.querySelector(".moves");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
let timer; // Serves as reference for time interval.
let mode; // Serves as reference for easy or hard mode.
let turn = []; // Stores turns in each pair of attempts.
let movesCounter = 0;
let points = 0;
let isPlaying = false; // This boolean controls timer on or off.

init();

function init() {
	const random = shuffle(cardsArray); // Stores shuffle function with array of card as argument.
	const deck = document.querySelector(".deck");
	const starItem = "<li><i class='fa fa-star'></i></li>";

	/* Resets all counters and DOM elements. */
	document.querySelector(".stars").innerHTML = starItem + starItem + starItem;
	document.querySelector(".container").style.display = "none";
	document.querySelector(".welcome-menu").style.display = "block";
	document.querySelector(".result-modal").style.display = "none";

	// Resets all initial counters and stats.

	seconds.textContent = "00";
	movesCounter = 0;
	moves.textContent = movesCounter;
	points = 0;
	turn = [];
	isPlaying = false;

	/* Removes card styling and hides them face down. */
	cardsArray.forEach(card => {
		card.classList.remove("open", "show", "match");
	});

	/* Loops through card array and appends each card in random order. */
	random.forEach(card => {
		deck.append(card);
	});

	clearInterval(timer); // Stops timer.
	setEventListener(); // Initiates event listeners.
}

function setEventListener() {

	/* Loops through all card elements and attaches each with event listeners that reveal a clicked card. */
	cardsArray.forEach(card => {
		card.addEventListener("click", cardEventListener);
	});
	/* Loops through all card elements and attaches each with event listeners to start the 'startTimer' function. */
	cardsArray.forEach(card => {
		card.addEventListener("click", startTimer);
	});

	// Sets event listener to easy button.
	document.querySelector(".easy-mode").addEventListener("click", setMode);
	// Sets event listener to hard button.
	document.querySelector(".hard-mode").addEventListener("click", setMode);

	// Sets event listener to restart icon.
	document.querySelector(".restart-button").addEventListener("click", init);
	// Sets event listener to results button.
	document.querySelector(".reset-button").addEventListener("click", init);
}

function setMode() {
	const choice = this.textContent;
	const welcome = document.querySelector(".welcome-menu");
	let easyTime = 2; // "Easy" mode gives player 2 minutes.
	let hardTime = 4; // "Hard" mode gives player 4 minutes.

	minutes.textContent = choice === "Easy" ? easyTime : hardTime;;

	document.querySelector(".container").style.display = "flex";
	welcome.style.display = "none";

	// Checks whether Easy or Hard mode was chosen and renders deck of cards accordingly.
	if (choice === "Easy") {
		mode = "easy";
		cardsArray.forEach(card => {
			if (card.classList.contains("hard-card")) {
				card.style.display = "none";
			}
			card.style.width = "125px";
			card.style.height = "125px";
		});
	} else if (choice === "Hard") {
		mode = "hard";
		cardsArray.forEach(card => {
			card.style.width = "86px";
			card.style.height = "86px";
			card.style.display = "flex";
		});
	}
}

function cardEventListener(e) {
	/* Once timer is counting, event listeners for starting the timer is removed. */
	if (isPlaying) {
		cardsArray.forEach(card => {
			card.removeEventListener("click", startTimer);
		});
	}
	/* Click adds styling to card and shows symbol. */
	if (e.target.classList.contains("show")) {
		return "";
	} else {
		e.target.classList.add("open", "show");
		turn.push(e.target.children); // Uncovered card is inserted to 'turn' array.
	}

	if (turn.length === 2) {
		/* When a pair of card are flipped, move counter increments up. */
		movesCounter++;
		moves.textContent = movesCounter;
		starsCount(movesCounter); // Moves counter is passed into 'starsCount' function as an argument.

		if (turn[0][0].classList.value !== turn[1][0].classList.value) {
			/* If pair of card do NOT match, the 'wrong' style is applied to both. */
			turn[0][0].parentElement.classList.add("wrong");
			turn[1][0].parentElement.classList.add("wrong");
			/* Prevents other card from being clicked while mismatched card are showing. */
			cardsArray.forEach(card => {
				card.removeEventListener("click", cardEventListener)
			});

			/* 'Wrong' styling is shown briefly before non-matching card are hidden again. */
			setTimeout(function () {
				turn[0][0].parentElement.classList.remove("open", "show", "wrong");
				turn[1][0].parentElement.classList.remove("open", "show", "wrong");

				turn = []; // 'Turn' array is emptied when a pair of card are revealed.
				/* When mismatched card are hidden again, event listeners are added again. */
				cardsArray.forEach(card => {
					card.addEventListener("click", cardEventListener);
				})
			}, 1000);

		} else {
			/* If pair of card DO match, the 'match' style is applied to both. */
			turn[0][0].parentElement.classList.add("match");
			turn[1][0].parentElement.classList.add("match");
			points++; // If a match is made, points increment up.
			turn = []; // 'Turn' array is emptied when a pair of card are revealed.
		}
	}
	/* Once all matches are found, the 'results' function is immediately called */
	if (points === 8 && mode === "easy") {
		result("won");
	} else if (points === 18 && mode === "hard") {
		result("won");
	}
}

function starsCount(counter) {
	const stars = document.querySelector(".stars");
	let firstItem = document.querySelector("li:first-child");
	/* The 'movesCounter' is passed as an argument and into the switch statement to determine when a star is removed. */
	if (mode === "easy") {
		switch (counter) {
			case 12:
			case 18:
			case 20:
				stars.removeChild(firstItem);
		}
	} else {
		switch (counter) {
			case 30:
			case 40:
			case 50:
				stars.removeChild(firstItem);
		}
	}

	// If stars runs out, "stars" is passed into results function to indicate loss.
	if (mode === "easy" && !stars.childElementCount && points < 8) {
		result("stars");
	} else if (mode === "hard" && !stars.childElementCount && points < 18) {
		result("stars");
	}
}

function startTimer() {
	let mins = minutes.textContent; // Minutes counter.
	let secs = 0; // Seconds counter.

	isPlaying = true;

	/* Sets the game time countdown */
	timer = setInterval(function () {
		if (secs <= 0) {
			secs = 59;
			seconds.textContent = secs;
		} else {
			secs--;
			seconds.textContent = (secs < 10) ? "0" + secs : secs;
		}

		if (secs === 59) {
			mins--;
			minutes.textContent = mins;
		}

		// If time runs out, "time" is passed into results function to indicate loss.
		if (mins === 0 && secs === 0) {
			result("time");
		}
	}, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length;
	let temporaryValue;
	let randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function result(condition) {
	const resultHeading = document.querySelector(".result-heading");
	const showResult = document.querySelector(".result");
	const remainingTime = document.querySelector(".timer");
	const remainingStars = document.querySelectorAll(".stars li");

	clearInterval(timer); // When game is over, the timer stops.
	document.querySelector(".container").style.display = "none"; // The card display is removed.
	document.querySelector(".result-modal").style.display = "inline-block"; // Results modal is displayed.

	// Shows the completion time, number of stars and moves attempts.
	if (condition === "won") {
		resultHeading.textContent = `You Won!!!`;
		showResult.textContent = `Your time was ${remainingTime.textContent}, in ${moves.textContent} moves and with ${remainingStars.length} star${remainingStars.length !== 1 ? "s" : ""}!`;
	} else if (condition === "time" || condition === "stars") {
		resultHeading.textContent = `Sorry, you ran out of ${condition}.`;
		showResult.textContent = `Please try again.`;
	}
}