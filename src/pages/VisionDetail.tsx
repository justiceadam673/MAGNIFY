import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Heart, Sparkles, TrendingUp, ArrowLeft, Plus, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VisionDetail = () => {
  const { id } = useParams();
  
  // Mock data - will be replaced with real data from Lovable Cloud
  const vision = {
    id: "1",
    type: "gods-will",
    title: "God's Will Vision",
    description: "Track your spiritual giving habits and commitments with intentionality",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-primary/10",
    progress: 75,
    trackerFrequency: "daily",
  };

  const goals = [
    {
      id: "1",
      title: "Monthly Tithe (10%)",
      category: "Tithing",
      targetValue: 10,
      currentValue: 10,
      completed: true,
    },
    {
      id: "2",
      title: "Weekly Offering",
      category: "Offering",
      targetValue: 4,
      currentValue: 3,
      completed: false,
    },
    {
      id: "3",
      title: "Special Mission Gift",
      category: "Special Gift",
      targetValue: 1,
      currentValue: 0,
      completed: false,
    },
  ];

  const trackerEntries = [
    { date: "2025-01-20", completed: true, note: "Gave joyfully today" },
    { date: "2025-01-19", completed: true, note: "" },
    { date: "2025-01-18", completed: false, note: "Missed - will catch up" },
    { date: "2025-01-17", completed: true, note: "" },
  ];

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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Vision Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 ${vision.bgColor} rounded-2xl flex items-center justify-center`}>
              <vision.icon className={`h-8 w-8 ${vision.color}`} />
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
                  <span className="font-semibold">{vision.progress}%</span>
                </div>
                <Progress value={vision.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold">Your Goals</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="shadow-elegant hover:shadow-gold transition-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {goal.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                        )}
                        <div>
                          <CardTitle className="font-serif">{goal.title}</CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="secondary" className="mt-2">
                              {goal.category}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {goal.currentValue}/{goal.targetValue}
                        </div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracker" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold">Daily Tracker</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Entry
              </Button>
            </div>

            <div className="grid gap-3">
              {trackerEntries.map((entry, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      {entry.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-semibold">{entry.date}</div>
                        {entry.note && (
                          <div className="text-sm text-muted-foreground mt-1">{entry.note}</div>
                        )}
                      </div>
                    </div>
                    <Badge variant={entry.completed ? "default" : "secondary"}>
                      {entry.completed ? "Completed" : "Missed"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold">Reflections</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>

            <Card className="shadow-elegant">
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No journal entries yet. Start reflecting on your journey.
                </p>
                <Button>Create First Entry</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VisionDetail;
