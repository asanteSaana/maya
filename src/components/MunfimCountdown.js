import { useMemo } from "react";
import { useCountdown } from "../useCountdown";

const DAYS_AHEAD = 20;

/**
 * The target was built by string concatenation — "8 34 , 2026 00:00:00" —
 * adding 20 to the day of the month without rolling into the next one. Any day
 * after the 11th produced an out-of-range date, which parsed to Invalid Date
 * and rendered as "0NaN". Date arithmetic handles the rollover.
 */
const twoDigits = (value) => String(Math.max(0, value)).padStart(2, "0");

const MunfimCountdown = () => {
  const target = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + DAYS_AHEAD);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }, []);

  const [days, hours, minutes, seconds] = useCountdown(target);

  return (
    <ul className="count-down mt-35">
      <li>
        <span id="days">{twoDigits(days)}</span>days
      </li>
      <li>
        <span id="hours">{twoDigits(hours)}</span>Hours
      </li>
      <li>
        <span id="minutes">{twoDigits(minutes)}</span>Minutes
      </li>
      <li>
        <span id="seconds">{twoDigits(seconds)}</span>Seconds
      </li>
    </ul>
  );
};

export default MunfimCountdown;
