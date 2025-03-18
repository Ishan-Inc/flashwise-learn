
import { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// Types
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: string;
  nextReviewDate: string;
}

export interface FlashcardInput {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

interface FlashcardStats {
  totalCards: number;
  reviewedToday: number;
  dueToday: number;
}

interface FlashcardContextType {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  stats: FlashcardStats;
  createFlashcard: (flashcard: FlashcardInput) => Promise<void>;
  updateFlashcard: (flashcard: Flashcard) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  reviewFlashcard: (id: string, difficulty: "easy" | "medium" | "hard") => Promise<void>;
}

// Create context
const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

// Helper function to get spaced repetition days based on difficulty
const getNextReviewDays = (difficulty: "easy" | "medium" | "hard"): number => {
  switch (difficulty) {
    case "easy":
      return 7; // Review in 7 days
    case "medium":
      return 3; // Review in 3 days
    case "hard":
      return 1; // Review tomorrow
    default:
      return 3;
  }
};

// Check if a date is today
const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Provider component
export const FlashcardProvider = ({ children }: { children: React.ReactNode }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load flashcards from localStorage on initial render
  useEffect(() => {
    try {
      const savedFlashcards = localStorage.getItem("flashcards");
      if (savedFlashcards) {
        setFlashcards(JSON.parse(savedFlashcards));
      } else {
        // Add sample flashcards for new users
        const sampleFlashcards: Flashcard[] = [
          {
            id: uuidv4(),
            question: "What is the capital of France?",
            answer: "Paris",
            difficulty: "easy",
            lastReviewed: new Date().toISOString(),
            nextReviewDate: addDays(new Date(), getNextReviewDays("easy")).toISOString(),
          },
          {
            id: uuidv4(),
            question: "What is 2 + 2?",
            answer: "4",
            difficulty: "easy",
            lastReviewed: new Date().toISOString(),
            nextReviewDate: addDays(new Date(), getNextReviewDays("easy")).toISOString(),
          },
          {
            id: uuidv4(),
            question: "What's the formula for area of a circle?",
            answer: "πr²",
            difficulty: "medium",
            lastReviewed: new Date().toISOString(),
            nextReviewDate: addDays(new Date(), getNextReviewDays("medium")).toISOString(),
          },
        ];
        
        setFlashcards(sampleFlashcards);
        localStorage.setItem("flashcards", JSON.stringify(sampleFlashcards));
      }
    } catch (err) {
      setError("Failed to load flashcards");
      console.error("Error loading flashcards:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update localStorage whenever flashcards change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("flashcards", JSON.stringify(flashcards));
    }
  }, [flashcards, isLoading]);
  
  // Calculate statistics
  const stats: FlashcardStats = {
    totalCards: flashcards.length,
    reviewedToday: flashcards.filter(card => isToday(card.lastReviewed)).length,
    dueToday: flashcards.filter(card => {
      if (!card.nextReviewDate) return false;
      const nextReview = new Date(card.nextReviewDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return nextReview <= today;
    }).length,
  };
  
  // Create a new flashcard
  const createFlashcard = async (flashcardInput: FlashcardInput): Promise<void> => {
    try {
      const newFlashcard: Flashcard = {
        id: uuidv4(),
        ...flashcardInput,
        lastReviewed: new Date().toISOString(),
        nextReviewDate: addDays(new Date(), getNextReviewDays(flashcardInput.difficulty)).toISOString(),
      };
      
      setFlashcards(prev => [...prev, newFlashcard]);
      
      toast({
        title: "Flashcard Created",
        description: "Your new flashcard has been created successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create flashcard.",
      });
      throw err;
    }
  };
  
  // Update an existing flashcard
  const updateFlashcard = async (updatedFlashcard: Flashcard): Promise<void> => {
    try {
      setFlashcards(prev =>
        prev.map(card =>
          card.id === updatedFlashcard.id
            ? {
                ...updatedFlashcard,
                // Only update nextReviewDate if the difficulty changed
                nextReviewDate:
                  card.difficulty !== updatedFlashcard.difficulty
                    ? addDays(new Date(), getNextReviewDays(updatedFlashcard.difficulty)).toISOString()
                    : updatedFlashcard.nextReviewDate,
              }
            : card
        )
      );
      
      toast({
        title: "Flashcard Updated",
        description: "Your flashcard has been updated successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update flashcard.",
      });
      throw err;
    }
  };
  
  // Delete a flashcard
  const deleteFlashcard = async (id: string): Promise<void> => {
    try {
      setFlashcards(prev => prev.filter(card => card.id !== id));
      
      toast({
        title: "Flashcard Deleted",
        description: "Your flashcard has been deleted.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete flashcard.",
      });
      throw err;
    }
  };
  
  // Review a flashcard and update its next review date
  const reviewFlashcard = async (
    id: string,
    difficulty: "easy" | "medium" | "hard"
  ): Promise<void> => {
    try {
      const now = new Date();
      const nextReviewDate = addDays(now, getNextReviewDays(difficulty));
      
      setFlashcards(prev =>
        prev.map(card =>
          card.id === id
            ? {
                ...card,
                difficulty,
                lastReviewed: now.toISOString(),
                nextReviewDate: nextReviewDate.toISOString(),
              }
            : card
        )
      );
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review status.",
      });
      throw err;
    }
  };
  
  const value: FlashcardContextType = {
    flashcards,
    isLoading,
    error,
    stats,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
  };
  
  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};

// Hook for using the flashcard context
export const useFlashcards = (): FlashcardContextType => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};
