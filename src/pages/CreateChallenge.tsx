// src/pages/CreateChallenge.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Trophy } from "lucide-react";
import { format, addDays, parseISO, isAfter } from "date-fns";
import DOMPurify from "dompurify";

import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { challengeApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

const getTodayString = () => format(new Date(), "yyyy-MM-dd");

const CreateChallenge: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dailyTarget, setDailyTarget] = useState("2");
  const [difficulty, setDifficulty] = useState("any");
  const [penaltyAmount, setPenaltyAmount] = useState("5");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const today = getTodayString();
  const minEndDate = startDate ? format(addDays(parseISO(startDate), 1), "yyyy-MM-dd") : today;

  // ==============================
  // Validation
  // ==============================
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Challenge name is required";
    if (!dailyTarget || parseInt(dailyTarget, 10) < 1) newErrors.dailyTarget = "Daily target must be at least 1";
    if (!penaltyAmount || parseInt(penaltyAmount, 10) < 0) newErrors.penaltyAmount = "Penalty must be 0 or more";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) newErrors.endDate = "End date must be after start date";

    if (startDate && startDate < today) newErrors.startDate = "Start date cannot be in the past";
    if (endDate && endDate < today) newErrors.endDate = "End date cannot be in the past";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // Submit Handler
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Map difficulty
      const difficultyFilter: string[] =
        difficulty === "easy" ? ["Easy"] :
        difficulty === "medium" ? ["Medium"] :
        difficulty === "hard" ? ["Hard"] : [];

      const response = await challengeApi.create({
        name,
        description: description || `${name} - Solve ${dailyTarget} problem(s) daily`,
        minSubmissionsPerDay: parseInt(dailyTarget, 10),
        difficultyFilter,
        uniqueProblemConstraint: true,
        penaltyAmount: parseInt(penaltyAmount, 10),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        visibility,
      });

      if (response.success) {
        toast({
          title: "Challenge created!",
          description: "Your challenge has been created successfully.",
        });
        navigate("/");
      } else {
        throw new Error(response.message || "Failed to create challenge");
      }
    } catch (error: unknown) {
      toast({
        title: "Failed to create challenge",
        description: DOMPurify.sanitize(getErrorMessage(error)),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Challenge</CardTitle>
                <CardDescription>Set up a coding challenge to compete with friends</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Challenge Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., January Grind"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your challenge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Daily Target & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyTarget">Daily Target</Label>
                  <Input
                    id="dailyTarget"
                    type="number"
                    min="1"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(e.target.value)}
                    className={errors.dailyTarget ? "border-destructive" : ""}
                  />
                  {errors.dailyTarget && <p className="text-xs text-destructive">{errors.dailyTarget}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Minimum Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Difficulty</SelectItem>
                      <SelectItem value="easy">Easy Only</SelectItem>
                      <SelectItem value="medium">Medium Only</SelectItem>
                      <SelectItem value="hard">Hard Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Penalty */}
              <div className="space-y-2">
                <Label htmlFor="penaltyAmount">Penalty Amount ($)</Label>
                <Input
                  id="penaltyAmount"
                  type="number"
                  min="0"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value)}
                  className={errors.penaltyAmount ? "border-destructive" : ""}
                />
                {errors.penaltyAmount && <p className="text-xs text-destructive">{errors.penaltyAmount}</p>}
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setStartDate(newStart);
                      if (endDate && !isAfter(parseISO(endDate), parseISO(newStart))) setEndDate("");
                    }}
                    className={errors.startDate ? "border-destructive" : ""}
                  />
                  {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    min={minEndDate}
                    value={endDate}
                    disabled={!startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={errors.endDate ? "border-destructive" : ""}
                  />
                  {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as "PUBLIC" | "PRIVATE")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PUBLIC" id="public" />
                    <Label htmlFor="public" className="cursor-pointer">Public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PRIVATE" id="private" />
                    <Label htmlFor="private" className="cursor-pointer">Private</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary"
                  disabled={
                    isLoading ||
                    Object.keys(errors).length > 0 ||
                    !name || !dailyTarget || !penaltyAmount || !startDate || !endDate
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Challenge"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateChallenge;