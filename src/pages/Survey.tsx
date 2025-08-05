import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface SurveyFormData {
  name: string;
  email: string;
  relationship: string;
  relationshipOther?: string;
  caregivingDuration: string;
  typicalDay: string;
  difficultyRating: string;
  difficultyReason: string;
  emotionalChallenge: string;
  isolationFeelings: string;
  relationshipLearning: string;
  meaningfulConnection: string;
  overwhelmedMemory: string;
  copingMethods: string;
  supportPerson: string;
  supportSystems: string[];
  supportSystemsOther?: string;
  missingSupportNeed: string;
  extraHourUsage: string;
  lostActivity: string;
  additionalThoughts?: string;
}

const Survey = () => {
  console.log("Survey component is rendering");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SurveyFormData>({
    defaultValues: {
      supportSystems: []
    }
  });

  const watchRelationship = form.watch("relationship");
  const watchSupportSystems = form.watch("supportSystems");

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true);

    try {
      // Convert difficulty rating to number for database
      const stressLevel = parseInt(data.difficultyRating);

      // Prepare data for database insertion
      const surveyData = {
        name: data.name,
        email: data.email,
        age_range: data.caregivingDuration,
        gender: "not-specified", // This field doesn't exist in form but required in DB
        relationship_status: data.relationship,
        relationship_other: data.relationshipOther || null,
        support_systems: data.supportSystems.join(", "),
        support_other: data.supportSystemsOther || null,
        stress_level: stressLevel,
        additional_comments: [
          `Typical Day: ${data.typicalDay}`,
          `Difficulty Reason: ${data.difficultyReason}`,
          `Emotional Challenge: ${data.emotionalChallenge}`,
          `Isolation Feelings: ${data.isolationFeelings}`,
          `Relationship Learning: ${data.relationshipLearning}`,
          `Meaningful Connection: ${data.meaningfulConnection}`,
          `Overwhelmed Memory: ${data.overwhelmedMemory}`,
          `Coping Methods: ${data.copingMethods}`,
          `Support Person: ${data.supportPerson}`,
          `Missing Support Need: ${data.missingSupportNeed}`,
          `Extra Hour Usage: ${data.extraHourUsage}`,
          `Lost Activity: ${data.lostActivity}`,
          data.additionalThoughts ? `Additional Thoughts: ${data.additionalThoughts}` : ''
        ].filter(Boolean).join('\n\n')
      };

      const { error } = await supabase
        .from('survey_responses')
        .insert(surveyData);

      if (error) {
        console.error('Error submitting survey:', error);
        toast({
          title: "Error",
          description: "There was a problem submitting your survey. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thank you for sharing your story!",
          description: "Your responses have been submitted successfully.",
        });
        form.reset();
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to My Story Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Story
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Share Your Story
          </h1>
          <p className="text-lg text-muted-foreground">
            Your voice matters. Help us build a community where caregivers are seen and supported.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>We'd love to stay connected with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 1: Your Caregiving Journey */}
            <Card>
              <CardHeader>
                <CardTitle>Section 1: Your Caregiving Journey</CardTitle>
                <CardDescription>Tell us about your background and day-to-day life</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="relationship"
                  rules={{ required: "Please select your relationship" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your relationship to the person you are caring for? *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spouse" id="spouse" />
                            <Label htmlFor="spouse">Spouse/Partner</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="child" id="child" />
                            <Label htmlFor="child">Adult Child</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="parent" id="parent" />
                            <Label htmlFor="parent">Parent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sibling" id="sibling" />
                            <Label htmlFor="sibling">Sibling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchRelationship === "other" && (
                  <FormField
                    control={form.control}
                    name="relationshipOther"
                    rules={{ required: "Please specify your relationship" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify your relationship *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your relationship to the care recipient" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="caregivingDuration"
                  rules={{ required: "Please select duration" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long have you been a caregiver? *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="less-6months" id="less-6months" />
                            <Label htmlFor="less-6months">Less than 6 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6-12months" id="6-12months" />
                            <Label htmlFor="6-12months">6-12 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-3years" id="1-3years" />
                            <Label htmlFor="1-3years">1-3 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3-5years" id="3-5years" />
                            <Label htmlFor="3-5years">3-5 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="more-5years" id="more-5years" />
                            <Label htmlFor="more-5years">More than 5 years</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typicalDay"
                  rules={{ required: "Please describe your typical day" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Could you walk us through a typical day? What tasks or responsibilities take the most of your time and emotional energy? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share as much detail as you'd like about your daily experience..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="difficultyRating"
                    rules={{ required: "Please select a rating" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>On a scale of 1 to 10 (with 10 being the most difficult), how would you rate the overall challenge of your caregiving experience? *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <div key={num} className="flex items-center space-x-2">
                                <RadioGroupItem value={num.toString()} id={`rating-${num}`} />
                                <Label htmlFor={`rating-${num}`}>{num}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyReason"
                    rules={{ required: "Please explain your rating" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why did you choose that number? *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Help us understand what makes this experience challenging for you..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 2: The Emotional & Relational Landscape */}
            <Card>
              <CardHeader>
                <CardTitle>Section 2: The Emotional & Relational Landscape</CardTitle>
                <CardDescription>Help us understand the invisible struggles and emotional bonds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="emotionalChallenge"
                  rules={{ required: "Please share your emotional challenges" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is the most difficult emotional challenge you face as a caregiver? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share what weighs on your heart the most..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isolationFeelings"
                  rules={{ required: "Please share your experience" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you ever feel a sense of isolation or loneliness in your role? If so, what does that feel like? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe those moments when you feel most alone..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationshipLearning"
                  rules={{ required: "Please share what you've learned" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's one thing you've learned about your relationship with your loved one that you never would have known without this experience? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about a discovery or insight about your bond..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meaningfulConnection"
                  rules={{ required: "Please share this moment" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell me about a time when you and your loved one were able to connect in a simple, meaningful way. What did you do, and what did that moment feel like? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share a special moment of connection you treasure..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overwhelmedMemory"
                  rules={{ required: "Please share what sustains you" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When you feel overwhelmed, what's a small memory or thought that you hold on to that reminds you of the love between you and your loved one? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What memory or thought gives you strength in difficult moments..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 3: Coping & Community */}
            <Card>
              <CardHeader>
                <CardTitle>Section 3: Coping & Community</CardTitle>
                <CardDescription>Tell us about your support systems and what you need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="copingMethods"
                  rules={{ required: "Please share your coping strategies" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are some of the ways you have found to cope with the emotional and mental challenges of caregiving? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share the strategies that help you get through tough times..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportPerson"
                  rules={{ required: "Please share about your support" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When you need to talk to someone who truly understands, who or where do you turn to? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your sources of understanding and support..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportSystems"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What kinds of support systems have you used? (Select all that apply) *</FormLabel>
                      <div className="space-y-3">
                        {[
                          { id: "online-groups", label: "Online support groups" },
                          { id: "therapy", label: "In-person therapy" },
                          { id: "friends-family", label: "Friends/Family" },
                          { id: "respite-care", label: "Respite care" },
                          { id: "nothing", label: "Nothing" },
                          { id: "other", label: "Other" }
                        ].map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, option.id]);
                                } else {
                                  field.onChange(currentValue.filter((value) => value !== option.id));
                                }
                              }}
                            />
                            <Label htmlFor={option.id}>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchSupportSystems?.includes("other") && (
                  <FormField
                    control={form.control}
                    name="supportSystemsOther"
                    rules={{ required: "Please specify other support systems" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify other support systems you've used *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter other support systems you've used" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="missingSupportNeed"
                  rules={{ required: "Please share what's missing" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you think is the biggest thing missing for caregivers, in terms of support? What would make you feel most understood and less alone? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What kind of support would truly make a difference for you..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extraHourUsage"
                  rules={{ required: "Please share how you'd spend extra time" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>If you had an extra hour in your day, what would you spend it on? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What would you do just for yourself..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lostActivity"
                  rules={{ required: "Please share what you miss" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is one thing you used to love doing before caregiving that you no longer have time for? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What activity or hobby do you miss most..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Thoughts Section */}
            <Card>
              <CardHeader>
                <CardTitle>Share More</CardTitle>
                <CardDescription>We'd love to hear anything else you'd like to share</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="additionalThoughts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is there anything else you would like to share?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share any additional thoughts, experiences, or feelings you'd like us to know about your caregiving journey..."
                          className="min-h-[120px] resize-none"
                          style={{
                            minHeight: '120px',
                            height: 'auto',
                            overflow: 'hidden'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.max(120, target.scrollHeight)}px`;
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? "Submitting..." : "Share My Story"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Thank You Message */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-primary">Thank You For Sharing Your Heart</h3>
              <p className="text-muted-foreground leading-relaxed">
                In opening your heart, you've shown us the profound love that exists between caregivers and survivors—
                a bond that transcends the daily challenges and finds strength in shared vulnerability. Your story illuminates
                the beautiful, complex dance of care that weaves two lives together, even in the most difficult moments.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every word you've shared helps us understand not just the burden of caregiving, but the deep emotional
                connection that makes it sacred. You've reminded us that behind every act of care is a relationship
                built on love, hope, and unwavering commitment to one another.
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Together, we honor the bond between you and your loved one. Thank you for trusting us with your story.
              </p>

              <div className="mt-6 pt-6 border-t border-primary/20">
                <p className="text-muted-foreground mb-4">
                  If you're open, I'd love to hear your story directly
                </p>
                <a
                  href="https://calendly.com/sia-sanjeevaniai/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Schedule a Conversation
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Survey;