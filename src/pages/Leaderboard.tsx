// src/pages/Leaderboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { dashboardApi } from "@/lib/dashboardApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LeaderboardEntry } from "@/types";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { mockLeaderboard } from "@/data/mockData"; // make sure mock data exists here

// Define the type for sorting keys
type SortKey = "rank" | "totalSolved" | "currentStreak" | "penaltyAmount";

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Load leaderboard (fallback to mock if API fails)
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardApi.getGlobalLeaderboard();
        setLeaderboardData(data ?? mockLeaderboard);
      } catch (err) {
        toast({
          title: "Error loading leaderboard",
          description: "Could not fetch data. Using mock leaderboard.",
          variant: "destructive",
        });
        setLeaderboardData(mockLeaderboard);
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, [toast]);

  // Process leaderboard (search + sort)
  const processedLeaderboard = useLeaderboard(
    leaderboardData,
    searchQuery,
    sortKey,
    sortOrder
  );

  const totalPages = Math.ceil(processedLeaderboard.length / pageSize);
  const paginatedData = processedLeaderboard.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Global Leaderboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users"
            className="input input-sm"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="input input-sm"
          >
            <option value="rank">Rank</option>
            <option value="totalSolved">Total Solved</option>
            <option value="currentStreak">Current Streak</option>
            <option value="penaltyAmount">Penalty</option>
          </select>
          <Button
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> Loading leaderboard...
          </div>
        ) : paginatedData.length > 0 ? (
          <LeaderboardTable entries={paginatedData} currentUserId={user?.id} />
        ) : (
          <Card className="p-4 text-center">
            <CardContent>
              <Zap className="mx-auto mb-2" />
              No leaderboard entries found.
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div>
            Page {page} of {totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;