
import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Loader2 } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordTarget, setRecordTarget] = useState<"question" | "answer" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
  });
  
  const { createFlashcard, updateFlashcard } = useFlashcards();
  
  // Speech recognition setup
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        
        if (recordTarget === "question") {
          setQuestion(transcript);
        } else if (recordTarget === "answer") {
          setAnswer(transcript);
        }
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
        setRecordTarget(null);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startSpeechRecognition = (target: "question" | "answer") => {
    if (!recognition) return;
    
    try {
      setRecordTarget(target);
      setIsRecording(true);
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsRecording(false);
      setRecordTarget(null);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      setRecordTarget(null);
    }
  };

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
            <div className="flex items-center justify-between">
              <Label htmlFor="question" className="text-sm font-medium">
                Question
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${recordTarget === "question" && isRecording ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 animate-pulse" : ""}`}
                onClick={() => recordTarget === "question" && isRecording 
                  ? stopSpeechRecognition() 
                  : startSpeechRecognition("question")}
                disabled={isRecording && recordTarget !== "question"}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="answer" className="text-sm font-medium">
                Answer
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${recordTarget === "answer" && isRecording ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 animate-pulse" : ""}`}
                onClick={() => recordTarget === "answer" && isRecording 
                  ? stopSpeechRecognition() 
                  : startSpeechRecognition("answer")}
                disabled={isRecording && recordTarget !== "answer"}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
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
          <Button type="submit" disabled={isSubmitting || isRecording}>
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
