import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Activity, Heart, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <motion.div
      className="min-h-screen gradient-calm flex flex-col items-center justify-center px-6 py-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Auth button */}
      <div className="absolute top-4 right-4">
        {user ? (
          <Button
            variant="subtle"
            size="sm"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            variant="subtle"
            size="sm"
            onClick={() => navigate('/auth')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl"
        animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-8 w-32 h-32 rounded-full bg-accent/10 blur-3xl"
        animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo / Icon */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <div className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center shadow-elevated">
          <Shield className="w-12 h-12 text-primary-foreground" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-card"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity className="w-4 h-4 text-accent-foreground" />
        </motion.div>
      </motion.div>

      {/* App Name */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        SilentRisk
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground text-center max-w-sm mb-12 text-balance leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Understand patterns before they become problems.
      </motion.p>

      {/* Features preview */}
      <motion.div
        className="flex gap-8 mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[
          { icon: Activity, label: "Track" },
          { icon: Heart, label: "Understand" },
          { icon: Shield, label: "Prevent" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-card shadow-soft flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Button
          variant="primary"
          size="xl"
          onClick={onGetStarted}
          className="min-w-[200px]"
        >
          Get Started
        </Button>
      </motion.div>

      {/* Bottom text */}
      <motion.p
        className="absolute bottom-8 text-xs text-muted-foreground/60 text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        2-minute daily check-ins • No medical diagnosis
      </motion.p>
    </motion.div>
  );
}
