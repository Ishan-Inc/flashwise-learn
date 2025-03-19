
import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { Loader2, CalendarIcon } from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Flashcard } from "./FlashcardGrid";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FlashcardModalProps {
  flashcard?: Flashcard;
  onClose: () => void;
}

const FlashcardModal = ({ flashcard, onClose }: FlashcardModalProps) => {
  const [question, setQuestion] = useState(flashcard?.question || "");
  const [answer, setAnswer] = useState(flashcard?.answer || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    flashcard?.difficulty || "medium"
  );
  const [group, setGroup] = useState<string>(flashcard?.group || "");
  const [reviewDate, setReviewDate] = useState<Date | undefined>(
    flashcard?.nextReviewDate ? new Date(flashcard.nextReviewDate) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
  });
  
  const { createFlashcard, updateFlashcard, groups } = useFlashcards();

  const validateInputs = () => {
    const newErrors = {
      question: "",
      answer: "",
    };
    
    if (!question.trim()) {
      newErrors.question = "Question is required";
    }
    
    if (!answer.trim()) {
      newErrors.answer = "Answer is required";
    }
    
    setErrors(newErrors);
    return !newErrors.question && !newErrors.answer;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setIsSubmitting(true);
    
    try {
      if (flashcard) {
        // Update existing flashcard
        await updateFlashcard({
          ...flashcard,
          question,
          answer,
          difficulty,
          group,
          nextReviewDate: reviewDate ? reviewDate.toISOString() : addDays(new Date(), 1).toISOString(),
        });
      } else {
        // Create new flashcard
        await createFlashcard({
          question,
          answer,
          difficulty,
          group,
          nextReviewDate: reviewDate ? reviewDate.toISOString() : addDays(new Date(), 1).toISOString(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save flashcard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[550px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {flashcard ? "Edit Flashcard" : "Create New Flashcard"}
          </DialogTitle>
          <DialogDescription>
            {flashcard 
              ? "Update your flashcard information below."
              : "Fill in the details to create a new flashcard."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Question
            </Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your question here..."
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">
              Answer
            </Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter your answer here..."
            />
            {errors.answer && (
              <p className="text-sm text-destructive">{errors.answer}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty
              </Label>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group" className="text-sm font-medium">
                Group
              </Label>
              <Select
                value={group}
                onValueChange={setGroup}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reviewDate" className="text-sm font-medium">
              Review Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !reviewDate && "text-muted-foreground"
                  )}
                  id="reviewDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reviewDate ? format(reviewDate, "PPP") : <span>Select a review date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reviewDate}
                  onSelect={setReviewDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {flashcard ? "Updating..." : "Creating..."}
              </>
            ) : (
              flashcard ? "Update Flashcard" : "Create Flashcard"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default FlashcardModal;
