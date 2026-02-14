import React, { useRef, useEffect, useState } from "react";

// ----------------------------------------------
// 1. The CountUp Component
// ----------------------------------------------
const CountUp = ({
  target,
  label,
  duration = 1500,
  numberClassName = "",
  labelClassName = "",
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const animationFrameId = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startAnimation = () => {
    if (animationFrameId.current) {
      window.cancelAnimationFrame(animationFrameId.current);
    }
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const currentValue = Math.floor(percentage * target);
      setCount(currentValue);
      if (percentage < 1) {
        animationFrameId.current = window.requestAnimationFrame(animate);
      } else {
        setCount(target);
        setHasAnimated(true);
        animationFrameId.current = null;
      }
    };
    animationFrameId.current = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimation();
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countRef.current) observer.observe(countRef.current);

    return () => {
      if (countRef.current) observer.unobserve(countRef.current);
      if (animationFrameId.current)
        window.cancelAnimationFrame(animationFrameId.current);
    };
  }, [target, duration]);

  return (
    <div ref={countRef} className="group flex flex-col items-center p-4">
      <div
        className={`text-6xl font-extrabold text-[#00334E] leading-none mb-2 transition-transform duration-300 group-hover:scale-105 ${numberClassName}`}
      >
        {count.toLocaleString()}
        {target > 0 && "+"}
      </div>

      <div
        className={`text-lg md:text-xl font-medium text-gray-700 uppercase tracking-wide transition-all duration-300 ${labelClassName}`}
      >
        {label}
      </div>
    </div>
  );
};

// ----------------------------------------------
// 2. The Counter Section Component
// ----------------------------------------------
function CounterSection() {
  return (
    <section className="bg-white flex flex-col justify-start items-center py-12 md:pt-20 px-6 md:px-12">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold md:text-4xl text-green-700 mb-8 text-center">
        Our Achievements
      </h1>

      {/* Counters */}
      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-10 md:gap-28 max-w-4xl">
        <CountUp target={1000} label="Happy Customers" />
        <CountUp target={600} label="Products" />
        <CountUp target={500} label="Happy Partners" />
      </div>
    </section>
  );
}

export default CounterSection;
