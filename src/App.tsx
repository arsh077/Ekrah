/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Star, Moon, Sun } from 'lucide-react';

export default function App() {
  const [level, setLevel] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#050505] py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Floating particles */}
      <Particles />

      <div className="z-10 text-center px-4 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {level === 0 && <Intro key="intro" onNext={() => setLevel(1)} />}
          {level === 1 && <Game1Stars key="g1" onNext={() => setLevel(2)} />}
          {level === 2 && <Game2Memory key="g2" onNext={() => setLevel(3)} />}
          {level === 3 && <Game3Light key="g3" onNext={() => setLevel(4)} />}
          {level === 4 && <FinalReveal key="reveal" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Intro({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center h-[60vh] glass-panel rounded-3xl p-12 max-w-xl mx-auto"
    >
      <Sparkles className="w-8 h-8 text-amber-400 mb-6" />
      <h2 className="font-serif text-3xl md:text-4xl text-amber-100 mb-4">A Special Journey</h2>
      <p className="font-sans text-amber-200/60 mb-10 leading-relaxed">
        Before the grand reveal, complete three small celestial steps to unlock your surprise.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-8 py-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 font-sans text-sm uppercase tracking-widest hover:bg-amber-500/20 transition-colors cursor-pointer"
      >
        Begin Journey
      </motion.button>
    </motion.div>
  );
}

function Game1Stars({ onNext }: { onNext: () => void }) {
  const [caught, setCaught] = useState(0);
  const total = 5;
  const [positions] = useState(() => Array.from({ length: total }).map(() => ({
    x: Math.random() * 80 - 40,
    y: Math.random() * 80 - 40,
  })));
  const [clicked, setClicked] = useState<number[]>([]);

  useEffect(() => {
    if (caught === total) {
      setTimeout(onNext, 1500);
    }
  }, [caught, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      className="glass-panel p-8 md:p-12 rounded-3xl relative min-h-[400px] flex flex-col items-center justify-center w-full max-w-2xl mx-auto"
    >
      <h3 className="font-serif text-2xl text-amber-100 mb-2">Level 1: Gather the Starlight</h3>
      <p className="font-sans text-amber-200/60 mb-8">Catch {total} falling stars to proceed.</p>

      <div className="relative w-full h-64 border border-white/5 rounded-2xl bg-black/20 overflow-hidden">
        {positions.map((pos, i) => (
          <AnimatePresence key={i}>
            {!clicked.includes(i) && (
              <motion.button
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                onClick={() => {
                  setClicked(prev => [...prev, i]);
                  setCaught(c => c + 1);
                }}
                className="absolute text-amber-300 hover:text-amber-100 transition-colors cursor-pointer p-2"
                style={{ left: `calc(50% + ${pos.x}%)`, top: `calc(50% + ${pos.y}%)` }}
              >
                <Star className="w-8 h-8 fill-current animate-pulse" />
              </motion.button>
            )}
          </AnimatePresence>
        ))}
      </div>
      <div className="h-8 mt-6">
        {caught === total && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 font-serif text-lg">
            Starlight gathered!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

const CARD_TYPES = ['sun', 'moon', 'star'];
function Game2Memory({ onNext }: { onNext: () => void }) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  useEffect(() => {
    const shuffled = [...CARD_TYPES, ...CARD_TYPES].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
      } else {
        const timer = setTimeout(() => setFlipped([]), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === 6) {
      setTimeout(onNext, 1500);
    }
  }, [matched, onNext]);

  const handleCardClick = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped(prev => [...prev, index]);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'sun') return <Sun className="w-8 h-8" />;
    if (type === 'moon') return <Moon className="w-8 h-8" />;
    return <Star className="w-8 h-8" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center w-full max-w-2xl mx-auto"
    >
      <h3 className="font-serif text-2xl text-amber-100 mb-2">Level 2: Celestial Alignment</h3>
      <p className="font-sans text-amber-200/60 mb-8">Match the pairs of sky lights.</p>

      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {cards.map((type, i) => {
          const isRevealed = flipped.includes(i) || matched.includes(i);
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(i)}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                isRevealed
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 border-white/10 text-transparent hover:bg-white/10'
              }`}
            >
              {isRevealed ? getIcon(type) : <Sparkles className="w-6 h-6 text-white/20" />}
            </motion.button>
          );
        })}
      </div>
      <div className="h-8 mt-8">
        {matched.length === 6 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 font-serif text-lg">
            Perfect alignment!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function Game3Light({ onNext }: { onNext: () => void }) {
  const [clicks, setClicks] = useState(0);
  const required = 10;

  useEffect(() => {
    if (clicks >= required) {
      setTimeout(onNext, 1500);
    }
  }, [clicks, onNext]);

  const progress = Math.min(clicks / required, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center w-full max-w-2xl mx-auto"
    >
      <h3 className="font-serif text-2xl text-amber-100 mb-2">Level 3: Awaken the Magic</h3>
      <p className="font-sans text-amber-200/60 mb-12">Tap the heart to fill it with light and love.</p>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setClicks(c => c + 1)}
        className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full border-2 border-amber-500/30 overflow-hidden cursor-pointer group"
      >
        <div
          className="absolute bottom-0 left-0 right-0 bg-amber-500/40 transition-all duration-300 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
        <Heart
          className={`w-12 h-12 md:w-16 md:h-16 relative z-10 transition-colors duration-300 ${
            clicks >= required ? 'text-amber-200 fill-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'text-amber-500/50 group-hover:text-amber-400/80'
          }`}
        />
      </motion.button>

      <div className="mt-12 w-48 md:w-64 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 transition-all duration-300 ease-out" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="h-8 mt-6">
        {clicks >= required && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 font-serif text-lg">
            The magic is ready...
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function FinalReveal() {
  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, staggerChildren: 0.5 }}
      className="flex flex-col items-center justify-center py-12 glass-panel rounded-3xl p-6 md:p-16 relative w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-6 bg-[#050505] px-6 py-2 border border-amber-500/30 rounded-full flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="font-sans text-xs uppercase tracking-widest text-amber-200">A Special Day</span>
        <Sparkles className="w-4 h-4 text-amber-400" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 1 }}
        className="font-script text-6xl md:text-8xl lg:text-[9rem] gold-gradient leading-tight py-4 text-center"
      >
        Happy Birthday<br />Ekrah
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 3 }}
        className="mt-8 space-y-8 w-full"
      >
        <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="space-y-4">
          <p className="font-serif text-lg md:text-2xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed italic px-4">
            "On this special day, I want you to feel the happiest person in the world. I want you to get all the good sky lights, whether they come from the Moon, the Sun or other stars."
          </p>
        </div>

        <div className="pt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 font-sans text-sm uppercase tracking-widest hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            Play Again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Particles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-200/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -1000],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
