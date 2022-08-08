const $guessForm = $("#guess-form");
const $txtGuess = $("#txt-guess");
const $message = $("#message");
const $lblScore = $("#lbl-score");
const $lblTimer = $("#lbl-timer");
const $lblHighScore = $("#lbl-high-score");

class Boggle {
  constructor(time) {
    this.time = time;
    this.words = {};
    this.score = 0;

    $guessForm.on("submit", this.handleSubmit.bind(this));
    $lblTimer.text(time);
    this.timer();
  }

  addWord(word) {
    // return false if word is already selected
    if (!!this.words[word]) return false;

    const score = word.length;
    this.words[word] = score;
    this.score += score;

    return score;
  }

  isIn(word) {
    return !!this.words[word];
  }

  processResult(guess, result) {
    let status = ``;

    if (result === "ok") {
      let score = this.addWord(guess);
      if (score) {
        status = `+${score} points`;
        $lblScore.text(this.score);
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
    $message.text(status);
  }

  async finishGame() {
    const res = await axios.post("/submit-score", { score: this.score });
    const highScore = res.data.highScore;
    this.updatePageOnFinish(highScore);
  }

  timer() {
    const timer = setInterval(() => {
      this.time--;
      if (this.time < 1) {
        clearInterval(timer);
        this.finishGame();
      }
      this.updateTime(this.time);
    }, 1000);
  }

  updateTime(time) {
    $lblTimer.text(time);
  }

  updatePageOnFinish(highScore) {
    $guessForm.off();
    $guessForm.on("submit", (e) => {
      e.preventDefault();
    });
    $txtGuess.attr("disabled", true).val("");
    $message.text("Time's up!");
    $lblHighScore.text(highScore);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const guess = $txtGuess.val();
    $txtGuess.val("");
    const res = await axios.post("/check-guess", { guess: guess });
    this.processResult(guess, res.data.result);
  }
}

/*****************/

function onLoad() {
  boggleGame = new Boggle(10);
}
$(document).ready(onLoad);
