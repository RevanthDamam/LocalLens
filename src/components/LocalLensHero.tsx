import React, { useRef } from 'react'
import { Apple, ArrowDownCircle, MapPin, Search } from 'lucide-react'
import { TimelineAnimation } from '@/components/timeline-animation'
import { useMediaQuery } from '@/components/use-media-query'
import MotionDrawer from '@/components/motion-drawer'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

export const LocalLensHero = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <section
      ref={timelineRef}
      className="min-h-screen bg-slate-50 text-neutral-900 relative overflow-hidden flex flex-col pt-0"
    >
      {/* Mobile Navigation - Integrated with LocalLens */}
      {isMobile && (
        <div className="flex gap-4 justify-between items-center px-10 pt-4 relative z-50">
          <MotionDrawer
            direction="left"
            width={300}
            backgroundColor={'#ffffff'}
            clsBtnClassName="bg-neutral-800 border-r border-neutral-900 text-white"
            contentClassName="bg-white border-r border-neutral-200 text-black"
            btnClassName="bg-white text-black relative w-fit p-2 left-0 top-0 rounded-full shadow-xs border border-neutral-200"
          >
            <nav className="space-y-4 ">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-8 h-8" />
                <span className="font-display font-bold text-xl">LocalLens</span>
              </div>
              <Link
                to="/explore"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                Explore
              </Link>
              <Link
                to="/categories"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                Categories
              </Link>
              <Link
                to="/merchant"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                Merchant Portal
              </Link>
              <Link
                to="#"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                About Us
              </Link>
            </nav>
          </MotionDrawer>
          <button className="cursor-pointer bg-primary text-white px-4 py-2 relative z-10 rounded-full font-bold text-xs shadow-xl flex items-center gap-2 transition uppercase tracking-wider">
            Join Now
          </button>
        </div>
      )}

      {/* Navbar */}
      {!isMobile && (
        <header className="relative z-50 w-full max-w-7xl mx-auto px-10 py-10 flex items-center justify-between">
          <TimelineAnimation
            timelineRef={timelineRef}
            animationNum={0}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="w-8 h-8" />
              <span className="font-display font-bold text-2xl">LocalLens</span>
            </div>
          </TimelineAnimation>
          <TimelineAnimation
            as="nav"
            timelineRef={timelineRef}
            animationNum={1}
            className="hidden md:flex items-center gap-10 text-sm text-neutral-800 font-semibold"
          >
            <Link to="/explore" className="hover:text-primary transition">
              Explore
            </Link>
            <Link to="/categories" className="hover:text-primary transition">
              Categories
            </Link>
            <Link to="/merchant" className="hover:text-primary transition">
              Become a Merchant
            </Link>
          </TimelineAnimation>
          <TimelineAnimation
            as="div"
            timelineRef={timelineRef}
            animationNum={2}
          >
            <Button asChild className="cursor-pointer bg-primary text-white px-6 py-5 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 transition hover:scale-105">
              <Link to="/explore">Explore Map</Link>
            </Button>
          </TimelineAnimation>
        </header>
      )}

      <TimelineAnimation
        timelineRef={timelineRef}
        animationNum={1}
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(125% 125% at 50% 90%, #fff 40%, #ea580c 100%)', // Using orange/primary shade
        }}
      />
      <div className="relative z-10 grow flex flex-col items-center justify-center text-center px-4 pt-10">
        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={3}
          className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-200 shadow-sm mb-8"
        >
          <div className="flex -space-x-3">
            <img
              className="w-7 h-7 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              alt="User"
            />
            <img
              className="w-7 h-7 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
              alt="User"
            />
            <img
              className="w-7 h-7 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="User"
            />
          </div>
          <span className="text-sm font-bold text-orange-800">
            Trusted by 5,000+ Local Shoppers
          </span>
        </TimelineAnimation>

        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-neutral-800 max-w-5xl leading-[0.9] mb-10">
          <TimelineAnimation
            as="span"
            timelineRef={timelineRef}
            animationNum={4}
          >
            Discover Local,
          </TimelineAnimation>
          <br />
          <TimelineAnimation
            as="span"
            timelineRef={timelineRef}
            animationNum={5}
          >
            Empower Your City
          </TimelineAnimation>
        </h1>

        <TimelineAnimation
          as="p"
          timelineRef={timelineRef}
          animationNum={6}
          className="text-xl md:text-2xl text-neutral-800 font-bold max-w-2xl mb-12"
        >
          Connecting you with the heart of your community, from artisan bakeries to organic local groceries.
        </TimelineAnimation>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-24">
          <TimelineAnimation
            as="div"
            timelineRef={timelineRef}
            animationNum={7}
          >
            <div className="mx-auto flex max-w-lg items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl border border-neutral-100">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search local shops..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button asChild className="cursor-pointer rounded-xl font-body bg-primary hover:bg-primary/90">
                <Link to="/explore" className="gap-2">
                  Find Shops
                </Link>
              </Button>
            </div>
          </TimelineAnimation>
        </div>

        {/* Floating Cards */}
        <div className="relative w-full max-w-7xl h-[300px]">
          <TimelineAnimation
            as="div"
            timelineRef={timelineRef}
            animationNum={9}
            className="absolute left-0 bottom-[-100px] w-105 h-96 bg-white rounded-4xl shadow-2xl overflow-hidden transform rotate-[-15deg] translate-x-12 translate-y-12 border-4 border-white hidden lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1000&auto=format&fit=crop"
              alt="Market"
              className="w-full h-full object-cover"
            />
          </TimelineAnimation>
          <TimelineAnimation
            as="div"
            timelineRef={timelineRef}
            animationNum={10}
            className="absolute left-1/2 -translate-x-1/2 bottom-[-150px] w-100 h-[450px] bg-white rounded-4xl shadow-2xl z-20 overflow-hidden border-4 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
              alt="Shop Interior"
              className="w-full h-full object-cover"
            />
          </TimelineAnimation>
          <TimelineAnimation
            as="div"
            timelineRef={timelineRef}
            animationNum={11}
            className="absolute right-0 bottom-[-100px] w-105 h-96 bg-white rounded-4xl shadow-2xl overflow-hidden transform rotate-15 -translate-x-12 translate-y-12 border-4 border-white hidden lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
              alt="Groceries"
              className="w-full h-full object-cover"
            />
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}
