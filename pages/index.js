import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [countdown, setCountDown] = useState("");

  useEffect(() => {
    if (countdown) {
      function clock() {
        setTimeout(() => {
          setCountDown((prev) =>
            typeof prev === "string" ? 3 : prev > 1 ? prev - 1 : ""
          );
        }, 1000);
      }

      clock();
    }
  }, [countdown]);

  function handleOnClick() {
    setCountDown("Get Ready!");
  }

  return (
    <div className={styles.container}>
      <h1>Open All day and all night</h1>
      <div className={styles.gameWindow}>
        <p className={styles.countdown}>{countdown}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleOnClick}>
          Start Game
        </button>
      </div>
    </div>
  );
}
