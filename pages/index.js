import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import Timer from "../components/timer/Timer";

export default function Home() {
  const [isGame, setIsGame] = useState(false);

  const [countdown, setCountDown] = useState("");

  const [newWord, setNewWord] = useState(randomWords(216));
  const [wordIndex, setWordIndex] = useState(0);
  const [randomWord, setRandomWord] = useState(
    wordToLetters(newWord[wordIndex])
  );

  const [textInput, setTextInput] = useState("");

  const inputRef = useRef();

  function startGame() {
    setIsGame(true);
    setCountDown(false);
    inputRef.current.focus();
  }

  function wordToLetters(word) {
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
            typeof prev === "string" ? 1 : prev > 1 ? prev - 1 : startGame()
          );
        }, 1000);
      }

      clock();
    }
  }, [countdown]);

  useEffect(() => {
    for (let i = 0; i < textInput.length; i++) {
      if (textInput.length > randomWord.length) {
        return;
      } else if (textInput[i] === randomWord[i].letter) {
        let newArr = [...randomWord];
        newArr[i] = { letter: randomWord[i].letter, color: "lightGreen" };
        setRandomWord(newArr);
      } else if (textInput[i] !== randomWord[i].letter) {
        let newArr = [...randomWord];
        newArr[i] = { letter: randomWord[i].letter, color: "red" };
        setRandomWord(newArr);
      }
    }

    if (textInput === newWord[wordIndex]) {
      let index = wordIndex + 1;
      setTextInput("");
      setWordIndex(index);
      setRandomWord(wordToLetters(newWord[index]));
    }
  }, [textInput]);

  function handleOnClick() {
    setCountDown("Get Ready!");
  }

  function updateInput(e) {
    const { value } = e.target;
    setTextInput(value);
  }

  function genSpanLetters() {
    if (randomWord) {
      return randomWord.map((letter, index) => {
        return (
          <span key={index} style={{ color: letter.color }}>
            {letter.letter}
          </span>
        );
      });
    } else {
      return "";
    }
  }

  function timerFinished() {}

  return (
    <div className={styles.container}>
      <h1>Speed typing</h1>
      <div className={styles.gameWindow}>
        <Timer min={1} sec={0} timerFinished={timerFinished} isGame={isGame} />
        <p className={styles.centerScreen}>
          {!isGame ? countdown : genSpanLetters()}
        </p>
        <input
          type={"text"}
          className={styles.textInput}
          value={textInput}
          onChange={(e) => updateInput(e)}
          ref={inputRef}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleOnClick}>
          Start Game
        </button>
      </div>
    </div>
  );
}
