import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, ArrowLeft, Heart, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Tracker = () => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [note, setNote] = useState("");

  // Mock data - will be replaced with real data from Lovable Cloud
  const goalsToTrack = [
    {
      id: "1",
      visionType: "gods-will",
      visionTitle: "God's Will Vision",
      goalTitle: "Monthly Tithe (10%)",
      icon: Heart,
      color: "text-primary",
    },
    {
      id: "2",
      visionType: "gods-will",
      visionTitle: "God's Will Vision",
      goalTitle: "Weekly Offering",
      icon: Heart,
      color: "text-primary",
    },
    {
      id: "3",
      visionType: "personal",
      visionTitle: "Personal Vision",
      goalTitle: "Morning Prayer (30 min)",
      icon: Sparkles,
      color: "text-gold",
    },
    {
      id: "4",
      visionType: "personal",
      visionTitle: "Personal Vision",
      goalTitle: "Bible Reading",
      icon: Sparkles,
      color: "text-gold",
    },
    {
      id: "5",
      visionType: "financial",
      visionTitle: "Financial Vision",
      goalTitle: "Budget Review",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleSubmit = () => {
    if (selectedGoals.length === 0) {
      toast.error("Please select at least one goal to track");
      return;
    }
    toast.success(`Tracked ${selectedGoals.length} goals for today!`);
    setSelectedGoals([]);
    setNote("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/app/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Crown className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-serif font-bold">Magnify</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold mb-3">Track Today's Progress</h2>
          <p className="text-xl text-muted-foreground">
            Mark today's progress — every faithful step matters
          </p>
        </div>

        <Card className="shadow-elegant mb-6">
          <CardHeader>
            <CardTitle className="font-serif">Today's Goals</CardTitle>
            <CardDescription>
              Select the goals you've completed or made progress on today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalsToTrack.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-4 p-4 border-2 rounded-xl hover:bg-secondary/50 transition-smooth cursor-pointer"
                onClick={() => toggleGoal(goal.id)}
              >
                <Checkbox
                  id={goal.id}
                  checked={selectedGoals.includes(goal.id)}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <div className="flex items-center gap-3 flex-1">
                  <goal.icon className={`h-5 w-5 ${goal.color}`} />
                  <div>
                    <Label htmlFor={goal.id} className="font-semibold cursor-pointer">
                      {goal.goalTitle}
                    </Label>
                    <div className="text-sm text-muted-foreground">{goal.visionTitle}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-elegant mb-6">
          <CardHeader>
            <CardTitle className="font-serif">Add a Note (Optional)</CardTitle>
            <CardDescription>
              Reflect on today's journey or add any thoughts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What did you learn today? How did God move?"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link to="/app/dashboard">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Save Progress
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Tracker;
