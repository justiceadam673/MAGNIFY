import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [visionType, setVisionType] = useState<"gods-will" | "personal" | "financial">("gods-will");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trackerFrequency, setTrackerFrequency] = useState<"daily" | "weekly">("daily");
  const [goals, setGoals] = useState([{ title: "", category: "", targetDate: "" }]);

  const addGoal = () => {
    if (goals.length < 5) {
      setGoals([...goals, { title: "", category: "", targetDate: "" }]);
    }
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, field: string, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setGoals(newGoals);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      // Create vision
      const { data: vision, error: visionError } = await supabase
        .from("visions")
        .insert({
          user_id: user.id,
          type: visionType,
          title,
          description,
          tracker_frequency: trackerFrequency,
        })
        .select()
        .single();

      if (visionError) throw visionError;

      // Create goals
      const goalsToInsert = goals
        .filter((g) => g.title.trim() !== "")
        .map((goal) => ({
          vision_id: vision.id,
          title: goal.title,
          category: goal.category || null,
          target_date: goal.targetDate || null,
        }));

      if (goalsToInsert.length > 0) {
        const { error: goalsError } = await supabase
          .from("goals")
          .insert(goalsToInsert);

        if (goalsError) throw goalsError;
      }

      toast.success("Vision created successfully!");
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create vision");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return title.trim() !== "";
      case 3:
        return goals.some((g) => g.title.trim() !== "");
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold">Magnify</h1>
          </div>
          <p className="text-muted-foreground">Create Your Vision</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-12 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="shadow-elegant border-border">
          <CardHeader>
            <CardTitle className="font-serif">
              {step === 1 && "Choose Vision Type"}
              {step === 2 && "Vision Details"}
              {step === 3 && "Set Your Goals"}
              {step === 4 && "Tracking Preferences"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Select the type of vision you want to create"}
              {step === 2 && "Give your vision a meaningful title and description"}
              {step === 3 && "Add 1-5 goals to track progress"}
              {step === 4 && "Choose how often you want to track progress"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <RadioGroup value={visionType} onValueChange={(value: any) => setVisionType(value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="gods-will" id="gods-will" />
                    <Label htmlFor="gods-will" className="flex-1 cursor-pointer">
                      <div className="font-medium">🙏 God's Will Vision</div>
                      <div className="text-sm text-muted-foreground">
                        Spiritual giving, worship commitments, and faith goals
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal" className="flex-1 cursor-pointer">
                      <div className="font-medium">✨ Personal Vision</div>
                      <div className="text-sm text-muted-foreground">
                        Habits, character goals, and lifestyle changes
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="financial" id="financial" />
                    <Label htmlFor="financial" className="flex-1 cursor-pointer">
                      <div className="font-medium">💰 Financial Vision</div>
                      <div className="text-sm text-muted-foreground">
                        Financial goals, milestones, and tracking
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Vision Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Generous Living Journey"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this vision means to you..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Goal {index + 1}</Label>
                      {goals.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGoal(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Goal title *"
                      value={goal.title}
                      onChange={(e) => updateGoal(index, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Category (optional)"
                      value={goal.category}
                      onChange={(e) => updateGoal(index, "category", e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="Target date (optional)"
                      value={goal.targetDate}
                      onChange={(e) => updateGoal(index, "targetDate", e.target.value)}
                    />
                  </div>
                ))}
                {goals.length < 5 && (
                  <Button variant="outline" onClick={addGoal} className="w-full">
                    Add Another Goal
                  </Button>
                )}
              </div>
            )}

            {step === 4 && (
              <RadioGroup
                value={trackerFrequency}
                onValueChange={(value: any) => setTrackerFrequency(value)}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="flex-1 cursor-pointer">
                      <div className="font-medium">Daily Tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Track progress every day for consistent habits
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                      <div className="font-medium">Weekly Tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Track progress weekly for long-term goals
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={() => navigate("/app/dashboard")}>
                  Cancel
                </Button>
              )}
              
              {step < 4 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed() || isLoading}>
                  {isLoading ? "Creating..." : "Create Vision"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
