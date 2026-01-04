import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, BookOpen, Briefcase, Plane, Heart, Users, Circle } from 'lucide-react';
import type { ContextData } from '@/hooks/useAppState';

interface ContextScreenProps {
  data: ContextData;
  onUpdate: (data: Partial<ContextData>) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

const influences = [
  { id: 'exams', label: 'Exams', icon: BookOpen },
  { id: 'deadlines', label: 'Deadlines', icon: Briefcase },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'none', label: 'None', icon: Circle },
];

export function ContextScreen({ data, onUpdate, onAnalyze, onBack }: ContextScreenProps) {
  const toggleInfluence = (id: string) => {
    const current = data.influences;
    if (id === 'none') {
      onUpdate({ influences: current.includes('none') ? [] : ['none'] });
    } else {
      const filtered = current.filter((i) => i !== 'none');
      if (current.includes(id)) {
        onUpdate({ influences: filtered.filter((i) => i !== id) });
      } else {
        onUpdate({ influences: [...filtered, id] });
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen gradient-calm flex flex-col px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          What influenced your week?
        </h1>
        <p className="text-muted-foreground">
          This helps us explain changes better.
        </p>
      </motion.div>

      {/* Influence chips */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {influences.map((influence, index) => {
          const isSelected = data.influences.includes(influence.id);
          return (
            <motion.button
              key={influence.id}
              onClick={() => toggleInfluence(influence.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-card'
                  : 'bg-card text-foreground border-border/50 hover:border-primary/30'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <influence.icon className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
              <span className="font-medium">{influence.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Optional text input */}
      <motion.div
        className="flex-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Textarea
          placeholder="Anything else you'd like to add? (optional)"
          value={data.additionalNotes}
          onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
          className="min-h-[120px] bg-card border-border/50 rounded-2xl resize-none text-foreground placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-3 text-center">
          This helps explain your results. It is not used for diagnosis.
        </p>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex-1"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onAnalyze}
          className="flex-1"
        >
          Analyze My Risk
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
