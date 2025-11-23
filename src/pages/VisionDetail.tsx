import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Heart, Sparkles, TrendingUp, ArrowLeft, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVisionDetail } from "@/hooks/useVisionDetail";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const VisionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vision, goals, trackerEntries, loading, refetch } = useVisionDetail(id!);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("");
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("");

  const getVisionIcon = (type: string) => {
    switch (type) {
      case "gods-will":
        return Heart;
      case "personal":
        return Sparkles;
      case "financial":
        return TrendingUp;
      default:
        return Heart;
    }
  };

  const getVisionColor = (type: string) => {
    switch (type) {
      case "gods-will":
        return "text-primary";
      case "personal":
        return "text-gold";
      case "financial":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  const getVisionBgColor = (type: string) => {
    switch (type) {
      case "gods-will":
        return "bg-primary/10";
      case "personal":
        return "bg-gold/10";
      case "financial":
        return "bg-accent/10";
      default:
        return "bg-primary/10";
    }
  };

  const calculateProgress = () => {
    if (goals.length === 0) return 0;
    const completed = goals.filter((g) => g.completed).length;
    return Math.round((completed / goals.length) * 100);
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    try {
      const { error } = await supabase.from("goals").insert({
        vision_id: id!,
        title: newGoalTitle,
        category: newGoalCategory || null,
        target_date: newGoalTargetDate || null,
      });

      if (error) throw error;

      toast.success("Goal added successfully!");
      setNewGoalTitle("");
      setNewGoalCategory("");
      setNewGoalTargetDate("");
      setIsAddingGoal(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add goal");
    }
  };

  const handleToggleGoal = async (goalId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("goals")
        .update({ completed: !currentStatus })
        .eq("id", goalId);

      if (error) throw error;

      toast.success(currentStatus ? "Goal marked incomplete" : "Goal completed!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update goal");
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);

      if (error) throw error;

      toast.success("Goal deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete goal");
    }
  };

  const getEntriesForGoal = (goalId: string) => {
    return trackerEntries.filter((entry) => entry.goal_id === goalId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vision) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="shadow-elegant max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Vision not found</p>
            <Button asChild>
              <Link to="/app/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const VisionIcon = getVisionIcon(vision.type);
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-subtle">
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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Vision Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 ${getVisionBgColor(vision.type)} rounded-2xl flex items-center justify-center`}>
              <VisionIcon className={`h-8 w-8 ${getVisionColor(vision.type)}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-serif font-bold mb-2">{vision.title}</h2>
              <p className="text-lg text-muted-foreground">{vision.description}</p>
            </div>
          </div>
          
          <Card className="shadow-elegant">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold">Your Goals</h3>
              <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>Create a new goal to track for this vision</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-title">Goal Title *</Label>
                      <Input
                        id="goal-title"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        placeholder="e.g., Monthly tithe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-category">Category (optional)</Label>
                      <Input
                        id="goal-category"
                        value={newGoalCategory}
                        onChange={(e) => setNewGoalCategory(e.target.value)}
                        placeholder="e.g., Giving"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-date">Target Date (optional)</Label>
                      <Input
                        id="goal-date"
                        type="date"
                        value={newGoalTargetDate}
                        onChange={(e) => setNewGoalTargetDate(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddGoal} className="w-full">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {goals.length === 0 ? (
              <Card className="shadow-elegant">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No goals yet. Add your first goal to get started.</p>
                  <Button onClick={() => setIsAddingGoal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {goals.map((goal) => (
                  <Card key={goal.id} className="shadow-elegant hover:shadow-gold transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleGoal(goal.id, goal.completed || false)}
                            className="mt-1"
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-primary" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <CardTitle className="font-serif">{goal.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {goal.category && (
                                <Badge variant="secondary" className="mt-2">
                                  {goal.category}
                                </Badge>
                              )}
                              {goal.target_date && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  Due: {new Date(goal.target_date).toLocaleDateString()}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tracker" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold">Progress Tracker</h3>
              <Button asChild>
                <Link to="/app/tracker">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Progress
                </Link>
              </Button>
            </div>

            {trackerEntries.length === 0 ? (
              <Card className="shadow-elegant">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No tracker entries yet. Log your first entry!</p>
                  <Button asChild>
                    <Link to="/app/tracker">Log Today's Progress</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {trackerEntries.slice(0, 10).map((entry) => {
                  const goal = goals.find((g) => g.id === entry.goal_id);
                  return (
                    <Card key={entry.id} className="shadow-sm">
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          {entry.status === "done" ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-semibold">
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">{goal?.title}</div>
                            {entry.note && (
                              <div className="text-sm text-muted-foreground mt-1">{entry.note}</div>
                            )}
                          </div>
                        </div>
                        <Badge variant={entry.status === "done" ? "default" : "secondary"}>
                          {entry.status === "done" ? "Completed" : entry.status === "skipped" ? "Missed" : "Partial"}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VisionDetail;
