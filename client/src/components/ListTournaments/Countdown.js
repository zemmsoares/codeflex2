import moment from "moment";

import React, { useEffect, useState, useCallback, useRef } from "react";

const calculateDuration = (eventTime) =>
  moment.duration(
    Math.max(eventTime - Math.floor(Date.now() / 1000), 0),
    "seconds"
  );

function Countdown({ eventTime, interval }) {
  const [duration, setDuration] = useState(calculateDuration(eventTime));
  const timerRef = useRef(0);
  const timerCallback = useCallback(() => {
    setDuration(calculateDuration(eventTime));
  }, [eventTime]);

  useEffect(() => {
    timerRef.current = setInterval(timerCallback, interval);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [eventTime]);

  console.log();

  return (
    <div className="bg-green-200 rounded-xl px-2">
      {duration.days()} Days {duration.hours()} Hours {duration.minutes()}{" "}
      Minutes {duration.seconds()} Seconds
    </div>
  );
}

export default Countdown;
