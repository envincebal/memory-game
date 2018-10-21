const card = document.getElementsByClassName("card");
const cardsArray = Array.prototype.slice.call(card); // Converts card elements to an array.
const moves = document.querySelector(".moves");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
let turn = []; // Stores turns in each pair of attempts.
let movesCounter = 0;
let points = 0;
let mode;
let timer; // Serves as reference for time interval.
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

	minutes.textContent = "0";
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
	const modeButtons = document.getElementsByClassName("mode-button");

	for (let i = 0; i < modeButtons.length; i++) {
		modeButtons[i].addEventListener("click", setMode);
	};

	/* Loops through all card elements and attaches each with event listeners that reveal a clicked card. */
	cardsArray.forEach(card => {
		card.addEventListener("click", cardEventListener);
	});
	/* Loops through all card elements and attaches each with event listeners to start the 'startTimer' function. */
	cardsArray.forEach(card => {
		card.addEventListener("click", startTimer);
	});

	document.querySelector(".restart").addEventListener("click", init); // Sets event listener to restart icon.
	document.querySelector(".reset").addEventListener("click", init); // Sets event listener to results button.
}

function setMode() {
	const choice = this.textContent;
	const welcome = document.querySelector(".welcome-menu");

	document.querySelector(".container").style.display = "flex";
	welcome.style.display = "none";

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
	console.log(points);
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
		result();
	} else if (points === 18 && mode === "hard") {
		result();
	}
}

function starsCount(counter) {
	const stars = document.querySelector(".stars");
	let firstItem = document.querySelector("li:first-child");
	/* The 'movesCounter' is passed as an argument and into the switch statement to determine when a star is removed. */
	if (mode === "easy") {
		switch (counter) {
			case 14:
			case 20:
				stars.removeChild(firstItem);
		}
	}

}

function startTimer() {
	let secs = 0; // Seconds counter.
	let mins = 0; // Minutes counter.

	isPlaying = true;

	/* Sets the game time counter */
	timer = setInterval(function () {

		if (secs >= 59) {
			secs = 0;
			seconds.textContent = "0" + secs;
		} else {
			secs++;
			seconds.textContent = (secs < 10) ? "0" + secs : secs;
		}

		if (secs === 0) {
			mins++;
			minutes.textContent = mins;
		}
	}, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function result() {
	const showResult = document.querySelector(".result");
	const time = document.querySelector(".timer");
	const starsCount = document.querySelectorAll(".stars li");

	clearInterval(timer); // When game is over, the timer stops.
	document.querySelector(".container").style.display = "none"; // The card display is removed.
	document.querySelector(".result-modal").style.display = "inline-block"; // Results modal is displayed.
	showResult.textContent = `Your time was ${time.textContent}, in ${moves.textContent} moves and with ${starsCount.length} star${starsCount.length !== 1 ? "s" : ""}!`; // Shows the completion time, number of stars and moves attempts.
}