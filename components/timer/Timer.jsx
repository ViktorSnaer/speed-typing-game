import React, { useEffect, useState } from "react";

export default function Timer({ min, sec, isGame }) {
  const [timer, setTimer] = useState({ min, sec });

  return (
    <div>
      <p>
        <span>{min < 10 ? "0" + min : min}</span> :
        <span>{sec < 10 ? "0" + sec : sec}</span>
      </p>
    </div>
  );
}
