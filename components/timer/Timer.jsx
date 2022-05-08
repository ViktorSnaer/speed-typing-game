import React, { useEffect, useState } from "react";

export default function Timer({ min, sec, isGame, timerFinished }) {
  const [timer, setTimer] = useState({ min, sec, isTimer: false });
  console.log(timer);

  function runTimer() {
    console.log("run timer is on");
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (!prev.isTimer) {
          clearInterval(interval);
          return {
            ...prev,
          };
        } else if (prev.min > 0 && prev.sec === 0) {
          return { min: prev.min - 1, sec: 59, isTimer: true };
        } else if (prev.sec > 0) {
          return { ...prev, sec: prev.sec - 1 };
        } else if (prev.min === 0 && prev.sec === 0) {
          clearInterval(interval);
          timerFinished();
          return {
            min: 1,
            sec: 0,
            isTimer: false,
          };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }

  useEffect(() => {
    if (isGame) {
      setTimer((prev) => ({ ...prev, isTimer: true }));
      runTimer();
    }
  }, [isGame]);

  return (
    <div>
      <p>
        <span>{timer.min < 10 ? "0" + timer.min : timer.min}</span> :
        <span>{timer.sec < 10 ? "0" + timer.sec : timer.sec}</span>
      </p>
    </div>
  );
}
