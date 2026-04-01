import React, { useRef } from 'react'
import { Apple, ArrowDownCircle, MapPin, Search } from 'lucide-react'
import { TimelineAnimation } from '@/components/timeline-animation'
import { useMediaQuery } from '@/components/use-media-query'
import MotionDrawer from '@/components/motion-drawer'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

export const LocablyHero = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <section
      ref={timelineRef}
      className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col pt-24 md:pt-32"
    >
      {/* Navbar handled globally */}

      <TimelineAnimation
        timelineRef={timelineRef}
        animationNum={1}
        className="absolute inset-0 z-0 opacity-100 dark:opacity-20"
        style={{
          background:
            'radial-gradient(125% 125% at 50% 90%, hsl(var(--background)) 40%, #ea580c 100%)', // Using orange/primary shade
        }}
      />
      <div className="relative z-10 grow flex flex-col items-center justify-center text-center px-4 pt-4">

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-foreground max-w-5xl leading-[0.95] md:leading-[0.9] mb-8 md:mb-10 px-2">
          <TimelineAnimation
            as="span"
            timelineRef={timelineRef}
            animationNum={4}
          >
            Discover What’s
          </TimelineAnimation>
          <br />
          <TimelineAnimation
            as="span"
            timelineRef={timelineRef}
            animationNum={5}
            className="text-primary italic"
          >
            Around You.
          </TimelineAnimation>
        </h1>

        <TimelineAnimation
          as="p"
          timelineRef={timelineRef}
          animationNum={6}
          className="text-base md:text-xl text-foreground font-semibold max-w-2xl mb-8 md:mb-12 opacity-80 px-4"
        >
          Connecting you with the heart of your community, from artisan bakeries to organic local groceries.
        </TimelineAnimation>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mx-auto px-4">
          <TimelineAnimation
            as="div"
            timelineRef={timelineRef}
            animationNum={7}
            className="w-full"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-card p-1.5 md:p-2 shadow-2xl border border-border">
              <div className="flex flex-1 items-center gap-2 px-2 md:px-3">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Find a local shop..."
                  className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm font-bold placeholder:text-muted-foreground/50"
                />
              </div>
              <Button asChild className="rounded-xl bg-orange-600 hover:bg-orange-500 font-bold px-4 md:px-8 py-4 md:py-5 text-xs md:text-sm h-auto">
                 <Link to="/explore">Search</Link>
              </Button>
            </div>
          </TimelineAnimation>
        </div>

        {/* Images removed */}
      </div>
    </section>
  )
}
