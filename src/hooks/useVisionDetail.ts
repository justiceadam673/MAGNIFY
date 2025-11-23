import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Vision = Tables<"visions">;
type Goal = Tables<"goals">;
type TrackerEntry = Tables<"tracker_entries">;

export const useVisionDetail = (visionId: string) => {
  const [vision, setVision] = useState<Vision | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [trackerEntries, setTrackerEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisionData = async () => {
    try {
      setLoading(true);

      // Fetch vision
      const { data: visionData, error: visionError } = await supabase
        .from("visions")
        .select("*")
        .eq("id", visionId)
        .single();

      if (visionError) throw visionError;
      setVision(visionData);

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .eq("vision_id", visionId)
        .order("created_at", { ascending: true });

      if (goalsError) throw goalsError;
      setGoals(goalsData || []);

      // Fetch tracker entries
      if (goalsData && goalsData.length > 0) {
        const { data: entriesData, error: entriesError } = await supabase
          .from("tracker_entries")
          .select("*")
          .in("goal_id", goalsData.map(g => g.id))
          .order("date", { ascending: false })
          .limit(30);

        if (entriesError) throw entriesError;
        setTrackerEntries(entriesData || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch vision data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visionId) {
      fetchVisionData();
    }
  }, [visionId]);

  return { vision, goals, trackerEntries, loading, refetch: fetchVisionData };
};
