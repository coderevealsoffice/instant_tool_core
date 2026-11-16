"use client"

import { useEffect, useRef, useState } from "react"

interface AdSlotProps {
  slotId: string
  className?: string
}

export function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<{ isPro: boolean } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/user/is-pro")
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to check pro status", err)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    // Only initialize ads if user is NOT a pro member and we have finished loading
    if (isLoading || !data || data.isPro || !adRef.current) return;

    const currentAdRef = adRef.current;
    let initialized = false;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      // Ensure the ad slot has some width before pushing
      if (entry.isIntersecting && !initialized) {
        // Double check width after a short delay to allow layout to settle
        setTimeout(() => {
          if (currentAdRef && currentAdRef.clientWidth > 0) {
            initialized = true;
            try {
              // @ts-ignore
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              console.log(`AdSlot initialized for slot ID: ${slotId}`);
            } catch (e) {
              console.warn("AdSense push failed:", e);
            }
          }
        }, 200);
        observer.unobserve(currentAdRef);
      }
    }, { threshold: 0 });

    observer.observe(currentAdRef);

    return () => {
      observer.disconnect();
    };
  }, [slotId, isLoading, data])

  // Don't render the ad slot at all if they are a Pro user
  if (data?.isPro) {
    return null
  }

  // Optionally, you can return null or a skeleton while loading
  if (isLoading) {
    return <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center ${className}`} style={{ minHeight: "100px" }} />
  }

  const isNumericSlot = /^\d+$/.test(slotId)

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1.5 select-none">
        Advertisement
      </span>
      <div 
        ref={adRef} 
        className="w-full overflow-hidden flex items-center justify-center min-h-[90px] bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/60"
      >
        <ins 
          className="adsbygoogle"
          style={{ display: "block", minWidth: "250px", width: "100%", textAlign: "center" }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1199452179361457"}
          {...(isNumericSlot ? { "data-ad-slot": slotId } : {})}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  )
}
