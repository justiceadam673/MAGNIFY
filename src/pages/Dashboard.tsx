import { Crown, Heart, Sparkles, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - will be replaced with real data from Lovable Cloud
  const visions = [
    {
      id: "1",
      type: "gods-will",
      title: "God's Will Vision",
      icon: Heart,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Track your spiritual giving and commitments",
      progress: 75,
      goalsCount: 5,
      todayCompleted: 4,
    },
    {
      id: "2",
      type: "personal",
      title: "Personal Vision",
      icon: Sparkles,
      color: "text-gold",
      bgColor: "bg-gold/10",
      description: "Build Christ-centered habits and character",
      progress: 60,
      goalsCount: 7,
      todayCompleted: 3,
    },
    {
      id: "3",
      type: "financial",
      title: "Financial Vision",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Steward your resources faithfully",
      progress: 45,
      goalsCount: 4,
      todayCompleted: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-bold">Magnify</h1>
            </div>
            <Button variant="outline" asChild>
              <Link to="/">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            Welcome back, Friend
          </h2>
          <p className="text-xl text-muted-foreground">
            Every faithful step matters. Let's review your progress today.
          </p>
        </div>

        {/* Visions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {visions.map((vision) => (
            <Card key={vision.id} className="shadow-elegant hover:shadow-gold transition-smooth cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${vision.bgColor} rounded-xl flex items-center justify-center`}>
                    <vision.icon className={`h-6 w-6 ${vision.color}`} />
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/app/visions/${vision.id}`}>View</Link>
                  </Button>
                </div>
                <CardTitle className="font-serif">{vision.title}</CardTitle>
                <CardDescription>{vision.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{vision.progress}%</span>
                  </div>
                  <Progress value={vision.progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{vision.goalsCount} goals</span>
                  <span className="font-semibold text-primary">
                    {vision.todayCompleted}/{vision.goalsCount} today
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>What would you like to do today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button className="h-auto py-6 justify-start" variant="outline" asChild>
                <Link to="/app/tracker">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Log Today's Progress</div>
                      <div className="text-sm text-muted-foreground">Track your daily habits</div>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button className="h-auto py-6 justify-start" variant="outline" asChild>
                <Link to="/app/visions/new">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-gold" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Create New Vision</div>
                      <div className="text-sm text-muted-foreground">Set a new goal</div>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
