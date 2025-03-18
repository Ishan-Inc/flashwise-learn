
import { useState } from "react";
import { Card } from "@/components/ui/card";
import FlashcardCard from "./FlashcardCard";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Plus, Loader2 } from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: string;
  nextReviewDate: string;
}

interface FlashcardGridProps {
  searchQuery?: string;
  filterBy?: "all" | "recent" | "due";
}

const FlashcardGrid = ({ searchQuery = "", filterBy = "all" }: FlashcardGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { flashcards, isLoading, error } = useFlashcards();
  const isMobile = useIsMobile();

  // Filter flashcards based on search query and filterBy
  const filteredFlashcards = flashcards.filter(card => {
    // Apply search filter
    const matchesSearch = 
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Apply tab filter
    if (filterBy === "all") return true;
    
    const today = new Date().toISOString().split('T')[0];
    
    if (filterBy === "due") {
      return card.nextReviewDate <= today;
    }
    
    if (filterBy === "recent") {
      // Show cards created or reviewed in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const lastReviewedDate = new Date(card.lastReviewed);
      return lastReviewedDate >= sevenDaysAgo;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-2">Failed to load flashcards</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 glass-card h-64">
        <h3 className="text-xl font-medium mb-2">No flashcards yet</h3>
        <p className="text-muted-foreground mb-6 text-center">
          Create your first flashcard to start learning
        </p>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Flashcard
          </Button>
        </DialogTrigger>
      </Card>
    );
  }

  if (filteredFlashcards.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">
            {searchQuery ? "Search Results" : filterBy === "due" ? "Due Today" : filterBy === "recent" ? "Recent Cards" : "My Flashcards"}
          </h2>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="flex flex-col items-center justify-center p-8 glass-card h-64">
          <h3 className="text-xl font-medium mb-2">No matching flashcards</h3>
          <p className="text-muted-foreground mb-6 text-center">
            {searchQuery 
              ? "Try adjusting your search query" 
              : filterBy === "due" 
                ? "No cards due for review today" 
                : "No cards in this category"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-0 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">
          {searchQuery 
            ? "Search Results" 
            : filterBy === "due" 
              ? "Due Today" 
              : filterBy === "recent" 
                ? "Recent Cards" 
                : "My Flashcards"}
          <span className="text-muted-foreground text-sm ml-2">
            ({filteredFlashcards.length})
          </span>
        </h2>
        {!isMobile && (
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
            : "space-y-4"
        }
      >
        {filteredFlashcards.map((flashcard) => (
          <FlashcardCard 
            key={flashcard.id} 
            flashcard={flashcard} 
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardGrid;
