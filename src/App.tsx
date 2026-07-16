import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import { router } from './routes'

export const App: React.FC = () => {
  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* Toast provider styled with custom dark-first glass rules */}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(9, 9, 9, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            color: '#FFFFFF',
            borderRadius: '18px',
          },
          className: 'font-sans font-medium',
        }}
      />
      
      {/* App Routers Provider */}
      <RouterProvider router={router} />
    </>
  )
}
export default App
