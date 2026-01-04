import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import { RefreshCw, TrendingUp, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import type { CheckinData, ContextData, FeedbackData } from '@/hooks/useAppState';

interface ResultsScreenProps {
  checkinData: CheckinData;
  contextData: ContextData;
  feedbackData: FeedbackData;
  onFeedback: (accuracy: 'yes' | 'somewhat' | 'no') => void;
  onStartOver: () => void;
}

function calculateRiskLevel(data: CheckinData) {
  // Simple weighted calculation for demo
  const weights = {
    sleepConsistency: 0.25,
    stressLevel: 0.25,
    moodStability: 0.2,
    routineRegularity: 0.15,
    recoveryFeeling: 0.15,
  };

  // Invert stress (low = bad) but keep others as-is
  const normalizedStress = 100 - data.stressLevel; // Flip because low value = overwhelmed
  const score =
    data.sleepConsistency * weights.sleepConsistency +
    normalizedStress * weights.stressLevel +
    data.moodStability * weights.moodStability +
    data.routineRegularity * weights.routineRegularity +
    data.recoveryFeeling * weights.recoveryFeeling;

  // Higher score = better = lower risk
  const riskScore = 100 - score;

  if (riskScore < 35) return { level: 'Low', color: 'risk-low', score: riskScore };
  if (riskScore < 60) return { level: 'Medium', color: 'risk-medium', score: riskScore };
  return { level: 'High', color: 'risk-high', score: riskScore };
}

function calculateContributors(data: CheckinData, contextData: ContextData) {
  const contributors = [];
  
  if (data.sleepConsistency < 50) {
    contributors.push({ name: 'Sleep inconsistency', value: Math.round((50 - data.sleepConsistency) * 0.8) });
  }
  if (data.stressLevel > 50) {
    contributors.push({ name: 'Elevated stress', value: Math.round((data.stressLevel - 50) * 0.8) });
  }
  if (data.routineRegularity < 50) {
    contributors.push({ name: 'Routine disruption', value: Math.round((50 - data.routineRegularity) * 0.6) });
  }
  if (contextData.influences.length > 0 && !contextData.influences.includes('none')) {
    contributors.push({ name: 'Context factors', value: contextData.influences.length * 8 });
  }
  if (data.moodStability < 50) {
    contributors.push({ name: 'Mood fluctuations', value: Math.round((50 - data.moodStability) * 0.5) });
  }
  if (data.recoveryFeeling < 50) {
    contributors.push({ name: 'Poor recovery', value: Math.round((50 - data.recoveryFeeling) * 0.5) });
  }

  // Normalize to percentages
  const total = contributors.reduce((sum, c) => sum + c.value, 0) || 1;
  return contributors.map(c => ({ ...c, value: Math.round((c.value / total) * 100) })).slice(0, 4);
}

export function ResultsScreen({
  checkinData,
  contextData,
  feedbackData,
  onFeedback,
  onStartOver,
}: ResultsScreenProps) {
  const risk = calculateRiskLevel(checkinData);
  const contributors = calculateContributors(checkinData, contextData);
  const confidence = 68 + Math.floor(Math.random() * 15);

  // Mock trend data
  const trendData = [
    { day: 'Mon', stress: 45, sleep: 65 },
    { day: 'Tue', stress: 52, sleep: 58 },
    { day: 'Wed', stress: 48, sleep: 62 },
    { day: 'Thu', stress: 60, sleep: 55 },
    { day: 'Fri', stress: 55, sleep: 60 },
    { day: 'Sat', stress: 40, sleep: 70 },
    { day: 'Today', stress: 100 - checkinData.stressLevel, sleep: checkinData.sleepConsistency },
  ];

  // Radar chart data
  const radarData = [
    { subject: 'Sleep', value: checkinData.sleepConsistency, fullMark: 100 },
    { subject: 'Stress', value: checkinData.stressLevel, fullMark: 100 },
    { subject: 'Mood', value: checkinData.moodStability, fullMark: 100 },
    { subject: 'Routine', value: checkinData.routineRegularity, fullMark: 100 },
    { subject: 'Recovery', value: checkinData.recoveryFeeling, fullMark: 100 },
  ];

  const projectedRisk = risk.level === 'Low' ? 'Medium' : risk.level === 'Medium' ? 'High' : 'High';

  return (
    <motion.div
      className="min-h-screen gradient-calm px-6 py-8 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Your Weekly Risk Summary
        </h1>
        <p className="text-muted-foreground text-sm">
          Based on today's check-in
        </p>
      </motion.div>

      {/* Risk Indicator */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-elevated border border-border/50 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                className={`text-${risk.color}`}
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${(risk.score / 100) * 440} 440` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold text-${risk.color}`}>{risk.level}</span>
              <span className="text-sm text-muted-foreground">{confidence}% confidence</span>
            </div>
          </div>
        </div>

        <div className={`text-center py-3 px-4 rounded-xl bg-${risk.color}/10`}>
          {risk.level === 'Low' && (
            <div className="flex items-center justify-center gap-2 text-risk-low">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Looking good! Keep up the healthy habits.</span>
            </div>
          )}
          {risk.level === 'Medium' && (
            <div className="flex items-center justify-center gap-2 text-risk-medium">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Some areas need attention.</span>
            </div>
          )}
          {risk.level === 'High' && (
            <div className="flex items-center justify-center gap-2 text-risk-high">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Consider taking extra care of yourself.</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Primary Contributors */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-foreground mb-4">Primary Contributors</h2>
        <div className="space-y-3">
          {contributors.length > 0 ? (
            contributors.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-foreground">{contributor.name}</span>
                    <span className="text-sm font-medium text-muted-foreground">{contributor.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${contributor.value}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm text-center py-4">
              Great news! No significant risk factors detected.
            </p>
          )}
        </div>
      </motion.div>

      {/* Stress Trend */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Stress Trend Over Time</h2>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis hide domain={[0, 100]} />
              <Area
                type="monotone"
                dataKey="stress"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#stressGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          This is where today fits in your trend.
        </p>
      </motion.div>

      {/* Behavior Balance Radar */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-semibold text-foreground mb-4 text-center">Behavior Balance</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <PolarRadiusAxis hide domain={[0, 100]} />
              <Radar
                name="Today"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Simulated Trend Preview */}
      <motion.div
        className="bg-secondary/50 rounded-3xl p-6 border border-border/30 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-semibold text-foreground mb-2">What if this continues?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Based on today's inputs, if similar patterns continue for 7 days:
        </p>
        <div className="flex items-center gap-3 p-4 bg-card rounded-xl">
          <span className={`text-${risk.color} font-bold`}>{risk.level}</span>
          <span className="text-muted-foreground">→</span>
          <span className={`text-${projectedRisk === 'High' ? 'risk-high' : 'risk-medium'} font-bold`}>
            {projectedRisk}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          Projection, not diagnosis.
        </p>
      </motion.div>

      {/* User Feedback */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-card border border-border/50 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Does this feel accurate?</h2>
        </div>
        <div className="flex gap-3">
          {(['yes', 'somewhat', 'no'] as const).map((option) => (
            <Button
              key={option}
              variant={feedbackData.accuracy === option ? 'primary' : 'outline'}
              size="lg"
              onClick={() => onFeedback(option)}
              className="flex-1 capitalize"
            >
              {option}
            </Button>
          ))}
        </div>
        {feedbackData.accuracy && (
          <motion.p
            className="text-sm text-muted-foreground text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Thanks for your feedback! This helps improve future insights.
          </motion.p>
        )}
      </motion.div>

      {/* Ethical Disclaimer */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          SilentRisk is not a medical tool.<br />
          If concerns persist, consider professional help.
        </p>
      </motion.div>

      {/* Start Over */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          variant="subtle"
          size="lg"
          onClick={onStartOver}
          className="w-full"
        >
          <RefreshCw className="w-5 h-5" />
          Start New Check-in
        </Button>
      </motion.div>
    </motion.div>
  );
}
