'use client';

import { useState } from 'react';
import type { z } from 'zod';
import { getRecommendations } from '@/app/dashboard/actions';
import { OnboardingForm, onboardingSchema } from '@/components/onboarding-form';
import RecommendationDashboard from '@/components/recommendation-dashboard';
import type { Recommendation } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async (values: z.infer<typeof onboardingSchema>) => {
    setIsLoading(true);
    try {
      const result = await getRecommendations(values);
      if (result && result.length > 0) {
        setRecommendations(result);
      } else {
        toast({
          title: "No recommendations found",
          description: "We couldn't find any books based on your interests. Please try being more specific.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to fetch recommendations. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations(null);
  }

  if (isLoading && !recommendations) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Icons.logo className="h-16 w-16 animate-pulse text-primary" />
          <h2 className="font-headline text-3xl">Brewing your personal library...</h2>
          <p className="text-lg text-muted-foreground">Our AI is analyzing your tastes to find the perfect reads.</p>
          <Loader2 className="mt-4 h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return <OnboardingForm onSubmit={handleGetRecommendations} isLoading={isLoading} />;
  }

  return <RecommendationDashboard recommendations={recommendations} onReset={handleReset} />;
}
