
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Check, Brain, Clock, BarChart } from "lucide-react";

interface StatisticsCardProps {
  className?: string;
}

const StatisticsCard = ({ className = "" }: StatisticsCardProps) => {
  const { flashcards, stats } = useFlashcards();
  
  // Calculate review progress percentage
  const reviewProgress = stats.totalCards > 0
    ? Math.round((stats.reviewedToday / stats.totalCards) * 100)
    : 0;
    
  const upcomingReviews = stats.dueToday - stats.reviewedToday;

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-primary" />
          Progress Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <Brain className="h-4 w-4 mr-1" />
              Total Cards
            </div>
            <p className="text-2xl font-semibold">{stats.totalCards}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <Check className="h-4 w-4 mr-1" />
              Reviewed Today
            </div>
            <p className="text-2xl font-semibold">{stats.reviewedToday}</p>
          </div>
        </div>
        
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Today's Progress
            </div>
            <span className="font-medium">{reviewProgress}%</span>
          </div>
          <Progress value={reviewProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Due Today</p>
            <p className="text-lg font-medium">{stats.dueToday}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Still To Review</p>
            <p className="text-lg font-medium">{upcomingReviews > 0 ? upcomingReviews : 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
