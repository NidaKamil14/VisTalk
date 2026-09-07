/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from "react";
import { useAuth } from "./AuthContext";
import {
  CATEGORIES,
  getItemsByCategory,
  getTotalCount,
} from "../data/learningData";

const ProgressContext = createContext(null);

const STORAGE_PROGRESS_PREFIX = "vistalk_progress_";

const DEFAULT_PROGRESS = {
  alphabets: [],
  numbers: [],
  words: [],
  phrases: [],
  history: [],
  streakDays: 1,
  lastActivityDate: new Date().toISOString().split("T")[0],
};

function loadStoredProgress(key, user) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // If user logged in and has no progress, check if guest has progress to adopt
    if (user) {
      const guestStored = localStorage.getItem(`${STORAGE_PROGRESS_PREFIX}guest`);
      if (guestStored) {
        const guestData = JSON.parse(guestStored);
        localStorage.setItem(key, JSON.stringify(guestData));
        return guestData;
      }
    }
    return DEFAULT_PROGRESS;
  } catch (err) {
    console.error("Error reading progress:", err);
    return DEFAULT_PROGRESS;
  }
}

export function ProgressProvider({ children }) {
  const { currentUser } = useAuth();
  const storageKey = useMemo(() => {
    return `${STORAGE_PROGRESS_PREFIX}${currentUser ? currentUser.id : "guest"}`;
  }, [currentUser]);

  const [activeKey, setActiveKey] = useState(storageKey);
  const [progress, setProgress] = useState(() =>
    loadStoredProgress(storageKey, currentUser)
  );

  // Transient XP celebration state for UI micro-animations
  const [xpCelebration, setXpCelebration] = useState(null);

  // Sync state if user logs in or out
  if (activeKey !== storageKey) {
    setActiveKey(storageKey);
    setProgress(loadStoredProgress(storageKey, currentUser));
  }

  // Persist progress changes
  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
    } catch (err) {
      console.error("Error persisting learning progress:", err);
    }
  };

  const isLearned = (category, itemId) => {
    const list = progress[category] || [];
    const normalizedId = String(itemId).toLowerCase();
    return list.some((item) => String(item).toLowerCase() === normalizedId);
  };

  // Check if a roadmap level is unlocked (First is unlocked, or previous is mastered)
  const isUnlocked = (category, itemId) => {
    const items = getItemsByCategory(category);
    const index = items.findIndex(
      (it) => String(it.id).toLowerCase() === String(itemId).toLowerCase()
    );
    if (index <= 0) return true; // First item always unlocked
    const prevItem = items[index - 1];
    return isLearned(category, prevItem.id) || isLearned(category, itemId);
  };

  // Trigger temporary celebration
  const triggerCelebration = (amount = 10, label = "") => {
    setXpCelebration({ amount, label });
    setTimeout(() => {
      setXpCelebration(null);
    }, 2800);
  };

  // Explicitly master a sign (used by Practice & Lesson complete flows)
  const masterSign = (category, itemId, title = "") => {
    const list = progress[category] || [];
    const normalizedId = String(itemId);
    const alreadyMastered = isLearned(category, itemId);

    if (alreadyMastered) {
      return { newlyMastered: false, xpEarned: 0 };
    }

    const today = new Date().toISOString().split("T")[0];
    const updatedList = [...list, normalizedId];
    const updatedHistory = [
      {
        id: normalizedId,
        category,
        learnedAt: new Date().toISOString(),
      },
      ...(progress.history || []),
    ];

    let currentStreak = progress.streakDays || 1;
    if (progress.lastActivityDate !== today) {
      currentStreak += 1;
    }

    const updated = {
      ...progress,
      [category]: updatedList,
      history: updatedHistory.slice(0, 50),
      streakDays: currentStreak,
      lastActivityDate: today,
    };

    saveProgress(updated);
    triggerCelebration(10, title || normalizedId);
    return { newlyMastered: true, xpEarned: 10 };
  };

  const toggleLearned = (category, itemId, title = "") => {
    const list = progress[category] || [];
    const normalizedId = String(itemId);
    const exists = isLearned(category, itemId);
    const today = new Date().toISOString().split("T")[0];

    let updatedList;
    let updatedHistory = [...(progress.history || [])];

    if (exists) {
      updatedList = list.filter(
        (id) => String(id).toLowerCase() !== normalizedId.toLowerCase()
      );
      updatedHistory = updatedHistory.filter(
        (entry) =>
          !(
            entry.category === category &&
            String(entry.id).toLowerCase() === normalizedId.toLowerCase()
          )
      );
    } else {
      updatedList = [...list, normalizedId];
      updatedHistory.unshift({
        id: normalizedId,
        category,
        learnedAt: new Date().toISOString(),
      });
      triggerCelebration(10, title || normalizedId);
    }

    let currentStreak = progress.streakDays || 1;
    if (progress.lastActivityDate !== today) {
      currentStreak += 1;
    }

    const updated = {
      ...progress,
      [category]: updatedList,
      history: updatedHistory.slice(0, 50),
      streakDays: currentStreak,
      lastActivityDate: today,
    };

    saveProgress(updated);
    return !exists;
  };

  const getCategoryProgress = (categoryId) => {
    const items = getItemsByCategory(categoryId);
    const total = items.length || 1;
    const learnedList = progress[categoryId] || [];
    const count = learnedList.length;
    const percentage = Math.min(100, Math.round((count / total) * 100));

    return {
      count,
      total,
      percentage,
    };
  };

  const getOverallProgress = () => {
    const total = getTotalCount() || 1;
    const count =
      (progress.alphabets?.length || 0) +
      (progress.numbers?.length || 0) +
      (progress.words?.length || 0) +
      (progress.phrases?.length || 0);
    const percentage = Math.min(100, Math.round((count / total) * 100));

    return {
      count,
      total,
      percentage,
      xp: count * 10, // Strictly 10 XP per unique mastered sign
    };
  };

  const getStats = () => {
    const overall = getOverallProgress();
    const categoryStats = CATEGORIES.map((cat) => ({
      ...cat,
      ...getCategoryProgress(cat.id),
    }));

    return {
      overall,
      categoryStats,
      xp: overall.xp,
      streakDays: progress.streakDays || 1,
      recentHistory: progress.history || [],
      lastActivityDate: progress.lastActivityDate,
    };
  };

  const resetProgress = () => {
    const resetState = {
      ...DEFAULT_PROGRESS,
      lastActivityDate: new Date().toISOString().split("T")[0],
    };
    saveProgress(resetState);
  };

  const value = {
    progress,
    xpCelebration,
    isLearned,
    isUnlocked,
    masterSign,
    toggleLearned,
    getCategoryProgress,
    getOverallProgress,
    getStats,
    resetProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
