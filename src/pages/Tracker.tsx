import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Goal = Tables<"goals"> & {
  vision: {
    title: string;
    type: string;
  };
};

const Tracker = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<{ goalId: string; completed: boolean }[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch all visions for the user
      const { data: visions, error: visionsError } = await supabase
        .from("visions")
        .select("id, title, type")
        .eq("user_id", user.id);

      if (visionsError) throw visionsError;

      if (!visions || visions.length === 0) {
        setGoals([]);
        setLoading(false);
        return;
      }

      // Fetch all goals for these visions
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .in("vision_id", visions.map(v => v.id))
        .order("created_at", { ascending: true });

      if (goalsError) throw goalsError;

      // Combine goals with vision info
      const goalsWithVisions = (goalsData || []).map((goal) => {
        const vision = visions.find((v) => v.id === goal.vision_id);
        return {
          ...goal,
          vision: {
            title: vision?.title || "",
            type: vision?.type || "",
          },
        };
      });

      setGoals(goalsWithVisions);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => {
      const existing = prev.find((g) => g.goalId === goalId);
      if (existing) {
        return prev.filter((g) => g.goalId !== goalId);
      } else {
        return [...prev, { goalId, completed: true }];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedGoals.length === 0) {
      toast.error("Please select at least one goal to track");
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Create tracker entries for selected goals
      const entries = selectedGoals.map((goal) => ({
        goal_id: goal.goalId,
        date: today,
        status: goal.completed ? "done" : "skipped",
        note: note || null,
      }));

      const { error } = await supabase.from("tracker_entries").upsert(entries, {
        onConflict: "goal_id,date",
      });

      if (error) throw error;

      toast.success(`Tracked ${selectedGoals.length} goal${selectedGoals.length > 1 ? "s" : ""} for today!`);
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save tracker entries");
    } finally {
      setSubmitting(false);
    }
  };

  const getVisionIcon = (type: string) => {
    switch (type) {
      case "gods-will":
        return "🙏";
      case "personal":
        return "✨";
      case "financial":
        return "💰";
      default:
        return "🎯";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold mb-3">Track Today's Progress</h2>
          <p className="text-xl text-muted-foreground">
            Mark today's progress — every faithful step matters
          </p>
        </div>

        {goals.length === 0 ? (
          <Card className="shadow-elegant">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No goals to track yet. Create a vision and add some goals first.
              </p>
              <Button asChild>
                <Link to="/app/onboarding">Create Your First Vision</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="shadow-elegant mb-6">
              <CardHeader>
                <CardTitle className="font-serif">Today's Goals</CardTitle>
                <CardDescription>
                  Select the goals you've completed or made progress on today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => {
                  const isSelected = selectedGoals.some((g) => g.goalId === goal.id);
                  return (
                    <div
                      key={goal.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl hover:bg-secondary/50 transition-smooth cursor-pointer ${
                        isSelected ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <Checkbox
                        id={goal.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleGoal(goal.id)}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getVisionIcon(goal.vision.type)}</span>
                        <div>
                          <Label htmlFor={goal.id} className="font-semibold cursor-pointer">
                            {goal.title}
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {goal.vision.title}
                            {goal.category && ` • ${goal.category}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? "Saving..." : "Save Progress"}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Tracker;
