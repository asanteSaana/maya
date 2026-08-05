import { useEffect, useState } from "react";

const useMunfirmSlider = () => {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      // 2 => total slider item
      setActive((prevState) => (prevState === 2 ? 1 : prevState + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { active, setActive };
};

export default useMunfirmSlider;
