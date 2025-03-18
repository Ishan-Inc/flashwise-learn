
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, X, AlertTriangle } from "lucide-react";
import { useFlashcards, Flashcard } from "@/hooks/useFlashcards";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Study = () => {
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [studyComplete, setStudyComplete] = useState(false);
  const { flashcards, reviewFlashcard } = useFlashcards();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Prepare cards due for review
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueCards = flashcards.filter(card => {
      if (!card.nextReviewDate) return false;
      const nextReview = new Date(card.nextReviewDate);
      return nextReview <= today;
    });
    
    // If there are no due cards, include some random cards
    if (dueCards.length === 0 && flashcards.length > 0) {
      // Get random cards (up to 5)
      const randomCards = [...flashcards]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(5, flashcards.length));
      
      setStudyCards(randomCards);
      
      toast({
        title: "No cards due for review",
        description: "We've selected some random cards for you to practice with.",
      });
    } else {
      setStudyCards(dueCards);
    }
  }, [flashcards, toast]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Handle empty state
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
          <Card className="max-w-md w-full glass-card p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Flashcards to Study</h2>
            <p className="mb-6 text-muted-foreground">
              You don't have any flashcards yet. Create some first to start studying.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Handle study complete state
  if (studyComplete || studyCards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
          <Card className="max-w-md w-full glass-card p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Study Session Complete!</h2>
            <p className="mb-6 text-muted-foreground">
              Great job! You've reviewed all the cards scheduled for today.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setStudyComplete(false);
                  setCurrentIndex(0);
                  setFlipped(false);
                  
                  // If there are no more cards due, use random cards
                  if (studyCards.length === 0) {
                    const randomCards = [...flashcards]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, Math.min(5, flashcards.length));
                    
                    setStudyCards(randomCards);
                  }
                }} 
                className="w-full"
              >
                Study More Cards
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const currentCard = studyCards[currentIndex];
  const progress = ((currentIndex) / studyCards.length) * 100;
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleNext = () => {
    setFlipped(false);
    
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStudyComplete(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };
  
  const handleRate = async (difficulty: "easy" | "medium" | "hard") => {
    try {
      await reviewFlashcard(currentCard.id, difficulty);
      handleNext();
    } catch (error) {
      console.error("Failed to rate card:", error);
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Study Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Study Session</h1>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {studyCards.length}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                Exit
              </Button>
            </div>
            <Progress value={progress} className="h-2 mt-2" />
          </div>
          
          {/* Flashcard */}
          <div className="perspective mb-6">
            <Card
              className={`
                glass-card cursor-pointer min-h-[300px] sm:min-h-[400px] transition-all duration-300 preserve-3d 
                ${flipped ? "animate-flip" : "animate-flip-back"}
              `}
              onClick={handleFlip}
            >
              <div className="absolute inset-0 backface-hidden flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(currentCard.difficulty)}>
                      {currentCard.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Question
                    </span>
                  </div>
                  
                  <div className="flex-grow flex items-center justify-center p-4">
                    <h2 className="text-xl sm:text-2xl font-medium text-center">
                      {currentCard.question}
                    </h2>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Tap to reveal answer
                  </p>
                </CardContent>
              </div>
              
              <div className="absolute inset-0 backface-hidden rotateY-180 flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      Answer
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-grow flex items-center justify-center p-4">
                    <h2 className="text-xl sm:text-2xl font-medium text-center">
                      {currentCard.answer}
                    </h2>
                  </div>
                  
                  <div className="text-sm text-center text-muted-foreground mt-4">
                    Rate your knowledge
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Rating Controls - Shown when card is flipped */}
          {flipped && (
            <div className="grid grid-cols-3 gap-3 animate-fade-in">
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:hover:border-red-800 dark:hover:bg-red-900/30"
                onClick={() => handleRate("hard")}
              >
                <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
                <span>Hard</span>
                <span className="text-xs text-muted-foreground mt-1">Review Tomorrow</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 dark:border-yellow-900 dark:hover:border-yellow-800 dark:hover:bg-yellow-900/30"
                onClick={() => handleRate("medium")}
              >
                <RotateCcw className="h-6 w-6 text-yellow-500 mb-2" />
                <span>Medium</span>
                <span className="text-xs text-muted-foreground mt-1">Review in 3 Days</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-900 dark:hover:border-green-800 dark:hover:bg-green-900/30"
                onClick={() => handleRate("easy")}
              >
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <span>Easy</span>
                <span className="text-xs text-muted-foreground mt-1">Review in 7 Days</span>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Study;
