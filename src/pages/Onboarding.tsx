import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown, Heart, Sparkles, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [visionType, setVisionType] = useState<string>("gods-will");
  const [visionTitle, setVisionTitle] = useState("");
  const [visionDescription, setVisionDescription] = useState("");
  const [trackerFrequency, setTrackerFrequency] = useState<string>("daily");
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleComplete = () => {
    toast.success("Vision created! Welcome to Magnify.");
    navigate("/app/dashboard");
  };

  const visionTypes = [
    {
      value: "gods-will",
      label: "God's Will Vision",
      description: "Track spiritual giving, commitments, and worship goals",
      icon: Heart,
      color: "text-primary",
    },
    {
      value: "personal",
      label: "Personal Vision",
      description: "Build Christ-centered habits and character growth",
      icon: Sparkles,
      color: "text-gold",
    },
    {
      value: "financial",
      label: "Financial Vision",
      description: "Steward resources and track financial milestones",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-serif font-bold">Welcome to Magnify</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Let's set up your first vision in {totalSteps} simple steps
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-smooth ${
                      i + 1 <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">
              {step === 1 && "Choose Your Vision Type"}
              {step === 2 && "Name Your Vision"}
              {step === 3 && "Set Your Intention"}
              {step === 4 && "Choose Tracking Frequency"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "What area of stewardship would you like to focus on?"}
              {step === 2 && "Give your vision a meaningful title"}
              {step === 3 && "Describe what God is calling you to steward"}
              {step === 4 && "How often will you track your progress?"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <RadioGroup value={visionType} onValueChange={setVisionType}>
                <div className="space-y-3">
                  {visionTypes.map((type) => (
                    <Label
                      key={type.value}
                      htmlFor={type.value}
                      className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-smooth hover:border-primary"
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <div className="flex items-center gap-3 flex-1">
                        <type.icon className={`h-6 w-6 ${type.color}`} />
                        <div>
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="title">Vision Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Faithful Tithing Journey"
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <Label htmlFor="description">Vision Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vision in detail..."
                  rows={6}
                  value={visionDescription}
                  onChange={(e) => setVisionDescription(e.target.value)}
                />
              </div>
            )}

            {step === 4 && (
              <RadioGroup value={trackerFrequency} onValueChange={setTrackerFrequency}>
                <div className="space-y-3">
                  <Label
                    htmlFor="daily"
                    className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-smooth hover:border-primary"
                  >
                    <RadioGroupItem value="daily" id="daily" />
                    <div>
                      <div className="font-semibold">Daily Tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Track progress every day for consistent growth
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="weekly"
                    className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-smooth hover:border-primary"
                  >
                    <RadioGroupItem value="weekly" id="weekly" />
                    <div>
                      <div className="font-semibold">Weekly Tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Review progress weekly for a broader view
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button className="flex-1" onClick={() => setStep(step + 1)}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleComplete}>
                  Complete Setup
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
