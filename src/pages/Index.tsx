import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl pb-32 md:pb-12">
        {/* Hero Section with Image */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img
              src="/uploads/Suneeta.png"
              alt="Caregiver Story"
              className="mx-auto rounded-full w-48 h-48 object-cover shadow-lg border-4 border-primary/20"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
            <span className="drop-shadow-lg">My</span> <span className="drop-shadow-lg">Story.</span> <span className="drop-shadow-lg">Your</span> <span className="drop-shadow-lg">Story.</span> <span className="drop-shadow-lg">Our</span> <span className="drop-shadow-lg">Story.</span>
            <span className="block text-primary mt-2"><span className="drop-shadow-lg">Our</span> <span className="drop-shadow-lg">Community.</span></span>
          </h1>

          <p className="text-xl text-muted-foreground font-medium mb-6">
            I have a story I want to share with you.
          </p>

          <a
            href="https://calendly.com/sia-sanjeevaniai/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="cta" size="lg" className="text-lg px-6 py-3 font-semibold">
              Let's Talk
            </Button>
          </a>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border">
            <p className="text-base md:text-lg leading-relaxed text-foreground mb-6">
              Once upon a time… it all began with a BIG dream. The American Dream. I came to the U.S. from India, chasing a Ph.D. and a beautiful life. But on October 4th, 2022, a cancer diagnosis changed everything.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground mb-6">
              My husband became my caregiver, my unwavering support system, while we were far from home with no family or friends nearby. The burden of my constant medical needs—the surgeries, the treatments, the daily leakages from my ostomy bag—took over our lives. He had to manage our children, our home, his job, and all my doctor's appointments back to back. I was so consumed by being a survivor, that I lost focus on our emotional bond. In my struggle to survive, I stopped seeing him as my husband and only saw him as my caregiver. I didn't realize that while he was taking care of my body and all these tasks, the person he was was slowly disappearing.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground mb-6">
              Then one night, I found him in the dark. I was shocked to find him sitting alone, overwhelmed and broken from the stress. He told me, he was going to lose his job. For a few days, it felt like there was a huge earthquake, everything is over. In my pain, I even told him, "I don't want to live." He looked at me and said, "Just hang in there. Don't give up."
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground mb-6">
              My husband's struggle gave me a profound realization: while everyone was focused on the survivor, no one was asking who was taking care of the caregiver. I was so caught up in my role as the patient, that I had forgotten to see the human being in front of me. Even through his own misery, he was still worried about me. I asked him honestly if he ever wished he didn't have to take care of me. He said yes, those thoughts had come to him many times, but he could never leave.
            </p>

            <p className="text-lg md:text-xl font-semibold text-primary mb-6">
              This is my story. What's yours?
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground mb-6">
              My mission is to build a community. A place where our stories are heard, and our experiences are shared. I am not building a product; I am listening to understand the true needs of caregivers so we can build a space where we all feel seen again.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Share your story with me. Your voice will be our direction.
            </p>
          </div>
        </div>

        {/* Call to Action - Desktop */}
        <div className="text-center hidden md:block">
          <Link to="/survey">
            <Button
              variant="cta-pink"
              size="lg"
              className="text-lg px-8 py-4 font-semibold"
              onClick={() => console.log("Survey button clicked, navigating to /survey")}
            >
              Share Your Story - Take Our Survey
            </Button>
          </Link>

          <div className="mt-6">
            <a
              href="https://calendly.com/sia-sanjeevaniai/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="cta" size="lg" className="text-lg px-6 py-3 font-semibold">
                Not ready to share your story in writing? Let's talk instead.
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Your voice matters. Let's build Our Story. Our Community where the relationship is seen and supported.
          </p>
        </div>
      </div>

      {/* Fixed CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
        <div className="container mx-auto max-w-4xl">
          <Link to="/survey">
            <Button
              variant="cta-pink"
              size="lg"
              className="w-full text-base font-semibold py-4"
              onClick={() => console.log("Survey button clicked, navigating to /survey")}
            >
              Share Your Story - Take Our Survey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;