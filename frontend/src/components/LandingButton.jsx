import { useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { SignInButton } from "@clerk/clerk-react";

const LandingButton = () => {
  return <Button />;
};

const TARGET_TEXT = "Get Started";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const Button = () => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current);
    setText(TARGET_TEXT);
  };

  return (
    <SignInButton>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={scramble}
        onMouseLeave={stopScramble}
        className="group relative overflow-hidden rounded-xl border-2 border-[var(--primary)] bg-[var(--primary)] px-8 py-4 font-mono font-bold uppercase text-[var(--primary-content)] transition-all hover:bg-[var(--primary-dark)]">
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-lg tracking-wide">{text}</span>
          <FiArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>

        {/* Subtle hover glow */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-[var(--primary-light)/20] to-[var(--primary-dark)/20] opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </motion.button>
    </SignInButton>
  );
};

export default LandingButton;
