// src/lib/mockData.ts
import { User, Challenge, LeaderboardEntry, Stats, ActivityData, ChartData } from "@/types";

// ----------------------
// Current user
// ----------------------
export const currentUser: User = {
  id: "1",
  name: "Alex Chen",
  email: "alex@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  leetcodeUsername: "alexchen",
};

// ----------------------
// Stats mock
// ----------------------
export const mockStats: Stats = {
  todayStatus: "completed",
  todaySolved: 2,
  todayTarget: 2,
  currentStreak: 14,
  longestStreak: 30,
  totalPenalties: 25,
  activeChallenges: 3,
  totalSolved: 156,
};

// ----------------------
// Challenges mock
// ----------------------
export const mockChallenges: Challenge[] = [
  {
    id: "1",
    name: "January Grind",
    dailyTarget: 2,
    difficulty: "medium",
    penaltyAmount: 5,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    createdBy: "1",
    isActive: true,
    members: [
      {
        userId: "1",
        userName: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        status: "completed",
        joinedAt: "2024-01-01",
        streak: 14,
        totalPenalty: 10,
        dailyProgress: [],
      },
      {
        userId: "2",
        userName: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        status: "completed",
        joinedAt: "2024-01-03",
        streak: 12,
        totalPenalty: 15,
        dailyProgress: [],
      },
      {
        userId: "3",
        userName: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        status: "failed",
        joinedAt: "2024-01-05",
        streak: 5,
        totalPenalty: 45,
        dailyProgress: [],
      },
    ],
  },
  {
    id: "2",
    name: "Hard Mode Warriors",
    dailyTarget: 1,
    difficulty: "hard",
    penaltyAmount: 10,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    createdBy: "2",
    isActive: true,
    members: [
      {
        userId: "1",
        userName: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        status: "pending",
        joinedAt: "2024-01-16",
        streak: 8,
        totalPenalty: 20,
        dailyProgress: [],
      },
      {
        userId: "4",
        userName: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        status: "completed",
        joinedAt: "2024-01-17",
        streak: 10,
        totalPenalty: 10,
        dailyProgress: [],
      },
    ],
  },
];

// ----------------------
// Leaderboard mock for infinite scroll
// ----------------------
export const generateMockLeaderboard = (count: number = 200): LeaderboardEntry[] => {
  return Array.from({ length: count }, (_, i) => {
    const totalSolved = Math.floor(Math.random() * 300) + 50; // 50 to 350
    const currentStreak = Math.floor(Math.random() * 30); // 0 to 29
    const missedDays = Math.floor(Math.random() * 15); // 0 to 14
    const penaltyAmount = Math.floor(Math.random() * 100); // 0 to 99

    return {
      rank: i + 1,
      userId: `${i + 1}`,
      userName: `User ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i + 1}`,
      totalSolved,
      currentStreak,
      missedDays,
      penaltyAmount,
    };
  });
};

export const mockLeaderboard: LeaderboardEntry[] = generateMockLeaderboard(200);

// ----------------------
// Activity data for last 365 days
// ----------------------
export const generateActivityData = (): ActivityData[] => {
  const data: ActivityData[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const random = Math.random();
    let count = 0;
    if (random > 0.3) count = 1;
    if (random > 0.5) count = 2;
    if (random > 0.7) count = 3;
    if (random > 0.9) count = 4;

    data.push({
      date: date.toISOString().split("T")[0],
      count,
    });
  }

  return data;
};

export const mockActivityData = generateActivityData();

// ----------------------
// Chart data for last 30 days
// ----------------------
export const generateChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      solved: Math.floor(Math.random() * 4) + 1,
      target: 2,
    });
  }

  return data;
};

export const mockChartData = generateChartData();