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
      className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col pt-32"
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

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-foreground max-w-5xl leading-[0.9] mb-10">
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
          className="text-lg md:text-xl text-foreground font-semibold max-w-2xl mb-12 opacity-80"
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
            <div className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-2xl border border-border">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Find a local shop..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-muted-foreground/50"
                />
              </div>
              <Button asChild className="rounded-xl bg-orange-600 hover:bg-orange-500 font-bold px-8 py-5">
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
