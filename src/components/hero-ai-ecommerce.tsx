import { motion } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { CreditCard, LogIn } from 'lucide-react'
import { EcommerceDash } from '../assets'
import { TimelineAnimation } from '@/components/timeline-animation'
import { useMediaQuery } from '@/components/use-media-query'
import MotionDrawer from '@/components/motion-drawer'

interface HeroAiEcommerceProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  ctaText?: string;
  showNav?: boolean;
  showHero?: boolean;
}

export const HeroAiEcommerce = ({ 
  children,
  title = <>Empower Your Learning <br className="sm:inline-block hidden" /> With AI Communities</>,
  subtitle = "Join AI-powered course communities that help you study faster, collaborate with peers, and excel in your classes.",
  badge = "Locably Platform",
  ctaText = "Start Your 14 Day Free Trial",
  showNav = false,
  showHero = true
}: HeroAiEcommerceProps) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')



  return (
    <section
      ref={timelineRef}
      className="min-h-screen text-foreground bg-background relative overflow-hidden flex flex-col items-center"
    >
      <div className="absolute inset-0 z-0 bg-orange-50/30">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-orange-200/60 blur-[100px]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-orange-300/40 blur-[100px]"
          animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-1/4 left-1/2 w-[50%] h-[50%] rounded-full bg-orange-200/50 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Mobile Navigation */}
      {isMobile && showNav && (
        <div className="flex gap-4 justify-between items-center px-10 pt-4 relative z-10 w-full">
          <MotionDrawer
            direction="left"
            width={300}
            backgroundColor={'var(--background)'}
            clsBtnClassName="bg-neutral-800 border-r border-neutral-900 text-white"
            contentClassName="bg-card border-r border-border text-foreground"
            btnClassName="bg-card text-foreground relative w-fit p-2 left-0 top-0 rounded-full shadow-xs border border-border"
          >
            <nav className="space-y-4 ">
              <div className="flex items-center gap-2 text-black">
                <svg viewBox="0 0 24 24" fill="none" className="stroke-black w-8 h-8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-bold text-xl tracking-tight">Locably</span>
              </div>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                Our Service
              </a>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                About Us
              </a>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-200 hover:text-black rounded-sm"
              >
                Contact
              </a>
            </nav>
          </MotionDrawer>
          <TimelineAnimation
            as="button"
            animationNum={2}
            timelineRef={timelineRef}
            className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-xs border border-neutral-200 text-sm font-medium"
          >
            <LogIn size={16} /> Sign in
          </TimelineAnimation>
        </div>
      )}

      {/* Navigation */}
      {!isMobile && showNav && (
        <header className="w-full relative z-10 max-w-5xl mx-auto flex items-center justify-between px-6 py-6">
          <TimelineAnimation
            as="nav"
            animationNum={1}
            timelineRef={timelineRef}
            className="flex items-center gap-8 bg-white px-6 py-3 rounded-full shadow-xs border border-neutral-200"
          >
            <div className="text-2xl font-extrabold text-[#5d5dff]">
               <svg viewBox="0 0 24 24" fill="none" className="stroke-orange-600 w-8 h-8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-800">
              <a href="#" className="hover:text-orange-500">
                How It Works
              </a>
              <a href="#" className="hover:text-orange-500">
                Internships
              </a>
              <a href="#" className="hover:text-orange-500">
                Students
              </a>
              <a href="#" className="hover:text-orange-500">
                Professors
              </a>
              <a href="#" className="hover:text-orange-500">
                FAQs
              </a>
            </nav>
          </TimelineAnimation>
          <div className="flex items-center gap-3">
            <TimelineAnimation
              as="button"
              animationNum={2}
              timelineRef={timelineRef}
              className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-full shadow-xs border border-border text-sm font-medium text-foreground"
            >
              <LogIn size={16} /> Sign in
            </TimelineAnimation>
          </div>
        </header>
      )}

      {/* Hero Body */}
      {showHero && (
        <div className="text-center relative px-4 pt-16 pb-12 z-10">
          <TimelineAnimation
            as="h1"
            animationNum={3}
            timelineRef={timelineRef}
            className="sm:text-6xl text-5xl md:text-7xl font-medium tracking-tight text-foreground mb-8"
          >
            {title}
            {badge && (
              <div className="mt-4 flex justify-center">
                <TimelineAnimation
                  as="span"
                  animationNum={4}
                  timelineRef={timelineRef}
                  className="relative inline-block border-2 border-orange-500 px-4 py-1 bg-orange-100 text-orange-500 rounded-md text-sm md:text-base font-bold"
                >
                  {badge}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-orange-500"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-orange-500"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-orange-500"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-orange-500"></div>
                </TimelineAnimation>
              </div>
            )}
          </TimelineAnimation>
          
          <TimelineAnimation
            as="p"
            animationNum={5}
            timelineRef={timelineRef}
            className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto mb-5 font-normal leading-relaxed"
          >
            {subtitle}
          </TimelineAnimation>
          
          <div className="flex flex-col items-center gap-6">
            <TimelineAnimation
              as="button"
              animationNum={6}
              timelineRef={timelineRef}
              className="p-1.5 bg-linear-to-t from-orange-800 to-orange-100 h-20 rounded-full"
            >
              <span className="bg-linear-to-l from-orange-500 to-orange-600 shadow-[inset_4px_4px_5px_0px_rgba(168,170,241,0.5),inset_-1px_-2px_5px_0px_rgba(74,78,197,0.5),inset_-1px_4px_8px_0px_rgba(44,58,98,0.25)] text-white px-10 py-5 rounded-full text-lg font-semibold cursor-pointer">
                {ctaText}
              </span>
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={6}
              timelineRef={timelineRef}
              className="text-neutral-600 text-sm flex items-center gap-2 font-medium"
            >
              <CreditCard size={16} /> No Credit Card Required
            </TimelineAnimation>
          </div>
        </div>
      )}

      {/* Dashboard Preview */}
      <div className="w-full max-w-7xl mx-auto rounded-xl relative mt-10">
        <TimelineAnimation
          animationNum={7}
          timelineRef={timelineRef}
          className="rounded-2xl bg-card/50 backdrop-blur-lg p-4 border border-border"
        >
          {children ? (
            children
          ) : (
            <TimelineAnimation
              animationNum={8}
              as="img"
              timelineRef={timelineRef}
              // @ts-ignore
              src={EcommerceDash?.src}
              alt="phoneMockUP"
              className="w-full relative z-4 rounded-2xl"
            />
          )}
        </TimelineAnimation>
      </div>
    </section>
  )
}
