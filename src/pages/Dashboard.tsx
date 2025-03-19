
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FlashcardGrid from "@/components/flashcards/FlashcardGrid";
import SearchBar from "@/components/ui/SearchBar";
import StatisticsCard from "@/components/ui/StatisticsCard";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFlashcards } from "@/hooks/useFlashcards";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { stats, groups } = useFlashcards();
  const isMobile = useIsMobile();
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

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
            <Button 
              onClick={() => navigate("/create")}
              className="rounded-full"
            >
              Create Flashcard
            </Button>
          </div>
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card shadow-sm">
                <CardContent className="p-4">
                  <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search cards..." 
                    className="mb-4"
                  />
                  
                  <div className="mt-4">
                    <label htmlFor="group-filter" className="block text-sm font-medium mb-2">
                      Filter by Group
                    </label>
                    <Select
                      value={selectedGroup}
                      onValueChange={setSelectedGroup}
                    >
                      <SelectTrigger id="group-filter">
                        <SelectValue placeholder="All Groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <StatisticsCard />
              
              {!isMobile && stats.dueToday > 0 && (
                <Card className="glass-card shadow-sm p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Review Cards</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.dueToday} cards due today
                      </p>
                    </div>
                    <Button 
                      onClick={() => navigate("/study")}
                      className="shrink-0"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Study
                    </Button>
                  </div>
                </Card>
              )}
              
              <Card className="glass-card shadow-sm p-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="font-medium">Quick Links</h3>
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={() => navigate("/profile")}
                  >
                    Profile Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={() => navigate("/create")}
                  >
                    Create Flashcard
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Study Reminder */}
              {isMobile && stats.dueToday > 0 && (
                <Card className="glass-card p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Review Cards</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.dueToday} cards due today
                      </p>
                    </div>
                    <Button 
                      onClick={() => navigate("/study")}
                      className="shrink-0"
                      size="sm"
                    >
                      Study
                    </Button>
                  </div>
                </Card>
              )}
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Cards</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="due">Due Today</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <Dialog>
                    <FlashcardGrid 
                      searchQuery={searchQuery} 
                      filterBy="all" 
                    />
                  </Dialog>
                </TabsContent>
                
                <TabsContent value="recent" className="mt-0">
                  <Dialog>
                    <FlashcardGrid 
                      searchQuery={searchQuery} 
                      filterBy="recent" 
                    />
                  </Dialog>
                </TabsContent>
                
                <TabsContent value="due" className="mt-0">
                  <Dialog>
                    <FlashcardGrid 
                      searchQuery={searchQuery} 
                      filterBy="due" 
                    />
                  </Dialog>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
