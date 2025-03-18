
import { Link } from "react-router-dom";
import { Lightbulb, Github, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 px-6 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="font-semibold tracking-tight">FlashWise</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              FlashWise helps you learn faster and remember more with beautiful flashcards and spaced repetition.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/study" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Study
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Create Flashcard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} FlashWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
