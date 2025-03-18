
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
import { Loader2 } from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Flashcard } from "./FlashcardGrid";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
  });
  
  const { createFlashcard, updateFlashcard } = useFlashcards();

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
        });
      } else {
        // Create new flashcard
        await createFlashcard({
          question,
          answer,
          difficulty,
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
