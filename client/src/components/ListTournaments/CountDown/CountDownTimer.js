import useCountDown from "./useCountDown";

const ExpiredNotice = () => {
  return console.log("expired");
};

const ShowCounter = ({ days, hours, minutes, seconds, isFuture }) => {
  return (
    <div className="show-counter">
      <div
        className={
          isFuture
            ? "bg-red-200 rounded-xl px-2"
            : "bg-green-200 rounded-xl px-2"
        }
      >
        {isFuture ? (
          <div>
            <b>Starts</b> in {days} Days {hours} Hours {minutes} Minutes{" "}
            {seconds} Seconds
          </div>
        ) : (
          <div>
            <b>Closes</b> in {days} Days {hours} Hours {minutes} Minutes{" "}
            {seconds} Seconds
          </div>
        )}
      </div>
    </div>
  );
};

const CountDownTimer = ({ targetDate, isFuture }) => {
  const [days, hours, minutes, seconds] = useCountDown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        isFuture={isFuture}
      />
    );
  }
};

export default CountDownTimer;

{
  /* <div className="bg-green-200 rounded-xl px-2 "> */
}
