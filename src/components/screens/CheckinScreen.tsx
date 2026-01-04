import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Moon, Brain, Heart, Calendar, Sparkles } from 'lucide-react';
import type { CheckinData } from '@/hooks/useAppState';

interface CheckinScreenProps {
  data: CheckinData;
  onUpdate: (data: Partial<CheckinData>) => void;
  onComplete: () => void;
  onBack: () => void;
}

interface CheckinCard {
  key: keyof CheckinData;
  icon: typeof Moon;
  question: string;
  leftLabel: string;
  rightLabel: string;
  color: string;
}

const cards: CheckinCard[] = [
  {
    key: 'sleepConsistency',
    icon: Moon,
    question: 'How consistent was your sleep last night?',
    leftLabel: 'Poor',
    rightLabel: 'Excellent',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    key: 'stressLevel',
    icon: Brain,
    question: 'How overwhelmed did you feel today?',
    leftLabel: 'Very overwhelmed',
    rightLabel: 'Calm & in control',
    color: 'from-rose-400 to-orange-400',
  },
  {
    key: 'moodStability',
    icon: Heart,
    question: 'How emotionally stable did you feel today?',
    leftLabel: 'Unstable',
    rightLabel: 'Very stable',
    color: 'from-pink-400 to-rose-500',
  },
  {
    key: 'routineRegularity',
    icon: Calendar,
    question: 'How structured was your day today?',
    leftLabel: 'Very chaotic',
    rightLabel: 'Very structured',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    key: 'recoveryFeeling',
    icon: Sparkles,
    question: 'After rest or sleep, how refreshed did you feel?',
    leftLabel: 'Not refreshed',
    rightLabel: 'Fully refreshed',
    color: 'from-amber-400 to-yellow-500',
  },
];

export function CheckinScreen({ data, onUpdate, onComplete, onBack }: CheckinScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;
  const isFirstCard = currentIndex === 0;

  const handleNext = () => {
    if (isLastCard) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (isFirstCard) {
      onBack();
    } else {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSliderChange = (value: number) => {
    onUpdate({ [currentCard.key]: value });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen gradient-calm flex flex-col px-6 py-8">
      {/* Progress bar */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Daily Check-in</span>
          <span className="text-sm font-medium text-foreground">
            {currentIndex + 1} of {cards.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Card container */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-sm"
          >
            <div className="bg-card rounded-3xl p-6 shadow-elevated border border-border/50">
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentCard.color} flex items-center justify-center mb-6 shadow-card`}
              >
                <currentCard.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold text-foreground mb-8 leading-relaxed">
                {currentCard.question}
              </h2>

              {/* Slider */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data[currentCard.key]}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{currentCard.leftLabel}</span>
                  <span className="text-xs text-muted-foreground">{currentCard.rightLabel}</span>
                </div>
              </div>

              {/* Current value indicator */}
              <div className="text-center">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {data[currentCard.key]}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrev}
          className="flex-1"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="flex-1"
        >
          {isLastCard ? 'Continue' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary w-6'
                : index < currentIndex
                ? 'bg-primary/50'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
