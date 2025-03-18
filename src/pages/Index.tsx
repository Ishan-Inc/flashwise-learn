
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Brain, BookOpen, Clock, CheckCircle, Star } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Learn Faster with{" "}
              <span className="text-primary">Intelligent Flashcards</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              FlashWise uses spaced repetition to help you remember what you learn, forever.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto px-8">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Supercharge Your Learning
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our intelligent system adapts to your learning style and helps you focus on what matters.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="h-10 w-10 text-primary" />,
                  title: "Spaced Repetition",
                  description:
                    "Review cards at optimal intervals to improve long-term retention.",
                },
                {
                  icon: <BookOpen className="h-10 w-10 text-primary" />,
                  title: "Easy Creation",
                  description:
                    "Create new flashcards quickly with our intuitive interface or voice input.",
                },
                {
                  icon: <Clock className="h-10 w-10 text-primary" />,
                  title: "Smart Scheduling",
                  description:
                    "The app schedules reviews based on your performance and difficulty ratings.",
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-primary" />,
                  title: "Progress Tracking",
                  description:
                    "Monitor your learning progress with detailed statistics and insights.",
                },
                {
                  icon: <Star className="h-10 w-10 text-primary" />,
                  title: "Customizable",
                  description:
                    "Personalize your learning experience with custom categories and settings.",
                },
                {
                  icon: (
                    <svg
                      className="h-10 w-10 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Mobile Friendly",
                  description:
                    "Study anywhere, anytime, with a fully responsive design optimized for all devices.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-card p-6 flex flex-col items-center text-center"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Start Learning Smarter?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have improved their learning with FlashWise.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button size="lg" className="px-8">
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
