"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { formatINR, formatSignedINR } from "@/lib/format";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Currency figure that springs to its new value whenever it changes. */
export function AnimatedMoney({
  paise,
  signed = false,
}: {
  paise: number;
  signed?: boolean;
}) {
  const [display, setDisplay] = useState(paise);
  const previous = useRef(paise);

  useEffect(() => {
    const controls = animate(previous.current, paise, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    previous.current = paise;
    return () => controls.stop();
  }, [paise]);

  return (
    <span className="tnum">
      {signed ? formatSignedINR(display) : formatINR(display)}
    </span>
  );
}
