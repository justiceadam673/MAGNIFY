import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown, TrendingUp, Heart, Sparkles, ChevronRight } from "lucide-react";

const Landing = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background via-background to-secondary'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-primary opacity-5' />
        <div className='container mx-auto px-4 pt-20 pb-32 relative'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
              <Sparkles className='h-4 w-4 text-primary' />
              <span className='text-sm font-medium text-primary'>
                Workbook for Christian Stewards
              </span>
            </div>

            <h1 className='text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-primary to-gold bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>
              Magnify Your Vision
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
              A beautiful, faith-centered digital workbook to steward your
              spiritual giving, personal growth, and financial goals with
              purpose and clarity.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300'>
              <Button asChild size='lg' className='text-lg shadow-elegant'>
                <Link to='/signup'>
                  Start Your Journey <ChevronRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button asChild size='lg' variant='outline' className='text-lg'>
                <Link to='/login'>Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-20 container mx-auto px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-serif font-bold mb-4'>
              Three Visions, One Purpose
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Track what matters most with purpose-built tools for spiritual,
              personal, and financial stewardship.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-gold transition-smooth'>
              <div className='w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6'>
                <Heart className='h-7 w-7 text-primary' />
              </div>
              <h3 className='text-2xl font-serif font-bold mb-4'>
                God's Will Vision
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Track your spiritual giving habits, commitments, and
                worship-focused goals. Honor your tithes, offerings, and
                sacrificial giving with intentionality.
              </p>
            </div>

            <div className='bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-gold transition-smooth'>
              <div className='w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6'>
                <Sparkles className='h-7 w-7 text-gold' />
              </div>
              <h3 className='text-2xl font-serif font-bold mb-4'>
                Personal Vision
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Cultivate character and build Christ-centered habits. Track
                commitments, break old patterns, and celebrate every step of
                transformation.
              </p>
            </div>

            <div className='bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-gold transition-smooth'>
              <div className='w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6'>
                <TrendingUp className='h-7 w-7 text-accent' />
              </div>
              <h3 className='text-2xl font-serif font-bold mb-4'>
                Financial Vision
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Set goals, track milestones, and steward your resources wisely.
                Visualize progress and celebrate faithful financial stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 container  mx-auto px-4'>
        <div className='max-w-4xl mx-auto bg-gradient-primary bg-primary/80 rounded-3xl p-12 text-center shadow-elegant'>
          <Crown className='h-16 w-16 text-primary-foreground mx-auto mb-6' />
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6'>
            Every faithful step matters
          </h2>
          <p className='text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto'>
            Start stewarding your visions today with daily trackers, progress
            charts, and reflections designed for faith-driven growth.
          </p>
          <Button asChild size='lg' variant='secondary' className='text-lg'>
            <Link to='/signup'>
              Create Your Free Account <ChevronRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
