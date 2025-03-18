
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useFlashcards } from "@/hooks/useFlashcards";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FlashcardModal from "./FlashcardModal";
import { Flashcard } from "./FlashcardGrid";

interface FlashcardCardProps {
  flashcard: Flashcard;
  viewMode: "grid" | "list";
}

const FlashcardCard = ({ flashcard, viewMode }: FlashcardCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const { deleteFlashcard } = useFlashcards();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteFlashcard(flashcard.id);
    } catch (error) {
      console.error("Failed to delete flashcard:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Never";
    }
  };

  const isReviewDue = () => {
    if (!flashcard.nextReviewDate) return false;
    const nextReview = new Date(flashcard.nextReviewDate);
    return nextReview <= new Date();
  };

  return (
    <>
      <div 
        className={`perspective ${viewMode === "grid" ? "" : "max-w-full"}`}
        onClick={handleFlip}
      >
        <Card
          className={`
            glass-card cursor-pointer h-full transition-all duration-300 preserve-3d
            ${flipped ? "animate-flip" : "animate-flip-back"}
            ${isReviewDue() ? "border-yellow-400 dark:border-yellow-400" : ""}
          `}
        >
          <div className="absolute inset-0 backface-hidden">
            <CardContent className={`p-6 ${viewMode === "list" ? "flex items-center" : ""}`}>
              {viewMode === "list" ? (
                <>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getDifficultyColor(flashcard.difficulty)}>
                        {flashcard.difficulty}
                      </Badge>
                      {isReviewDue() && (
                        <Badge variant="outline" className="ml-2 animate-pulse border-yellow-400 text-yellow-600 dark:text-yellow-400">
                          Review due
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium line-clamp-1">{flashcard.question}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last reviewed: {formatDate(flashcard.lastReviewed)}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getDifficultyColor(flashcard.difficulty)}>
                      {flashcard.difficulty}
                    </Badge>
                    {isReviewDue() && (
                      <Badge variant="outline" className="animate-pulse border-yellow-400 text-yellow-600 dark:text-yellow-400">
                        Review due
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium mb-2">{flashcard.question}</h3>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span>Last reviewed: {formatDate(flashcard.lastReviewed)}</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </div>
          
          <div className="absolute inset-0 backface-hidden rotateY-180">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-muted-foreground">
                  Answer
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(false);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <p>{flashcard.answer}</p>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Next review: {formatDate(flashcard.nextReviewDate)}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete flashcard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flashcard? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <FlashcardModal flashcard={flashcard} onClose={() => setShowEditDialog(false)} />
      </Dialog>
    </>
  );
};

export default FlashcardCard;
