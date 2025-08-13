'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { genres } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from './icons';

export const onboardingSchema = z.object({
  age: z.string().optional(),
  country: z.string().optional(),
  genres: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one genre.',
  }),
  interests: z.string().min(20, {
    message: 'Please describe your interests in at least 20 characters.',
  }),
  favorites: z.string().optional(),
});

type OnboardingFormProps = {
  onSubmit: (values: z.infer<typeof onboardingSchema>) => void;
  isLoading: boolean;
};

export function OnboardingForm({ onSubmit, isLoading }: OnboardingFormProps) {
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      genres: [],
      interests: '',
      favorites: '',
      age: '',
      country: '',
    },
  });

  return (
    <div className="min-h-screen w-full bg-background p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Icons.logo className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Create Your Literary Profile</CardTitle>
              <CardDescription className="text-md">
                Tell us about your reading tastes, and our AI will find books you'll love.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">1. Select Your Favorite Genres</h3>
                <FormField
                  control={form.control}
                  name="genres"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {genres.map(item => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="genres"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">2. Describe Your Interests</h3>
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you love in a book?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I love books with strong female protagonists and complex political intrigue,' or 'I want something funny and lighthearted about space travel.'"
                          className="min-h-[120px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the most important part! The more detail, the better the recommendations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">3. Optional Details</h3>
                <FormField
                  control={form.control}
                  name="favorites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List a few books or authors you've previously enjoyed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Lord of the Rings, Neil Gaiman, ..." {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Range</FormLabel>
                        <FormControl>
                           <Input placeholder="e.g., 25-34" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                           <Input placeholder="e.g., United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full font-headline text-lg" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Find My Books'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
