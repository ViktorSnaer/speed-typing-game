import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import Timer from "../components/timer/Timer";

export default function Home() {
  // index
  const [isGame, setIsGame] = useState(false);
  // index
  const [countdown, setCountDown] = useState("");
  const [centerScreen, setCenterScreen] = useState("");
  const [wordsArray, setWordsArray] = useState(randomWords(216));
  const [wordIndex, setWordIndex] = useState(0);
  const [finishedWords, setFinishedWords] = useState(0);
  const [word, setWord] = useState(wordToArray(wordsArray[wordIndex]));

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
    console.log("game starts");
    setIsGame(true);
    console.log(genSpanLetters(word));
    // setCenterScreen(genSpanLetters(word));
    inputRef.current.focus();
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

  function countDown() {
    console.log("count down function called");
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

    // bug not matching after next round
    if (textInput === wordsArray[wordIndex]) {
      setFinishedWords((prev) => prev + 1);
      setTextInput("");
      setWordIndex((prev) => prev + 1);
      setWord(wordToArray(wordsArray[wordIndex + 1]));
    }
  }, [textInput, isGame]);

  function handleOnClick() {
    countDown();
    setInputDisabled(false);
  }

  function updateInput(e) {
    const { value } = e.target;
    setTextInput(value);
  }

  // function genSpanLetters(word) {
  //   return word.map((letter, index) => {
  //     return (
  //       <span key={index} style={{ color: letter.color }}>
  //         {letter.letter}
  //       </span>
  //     );
  //   });
  // }

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
    setTextInput("");
    setInputDisabled(true);

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

      setWordsArray(randomWords(216));
      setCountDown("Total words: " + finishedWords);
      setTimeout(() => {
        nextRound(roundNumber);
      }, 3000);
      setRoundNumber(3);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Speed typing</h1>
      <div className={styles.gameWindow}>
        <div className={styles.timerContainer}>
          <Timer
            min={0}
            sec={30}
            timerFinished={timerFinished}
            isGame={isGame}
          />
        </div>
        <p className={styles.centerScreen}>
          {centerScreen}
          {/* {!isGame ? countdown : genSpanLetters(word)} */}
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
