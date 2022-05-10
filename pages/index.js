import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import Timer from "../components/timer/Timer";

export default function Home() {
  // index
  const [isGame, setIsGame] = useState(false);
  // index
  const [countdown, setCountDown] = useState("");
  const [wordsArray, setWordsArray] = useState(randomWords(216));
  const [wordIndex, setWordIndex] = useState(0);
  const [finishedWords, setFinishedWords] = useState(0);
  const [word, setWord] = useState(wordToArray(wordsArray[wordIndex]));

  console.log(word);
  const [rounds, setRounds] = useState([
    { noWords: 0, isCompleted: false },
    { noWords: 0, isCompleted: false },
    { noWords: 0, isCompleted: false },
  ]);
  const [roundNumber, setRoundNumber] = useState(2);
  const [textInput, setTextInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true);
  const inputRef = useRef();

  function startGame() {
    setIsGame(true);
    setCountDown(false);
    inputRef.current.focus();
  }

  function wordToArray(word) {
    const letterArr = [];

    for (const letter of word) {
      letterArr.push({ letter: letter, color: "white" });
    }
    return letterArr;
  }

  useEffect(() => {
    if (countdown) {
      function clock() {
        setTimeout(() => {
          setCountDown((prev) =>
            typeof prev === "string" ? 3 : prev > 1 ? prev - 1 : startGame()
          );
        }, 1000);
      }

      clock();
    }
  }, [countdown]);

  useEffect(() => {
    for (let i = 0; i < textInput.length; i++) {
      if (textInput.length > word.length) {
        return;
      } else if (textInput[i] === word[i].letter) {
        let newArr = [...word];
        newArr[i] = { letter: word[i].letter, color: "lightGreen" };
        setWord(newArr);
      } else if (textInput[i] !== word[i].letter) {
        let newArr = [...word];
        newArr[i] = { letter: word[i].letter, color: "red" };
        setWord(newArr);
      }
    }

    if (textInput === wordsArray[wordIndex]) {
      let index = wordIndex + 1;
      setFinishedWords((prev) => prev + 1);
      setTextInput("");
      setWordIndex(index);
      setWord(wordToArray(wordsArray[index]));
    }
  }, [textInput]);

  function handleOnClick() {
    setCountDown("Get Ready!");
    setInputDisabled(false);
  }

  function updateInput(e) {
    const { value } = e.target;
    setTextInput(value);
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

  function nextRound(round) {
    setCountDown(`Round ${round}`);
    setTextInput("");
    setWordIndex(0);
    setWord(wordToArray(wordsArray[0]));
    setInputDisabled(false);
    inputRef.current.focus;
  }

  function timerFinished() {
    setIsGame(false);
    if (rounds[2].isCompleted === false) {
      setRounds((prev) => {
        let updated = false;
        return prev.map((rep) => {
          if (!rep.isCompleted && !updated) {
            updated = true;
            return { noWords: finishedWords, isCompleted: true };
          } else {
            return { ...rep };
          }
        });
      });
      setTextInput("");
      setInputDisabled(true);
      setWordsArray(randomWords(216));
      nextRound(roundNumber);
      setRoundNumber(3);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Speed typing</h1>
      <div className={styles.gameWindow}>
        <div className={styles.timerContainer}>
          <Timer
            min={1}
            sec={0}
            timerFinished={timerFinished}
            isGame={isGame}
          />
        </div>
        <p className={styles.centerScreen}>
          {!isGame ? countdown : genSpanLetters(word)}
        </p>
        <input
          type={"text"}
          className={styles.textInput}
          value={textInput}
          onChange={(e) => updateInput(e)}
          ref={inputRef}
          disabled={inputDisabled}
        />
        <div className={styles.numberOfWords}>
          <p>Words: {finishedWords}</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleOnClick}>
          Start Game
        </button>
      </div>
    </div>
  );
}
