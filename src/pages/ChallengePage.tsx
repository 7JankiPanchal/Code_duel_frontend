// src/pages/ChallengePage.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, PlayCircle, Users, UserPlus, Calendar, Clock } from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import InviteUserDialog from "@/components/challenge/InviteUserDialog";
import { challengeApi, dashboardApi } from "@/lib/api";
import { Challenge } from "@/types";

const PAGE_SIZE = 6;

const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // ===============================
  // Challenges List
  // ===============================
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ===============================
  // Challenge Details
  // ===============================
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  // ===============================
  // Load Challenges (infinite scroll)
  // ===============================
  const loadChallenges = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await challengeApi.getAll({ page: pageNum, limit: PAGE_SIZE });
      const data = res?.data || [];

      setChallenges(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setTotalPages(Math.ceil((res?.data?.length || 1) / PAGE_SIZE));
    } catch (error) {
      toast({ title: "Error loading challenges", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges(page);
  }, [page]);

  const lastChallengeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // ===============================
  // Load Challenge Details
  // ===============================
  const loadChallengeDetails = async (challengeId: string) => {
    try {
      const [challengeRes, leaderboardRes, progressRes] = await Promise.all([
        challengeApi.getById(challengeId),
        dashboardApi.getChallengeLeaderboard(challengeId),
        dashboardApi.getChallengeProgress(challengeId),
      ]);

      if (challengeRes?.success) setChallenge(challengeRes.data);
      if (leaderboardRes?.success) setLeaderboard(leaderboardRes.data || []);
      if (progressRes?.success) setChartData(progressRes.data || []);
    } catch (error) {
      toast({ title: "Failed to load challenge details", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (id) loadChallengeDetails(id);
  }, [id]);

  // ===============================
  // Join / Activate Challenge
  // ===============================
  const handleJoinChallenge = async () => {
    if (!id) return;
    setIsJoining(true);
    try {
      const res = await challengeApi.join(id);
      if (res?.success) toast({ title: "Joined challenge!" });
      loadChallengeDetails(id);
    } catch {
      toast({ title: "Failed to join challenge", variant: "destructive" });
    } finally {
      setIsJoining(false);
    }
  };

  const handleActivateChallenge = async () => {
    if (!id) return;
    setIsActivating(true);
    try {
      const res = await challengeApi.updateStatus(id, "ACTIVE");
      if (res?.success) toast({ title: "Challenge activated!" });
      loadChallengeDetails(id);
    } catch {
      toast({ title: "Failed to activate challenge", variant: "destructive" });
    } finally {
      setIsActivating(false);
    }
  };

  if (id && !challenge) return <div className="p-6">Loading challenge...</div>;

  return (
    <Layout>
      {!id && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Challenges</h1>
          <div className="grid gap-4">
            {challenges.map((c, index) => (
              <div
                key={c.id}
                ref={index === challenges.length - 1 ? lastChallengeRef : null}
                className="border p-4 rounded shadow-sm"
              >
                <Link to={`/challenge/${c.id}`} className="font-semibold">
                  {c.name}
                </Link>
                <p>Status: {c.status}</p>
              </div>
            ))}
          </div>
          {loading && <Loader2 className="animate-spin mx-auto" />}
        </div>
      )}

      {id && challenge && (
        <div className="space-y-6">
          <Button asChild variant="ghost">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>

          <h1 className="text-3xl font-bold">{challenge.name}</h1>
          <p>{challenge.description}</p>

          {challenge.ownerId === user?.id && challenge.status === "PENDING" && (
            <Button onClick={handleActivateChallenge} disabled={isActivating}>
              {isActivating ? <Loader2 className="animate-spin" /> : <PlayCircle />} Activate
            </Button>
          )}

          {!leaderboard.some(m => m.userId === user?.id) && (
            <Button onClick={handleJoinChallenge} disabled={isJoining}>
              {isJoining ? <Loader2 className="animate-spin" /> : <Users />} Join
            </Button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ChallengePage;