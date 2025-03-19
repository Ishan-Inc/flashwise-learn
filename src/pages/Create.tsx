
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Dialog } from "@/components/ui/dialog";
import FlashcardModal from "@/components/flashcards/FlashcardModal";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Create = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleClose = () => {
    setShowModal(false);
    navigate("/dashboard");
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
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => setShowModal(true)}
                    className="text-primary hover:underline"
                  >
                    Open form again
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
