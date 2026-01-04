import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Info, ChevronRight } from 'lucide-react';

interface ConsentScreenProps {
  onConsent: () => void;
  onBack: () => void;
}

export function ConsentScreen({ onConsent, onBack }: ConsentScreenProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <motion.div
      className="min-h-screen gradient-calm flex flex-col px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="self-start text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-1 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ← Back
      </motion.button>

      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Before We Begin
        </h1>
        <p className="text-muted-foreground">
          Please read and understand the following
        </p>
      </motion.div>

      {/* Disclaimer cards */}
      <motion.div
        className="flex-1 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Not a Medical Tool</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This app does not provide medical diagnosis. It is designed to help you notice patterns in your daily wellbeing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Pattern Recognition Only</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It shows trends and risk patterns based on self-reported data. Results are for awareness, not treatment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-2xl p-5 border border-border/30">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All your data stays on your device. We don't collect, store, or share any personal information.
          </p>
        </div>
      </motion.div>

      {/* Agreement checkbox */}
      <motion.div
        className="mt-8 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            className="w-5 h-5"
          />
          <span className="text-sm text-foreground">
            I understand and agree to these terms
          </span>
        </label>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="primary"
          size="xl"
          onClick={onConsent}
          disabled={!agreed}
          className="w-full"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
