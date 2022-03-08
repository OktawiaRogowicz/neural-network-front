import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useContext, useState, useEffect, useRef} from "react";

const red = '#f54e4e';

function Timer(props) {

  const [secondsLeft, setSecondsLeft] = useState(0);
  const secondsLeftRef = useRef(secondsLeft);
  const workMinutes = 0.25;

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {

    secondsLeftRef.current = workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (secondsLeftRef.current === 0) {
        return props.stop();
      }
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalSeconds = workMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10)
    seconds = '0' + seconds;

  return (
    <div style={{width: 80, height: 80}}>
      <CircularProgressbar
        value={percentage}
        text={minutes + ':' + seconds}
        styles={buildStyles({
        textColor:'#fff',
        pathColor:red,
        trailColor:'#fff',
        strokeWidth: 10,
      })} />
    </div>
  );
}

export default Timer;