const $guessForm = $("#guess-form");
const $txtGuess = $("#txt-guess");
const $guessStatus = $("#guess-status");
const $lblScore = $("#lbl-score");
const $lblTimer = $("#lbl-timer");
const $lblHighScore = $("#lbl-high-score");

function processResult(guess, result) {
  let status = ``;
  console.log("Result: ", result);

  if (result === "ok") {
    let score = game.addWord(guess);
    if (score) {
      status = `+${score} points`;
      $lblScore.text(game.score);
    } else {
      status = "Already found";
    }
  }
  if (result === "not-on-board") {
    status = "Not on board";
  }
  if (result === "not-word") {
    status = "Not a word";
  }

  $guessStatus.text(status);
}

async function handleGuessSubmit(e) {
  e.preventDefault();
  guess = $txtGuess.val();
  res = await axios.post("/check-guess", (data = { guess: guess }));
  console.log(res.data.result);
  processResult(guess, res.data.result);
}
$guessForm.on("submit", handleGuessSubmit);

function onLoad() {
  game = new Game();
}
$(document).ready(onLoad);
