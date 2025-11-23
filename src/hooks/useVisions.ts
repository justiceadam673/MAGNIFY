import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Vision = Tables<"visions">;
type Goal = Tables<"goals">;

export const useVisions = () => {
  const [visions, setVisions] = useState<(Vision & { goals: Goal[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisions = async () => {
    try {
      const { data: visionsData, error: visionsError } = await supabase
        .from("visions")
        .select("*")
        .order("created_at", { ascending: false });

      if (visionsError) throw visionsError;

      if (visionsData) {
        const visionsWithGoals = await Promise.all(
          visionsData.map(async (vision) => {
            const { data: goals } = await supabase
              .from("goals")
              .select("*")
              .eq("vision_id", vision.id);

            return { ...vision, goals: goals || [] };
          })
        );

        setVisions(visionsWithGoals);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch visions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisions();
  }, []);

  return { visions, loading, refetch: fetchVisions };
};
