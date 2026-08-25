/** Cartographic Editorial: LocalLens lens-and-pin symbol for navigation and compact identity moments. */
import { cn } from "@/lib/utils";

export function BrandMark({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={cn("relative grid h-10 w-10 place-items-center rounded-[14px] border", inverse ? "border-white/20 bg-white/10" : "border-primary/15 bg-primary/10", className)} aria-hidden="true">
      <span className={cn("h-[18px] w-[18px] rounded-full border-[3px]", inverse ? "border-white" : "border-primary")} />
      <span className={cn("absolute bottom-[7px] right-[7px] h-[8px] w-[8px] rounded-full border-2", inverse ? "border-[#0f2d33] bg-white" : "border-background bg-primary")} />
      <span className={cn("absolute -right-[2px] top-[8px] h-[10px] w-[2px] rotate-45 rounded-full", inverse ? "bg-white/70" : "bg-primary/70")} />
    </span>
  );
}
