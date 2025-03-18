
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FlashcardGrid from "@/components/flashcards/FlashcardGrid";
import SearchBar from "@/components/ui/SearchBar";
import StatisticsCard from "@/components/ui/StatisticsCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FlashcardModal from "@/components/flashcards/FlashcardModal";
import { Plus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFlashcards } from "@/hooks/useFlashcards";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { stats } = useFlashcards();
  const isMobile = useIsMobile();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Flashcard
                </Button>
              </DialogTrigger>
              <FlashcardModal onClose={() => setShowCreateModal(false)} />
            </Dialog>
          </div>
          
          {/* Statistics and Search */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search by question or answer..." 
                className="mb-6"
              />
              
              {!isMobile && stats.dueToday > 0 && (
                <div className="glass-card p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">You have {stats.dueToday} cards to review today</h3>
                    <p className="text-sm text-muted-foreground">
                      {stats.reviewedToday > 0
                        ? `You've already reviewed ${stats.reviewedToday} cards today.`
                        : "You haven't reviewed any cards yet today."}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/study")}
                    className="shrink-0"
                  >
                    Study Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <StatisticsCard />
          </div>
          
          {/* Mobile Study Reminder */}
          {isMobile && stats.dueToday > 0 && (
            <div className="glass-card p-4 mb-6 text-center">
              <h3 className="font-medium mb-2">
                You have {stats.dueToday} cards to review today
              </h3>
              <Button 
                onClick={() => navigate("/study")}
                className="w-full"
              >
                Study Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Flashcards */}
          <Dialog>
            <FlashcardGrid searchQuery={searchQuery} />
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
