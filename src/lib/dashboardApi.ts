import {
  mockStats,
  mockChallenges,
  mockActivityData,
  mockChartData,
  mockLeaderboard,
} from "@/data/mockData";

export const dashboardApi = {
  getOverview: async () => ({
    stats: mockStats,
    challenges: mockChallenges,
  }),

  getToday: async () => ({
    summary: {
      completed: mockStats.todaySolved,
      totalChallenges: mockStats.todayTarget,
    },
  }),

  getChallenges: async () => mockChallenges,

  getStats: async () => mockStats,

  getActivityHeatmap: async () => mockActivityData,

  getSubmissionChart: async () => mockChartData,

  getGlobalLeaderboard: async () => mockLeaderboard,
};