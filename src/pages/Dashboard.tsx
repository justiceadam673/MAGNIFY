import { Link, useNavigate } from "react-router-dom";
import { Crown, Target, TrendingUp, Calendar, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useVisions } from "@/hooks/useVisions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { visions, loading } = useVisions();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .maybeSingle();
        
        setUserName(profile?.display_name || user.email?.split("@")[0] || "");
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
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

  const getVisionTypeLabel = (type: string) => {
    switch (type) {
      case "gods-will":
        return "God's Will";
      case "personal":
        return "Personal";
      case "financial":
        return "Financial";
      default:
        return type;
    }
  };

  const calculateProgress = (goals: any[]) => {
    if (goals.length === 0) return 0;
    const completed = goals.filter((g) => g.completed).length;
    return Math.round((completed / goals.length) * 100);
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
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-serif font-bold">Magnify</h1>
          </Link>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold mb-2">
            Welcome back, {userName}
          </h2>
          <p className="text-muted-foreground">
            Continue stewarding your visions with faithful progress
          </p>
        </div>

        {visions.length === 0 ? (
          <Card className="shadow-elegant border-border mb-8">
            <CardContent className="pt-6 text-center">
              <div className="py-12">
                <Crown className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-serif font-bold mb-2">No visions yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first vision to start your journey
                </p>
                <Button asChild>
                  <Link to="/app/onboarding">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Vision
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {visions.map((vision) => {
                const progress = calculateProgress(vision.goals);
                const completedGoals = vision.goals.filter((g) => g.completed).length;
                const totalGoals = vision.goals.length;

                return (
                  <Link key={vision.id} to={`/app/visions/${vision.id}`}>
                    <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 h-full border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-4xl">{getVisionIcon(vision.type)}</span>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {getVisionTypeLabel(vision.type)}
                          </span>
                        </div>
                        <CardTitle className="font-serif">{vision.title}</CardTitle>
                        <CardDescription>{vision.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span>
                                {completedGoals}/{totalGoals} goals
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span className="capitalize">{vision.tracker_frequency}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <Card className="shadow-elegant border-border">
              <CardHeader>
                <CardTitle className="font-serif">Quick Actions</CardTitle>
                <CardDescription>Take action on your visions today</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/app/tracker">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Log Today's Progress
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/app/onboarding">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Vision
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
