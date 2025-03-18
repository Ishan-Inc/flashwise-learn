
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Dialog } from "@/components/ui/dialog";
import FlashcardModal from "@/components/flashcards/FlashcardModal";

const Create = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 flex items-start justify-center">
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <FlashcardModal onClose={handleClose} />
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
