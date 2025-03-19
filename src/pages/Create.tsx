
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FlashcardModal from "@/components/flashcards/FlashcardModal";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Bookmark, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlashcards } from "@/hooks/useFlashcards";

const Create = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { groups } = useFlashcards();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, isLoading]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 flex items-start justify-center">
        <div className="w-full max-w-4xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Flashcard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Fill in the form to create a new flashcard for your collection.</p>
              
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <FlashcardModal onClose={handleClose} />
              </Dialog>
              
              {!showModal && (
                <div className="flex flex-col items-center justify-center mt-8 space-y-4">
                  <p className="text-muted-foreground mb-4">Create another flashcard or return to your dashboard.</p>
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => setShowModal(true)}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Another Flashcard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/dashboard")}
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {!showModal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Flashcard Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">When would you like to review this flashcard?</p>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Pick a date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assign to Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Organize your flashcard by adding it to a group.</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="existing-group">Select Existing Group</Label>
                      <Select>
                        <SelectTrigger id="existing-group">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.length > 0 ? (
                            groups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No groups created yet
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-group">Or Create New Group</Label>
                      <div className="flex space-x-2">
                        <Input id="new-group" placeholder="Enter group name" />
                        <Button>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Create
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
