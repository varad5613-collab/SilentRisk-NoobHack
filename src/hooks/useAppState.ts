import { useState, useCallback } from 'react';

export type AppScreen = 'splash' | 'consent' | 'checkin' | 'context' | 'results';

export interface CheckinData {
  sleepConsistency: number;
  stressLevel: number;
  moodStability: number;
  routineRegularity: number;
  recoveryFeeling: number;
}

export interface ContextData {
  influences: string[];
  additionalNotes: string;
}

export interface FeedbackData {
  accuracy: 'yes' | 'somewhat' | 'no' | null;
}

export interface AppState {
  currentScreen: AppScreen;
  checkinData: CheckinData;
  contextData: ContextData;
  feedbackData: FeedbackData;
  hasConsented: boolean;
}

const initialState: AppState = {
  currentScreen: 'splash',
  checkinData: {
    sleepConsistency: 50,
    stressLevel: 50,
    moodStability: 50,
    routineRegularity: 50,
    recoveryFeeling: 50,
  },
  contextData: {
    influences: [],
    additionalNotes: '',
  },
  feedbackData: {
    accuracy: null,
  },
  hasConsented: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('silentrisk-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  const saveState = useCallback((newState: AppState) => {
    localStorage.setItem('silentrisk-state', JSON.stringify(newState));
    setState(newState);
  }, []);

  const setScreen = useCallback((screen: AppScreen) => {
    saveState({ ...state, currentScreen: screen });
  }, [state, saveState]);

  const setCheckinData = useCallback((data: Partial<CheckinData>) => {
    saveState({
      ...state,
      checkinData: { ...state.checkinData, ...data },
    });
  }, [state, saveState]);

  const setContextData = useCallback((data: Partial<ContextData>) => {
    saveState({
      ...state,
      contextData: { ...state.contextData, ...data },
    });
  }, [state, saveState]);

  const setFeedback = useCallback((accuracy: 'yes' | 'somewhat' | 'no') => {
    saveState({
      ...state,
      feedbackData: { accuracy },
    });
  }, [state, saveState]);

  const setConsent = useCallback((hasConsented: boolean) => {
    saveState({ ...state, hasConsented });
  }, [state, saveState]);

  const resetState = useCallback(() => {
    localStorage.removeItem('silentrisk-state');
    setState(initialState);
  }, []);

  return {
    state,
    setScreen,
    setCheckinData,
    setContextData,
    setFeedback,
    setConsent,
    resetState,
  };
}
