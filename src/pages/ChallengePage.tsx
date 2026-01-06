import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Target, DollarSign, Users, Clock, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import MembersList from '@/components/challenge/MembersList';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { mockChallenges, mockChartData } from '@/data/mockData';
import { cn } from '@/lib/utils';

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-destructive/10 text-destructive border-destructive/20',
  any: 'bg-primary/10 text-primary border-primary/20'
};

const ChallengePage: React.FC = () => {
  const { id } = useParams();
  const challenge = mockChallenges.find(c => c.id === id) || mockChallenges[0];
  
  const daysRemaining = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const totalDays = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const progress = Math.round(((totalDays - daysRemaining) / totalDays) * 100);
  const completedMembers = challenge.members.filter(m => m.status === 'completed').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{challenge.name}</h1>
              <Badge variant="outline" className={cn(difficultyColors[challenge.difficulty])}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{daysRemaining} days left</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Target</p>
                  <p className="text-xl font-semibold">{challenge.dailyTarget}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <DollarSign className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penalty</p>
                  <p className="text-xl font-semibold">${challenge.penaltyAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-semibold">{completedMembers}/{challenge.members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-semibold">{progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Challenge Progress</span>
              <span className="text-sm text-muted-foreground">{totalDays - daysRemaining} of {totalDays} days</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Members</CardTitle>
              </CardHeader>
              <CardContent>
                <MembersList members={challenge.members} currentUserId="1" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <ProgressChart data={mockChartData} title="Team Progress" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ChallengePage;
