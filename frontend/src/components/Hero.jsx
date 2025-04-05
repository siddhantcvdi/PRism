import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import Spline from "@splinetool/react-spline";
import LandingButton from "./LandingButton";

const COLORS_TOP = ["#000000"];

export const Hero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`linear-gradient(
    to bottom,
    #131420 85%,
    ${color}
  )`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      {/* Gradient Base Layer */}
      <div className="absolute inset-0 z-0" />

      {/* Stars Layer */}
      <div className="absolute inset-0 z-10">
        <Canvas style={{ pointerEvents: "none" }}>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      {/* Interactive Spline Layer */}
      <div className="absolute inset-0 z-20">
        <Spline
          scene="https://prod.spline.design/86NZRtMNlehBruiu/scene.splinecode"
          className="w-full h-full opacity-100"
        />
      </div>

      {/* Content Layer - Interactive elements on top */}
      <div className="relative z-30 flex flex-col items-center pointer-events-none">
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight pointer-events-auto">
          <span className={`poppins-thin`}>
            See your <span className="poppins-semibold">Pull Requests</span> in{" "}
            <span className={`poppins-semibold`}>New Light</span>
          </span>
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed pointer-events-auto">
          Instant AI summaries and actionable insights—free for developers.
        </p>
        <div className="pointer-events-auto">
          <LandingButton />
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
