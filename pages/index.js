import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import Timer from "../components/timer/Timer";

let wordsArray = randomWords(600);
let finishedWords = 0;
let rounds = [
  { noWords: 0, isCompleted: false },
  { noWords: 0, isCompleted: false },
  { noWords: 0, isCompleted: false },
];
export default function Home() {
  const [isGame, setIsGame] = useState(false);

  const [centerScreen, setCenterScreen] = useState(
    <>
      <button className={styles.button} onClick={handleOnClick}>
        Start Game
      </button>
    </>
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState(wordToArray(wordsArray[wordIndex]));
  const [roundNumber, setRoundNumber] = useState(2);
  const [textInput, setTextInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isInput, setIsInput] = useState(false);
  const inputRef = useRef();

  function startGame() {
    setIsGame(true);
    inputRef.current.focus();
  }

  function countDown() {
    setIsInput(true);
    let count = 3;
    setCenterScreen("Get Ready!");
    const cleanup = setInterval(() => {
      if (count === 0) {
        clearInterval(cleanup);
        startGame();
      } else {
        setCenterScreen(count);
      }
      count--;
    }, 1000);
  }

  function wordToArray(word) {
    const letterArr = [];

    for (const letter of word) {
      letterArr.push({ letter: letter, color: "white" });
    }
    return letterArr;
  }

  function genSpanLetters(word) {
    return word.map((letter, index) => {
      return (
        <span key={index} style={{ color: letter.color }}>
          {letter.letter}
        </span>
      );
    });
  }

  // update color of letter
  // update new word if word is completed
  // display word - center screen
  useEffect(() => {
    const newArr = word.map((letterObj, index) => {
      if (textInput[index] === letterObj.letter) {
        return { ...letterObj, color: "lightGreen" };
      } else if (
        textInput[index] !== letterObj.letter &&
        textInput.length > index
      ) {
        return { ...letterObj, color: "red" };
      } else if (textInput[index] !== letterObj.letter) {
        return { ...letterObj, color: "white" };
      } else {
        return { ...letterObj };
      }
    });

    setWord(newArr);
    if (isGame) {
      setCenterScreen(genSpanLetters(newArr));
    }
    if (!isGame && finishedWords > 0) {
      setCenterScreen("");
    }

    if (textInput === wordsArray[wordIndex]) {
      finishedWords++;
      setTextInput("");
      setWordIndex((prev) => prev + 1);
      setWord(wordToArray(wordsArray[wordIndex + 1]));
    }
  }, [textInput, isGame]);

  function restartGame() {
    setWordIndex(0);
    setRoundNumber(2);
    wordsArray = randomWords(600);
    finishedWords = 0;
    rounds = [
      { noWords: 0, isCompleted: false },
      { noWords: 0, isCompleted: false },
      { noWords: 0, isCompleted: false },
    ];
    handleOnClick();
  }

  function handleOnClick() {
    setWord(wordToArray(wordsArray[0]));
    countDown();
    setInputDisabled(false);
  }

  function updateInput(e) {
    const { value } = e.target;
    setTextInput(value);
  }

  function gameOver() {
    setIsInput(false);
    const totalWords =
      rounds[0].noWords + rounds[1].noWords + rounds[2].noWords;
    const WPM = Math.floor(totalWords / 3);
    let countdown = 5;
    const interval = setInterval(() => {
      countdown--;
      setCenterScreen(() => {
        if (countdown > 2) {
          return "Words: " + finishedWords;
        } else if (countdown > 1) {
          return "Game Over";
        } else if (countdown === 0) {
          clearInterval(interval);
          return (
            <div className={styles.playAgain}>
              <p>Total Words: {totalWords}</p>
              <p>Words Per Min: {WPM}</p>
              <p>Thank you for playing 🏆</p>
              <button className={styles.button} onClick={restartGame}>
                Play again
              </button>
            </div>
          );
        }
      });
    }, 1000);
  }

  function timerFinished() {
    setTextInput("");
    setIsGame(false);
    setTextInput("");
    setInputDisabled(true);

    if (rounds[1].isCompleted === false) {
      let update = false;
      const updatedRounds = rounds.map((round) => {
        if (!round.isCompleted && !update) {
          update = true;
          return { noWords: finishedWords, isCompleted: true };
        } else {
          return { ...round };
        }
      });
      rounds = updatedRounds;
      setTimeout(() => {
        setCenterScreen("Words: " + finishedWords);
      }, 500);
      setTimeout(() => {
        nextRound(roundNumber);
      }, 3000);
      setRoundNumber(3);
    } else {
      const finalRound = rounds.map((round, index) => {
        if (index === 2) {
          return { noWords: finishedWords, isCompleted: true };
        } else {
          return { ...round };
        }
      });
      rounds = finalRound;
      gameOver();
    }
  }

  function nextRound(round) {
    finishedWords = 0;
    setCenterScreen("Round " + round);
    setTimeout(() => {
      countDown();
    }, 2000);
    setInputDisabled(false);
    inputRef.current.focus;
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Speed Typing Game</h1>
        <p style={{ textAlign: "center", margin: "0" }}>
          Three one-minute rounds of lightning fast speed typing ⚡
        </p>
        <div className={styles.gameWindow}>
          <div className={styles.timerContainer}>
            <Timer
              min={1}
              sec={0}
              timerFinished={timerFinished}
              isGame={isGame}
            />
          </div>
          <p className={styles.centerScreen}>{centerScreen}</p>
          <input
            type={"text"}
            className={`${styles.textInput} ${!isInput && styles.hide}`}
            value={textInput}
            onChange={(e) => updateInput(e)}
            ref={inputRef}
            disabled={inputDisabled}
          />
          <div className={styles.numberOfWords}>
            <p>Words: {finishedWords}</p>
          </div>
        </div>
      </div>
      <div className={styles.smallScreenMessage}>
        <p>Not intended for mobile! 🦦</p>
      </div>
    </>
  );
}
