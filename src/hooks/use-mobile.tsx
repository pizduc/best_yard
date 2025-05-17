
import * as React from "react"

// Common device breakpoints
export const MOBILE_BREAKPOINT = 768      // Standard mobile breakpoint
export const TABLET_BREAKPOINT = 1024     // Standard tablet breakpoint
export const LAPTOP_BREAKPOINT = 1440     // Standard laptop breakpoint

// Common smartphone diagonals in inches
export const SMARTPHONE_DIAGONALS = [
  { size: 4.7, description: "iPhone SE" },
  { size: 5.4, description: "iPhone 13 Mini" },
  { size: 5.8, description: "iPhone X/XS/11 Pro" },
  { size: 6.1, description: "iPhone XR/11/12/13/14" },
  { size: 6.4, description: "Google Pixel 6" },
  { size: 6.7, description: "iPhone 12/13/14 Pro Max" },
  { size: 6.8, description: "Samsung Galaxy S22 Ultra" },
  { size: 7.6, description: "Samsung Galaxy Z Fold" },
];

// Common tablet diagonals in inches
export const TABLET_DIAGONALS = [
  { size: 8.3, description: "iPad Mini" },
  { size: 10.2, description: "iPad" },
  { size: 10.9, description: "iPad Air" },
  { size: 11, description: "iPad Pro 11" },
  { size: 12.9, description: "iPad Pro 12.9" },
  { size: 14.6, description: "Samsung Galaxy Tab S8 Ultra" },
];

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    )
    const onChange = () => {
      setIsTablet(
        window.innerWidth >= MOBILE_BREAKPOINT && 
        window.innerWidth < TABLET_BREAKPOINT
      )
    }
    mql.addEventListener("change", onChange)
    setIsTablet(
      window.innerWidth >= MOBILE_BREAKPOINT && 
      window.innerWidth < TABLET_BREAKPOINT
    )
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>('desktop')

  React.useEffect(() => {
    const updateDeviceSize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setDeviceSize('mobile')
      } else if (width < TABLET_BREAKPOINT) {
        setDeviceSize('tablet')
      } else if (width < LAPTOP_BREAKPOINT) {
        setDeviceSize('laptop')
      } else {
        setDeviceSize('desktop')
      }
    }

    window.addEventListener('resize', updateDeviceSize)
    updateDeviceSize() // Initial check
    
    return () => window.removeEventListener('resize', updateDeviceSize)
  }, [])

  return deviceSize
}
