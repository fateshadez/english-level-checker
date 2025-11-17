const container = $(".container");
const checkBtn = $(".check-btn");
const idkBtn = $(".idk-btn");
const randomWord = $(".random-word");
const input = $(".input");
const restartBtn = $(".restart");
const displayCorrectGuesses = $(".correct-guesses");
const displayIncorrectGuesses = $(".incorrect-guesses");
const results = $(".results");
const wordsTranslated = $(".words-translated");

$("p:eq(3)").css("color", "green");
$("p:eq(4)").css("color", "red");

let correctGuesses = 0;
let incorrectGuesses = 0;
let score = 0;
let englishLvls = {
  A1: 3,
  A2: 9,
  B1: 18,
  B2: 30,
  C1: 40
};

let englishLvl;
let timeoutId;

const words = [
  {
    word: "apple",
    translation: "яблуко",
    score: 1,
  },
  {
    word: "butter",
    translation: "масло",
    score: 1,
  },
  {
    word: "delicious",
    translation: "смачний",
    score: 1,
  },
  {
    word: "ability",
    translation: ["здатність", "талант", "хист"],
    score: 2,
  },
  {
    word: "benefit",
    translation: ["користь", "перевага", "вигода"],
    score: 2,
  },
  {
    word: "necessary",
    translation: ["необхідний", "потрібний"],
    score: 2,
  },
  {
    word: "accommodation",
    translation: [
      "проживання",
      "житло",
      "притулок",
      "примирення",
      "припасування",
      "компроміс",
    ],
    score: 3,
  },
  {
    word: "entertainment",
    translation: ["розвага", "розваги"],
    score: 3,
  },
  {
    word: "luxury",
    translation: ["розкіш", "насолода"],
    score: 3,
  },
  {
    word: "adequate",
    translation: ["адекватний", "відповідний", "достатній"],
    score: 4,
  },
  {
    word: "consistently",
    translation: "послідовно",
    score: 4,
  },
  {
    word: "outstanding",
    translation: ["видатний", "знаменитий", "знатний"],
    score: 4,
  },
  {
    word: "breakthrough",
    translation: ["прорив", "досягнення", "перемога"],
    score: 5,
  },
  {
    word: "ambiguous",
    translation: ["неоднозначний", "двозначний"],
    score: 5,
  },
  {
    word: "exquisite",
    translation: ["вишуканий", "пишний", "виборний"],
    score: 5,
  },
];

let totalWords = words.length;
let currentWord = null;

let usedWords = new Set();
const nextWord = () => {
  if (usedWords.size == words.length) {
    showResults();
    restart();
  }

  let word;
  do {
    word = words[Math.floor(Math.random() * words.length)];
  } while (usedWords.has(word));

  usedWords.add(word);
  randomWord.text(word.word);
  currentWord = word;
};

const translate = (Input) => {
  if (Input === "Skip") {
    incorrectGuesses++;
    updateGuesses();
    nextWord();
    return;
  }

  Input = input.val().trim().toLowerCase();

  if (!Input) {
    clearTimeout(timeoutId);
    $(".results").css("opacity", "1");
    $(".results").text("Please, enter a translation");
    timeoutId = setTimeout(() => {
      $(".results").css("opacity", "0");
    }, 2000);
    return;
  }

  console.log(currentWord.translation);

  let isCorrect = false;
  if (Array.isArray(currentWord.translation)) {
    isCorrect = currentWord.translation.includes(Input);
  } else {
    isCorrect = Input === currentWord.translation;
  }

  if (isCorrect) {
    correctGuesses++;
    score += currentWord.score;
  } else {
    incorrectGuesses++;
  }

  console.log(score);
  updateGuesses();
  input.val("");
  nextWord();
};

const updateGuesses = () => {
  displayCorrectGuesses.text(correctGuesses);
  displayIncorrectGuesses.text(incorrectGuesses);
  wordsTranslated.text(`Word ${usedWords.size + 1} of ${totalWords}`);
};

const restart = () => {
  score = 0;
  correctGuesses = 0;
  incorrectGuesses = 0;
  usedWords = new Set();
  input.val("");
  updateGuesses();
};

const showResults = () => {
  clearTimeout(timeoutId);
  $(".results").css("opacity", "1");
  timeoutId = setTimeout(() => {
    $(".results").css("opacity", "0");
  }, 3000);
  if  (score >= englishLvls.C1) {
    englishLvl = "C1!";
  } else if (score >= englishLvls.B2) {
    englishLvl = "B2!";
  } else if (score >= englishLvls.B1) {
    englishLvl = "B1!";
  } else if (score >= englishLvls.A2) {
    englishLvl = "A2!";
  } else if (score >= englishLvls.A1) {
    englishLvl = "A1!";
  } else if (score < englishLvls.A1) {
    englishLvl = "bad!!!";
  }
  results.text(
    `Well done! Your score is ${score}! Your approximate English level is ${englishLvl}`
  );
};

let isRunning = true;

$(document).ready(() => {
  restart();
  updateGuesses();
  nextWord();
});

checkBtn.click(() => {
  translate();
});

restartBtn.click(() => {
  restart();
});

idkBtn.click(() => {
  translate("Skip");
});

input.keypress((e) => {
  if (e.which == 13 && isRunning) {
    checkBtn.click();
  }
});