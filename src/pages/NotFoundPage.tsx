import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Home, Sparkles, LogIn } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/layout/PageTransition'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6 relative select-none">
        {/* Background Premium Editorial Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-orange-primary/5 blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-orange-secondary/5 blur-[100px]" />
        </div>

        {/* Brand Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-3 mb-8 z-10"
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-orange-primary to-orange-secondary flex items-center justify-center shadow-orange-glow">
            <Sparkles size={22} className="text-white" />
          </div>
          <span className="font-sans font-bold tracking-[0.25em] text-xs uppercase text-text-primary">
            WORKFORHUB WORKSPACE
          </span>
        </motion.div>

        {/* Main 404 Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="w-full max-w-[480px] z-10"
        >
          <Card glow hoverLift={false} className="glass-morphic shadow-premium p-8 relative overflow-hidden">
            <CardHeader className="p-0 pb-6 text-center">
              {/* Massive 404 Typo */}
              <div className="relative inline-block mb-4">
                <span className="font-display text-8xl md:text-9xl leading-none tracking-tighter bg-gradient-to-r from-orange-primary to-orange-secondary bg-clip-text text-transparent select-none filter drop-shadow-sm">
                  404
                </span>
                <span className="absolute -top-1 -right-4 h-3 w-3 rounded-full bg-orange-primary shadow-orange-glow animate-pulse" />
              </div>
              <CardTitle className="font-sans font-bold text-2xl tracking-tight text-text-primary mt-2">
                MODULE NOT RESOLVED
              </CardTitle>
              <CardDescription className="text-text-secondary text-sm font-sans font-normal mt-3 leading-relaxed max-w-sm mx-auto">
                The requested URL path, database index, or system route could not be loaded by the security console.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex flex-col items-center">
              {/* Error Notice Box */}
              <div className="w-full flex items-center space-x-3 bg-danger-custom/5 text-danger-custom text-xs font-sans font-medium px-4 py-3 rounded-xl border border-danger-custom/10 mb-8">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>Error Code: STATUS_ROUTE_NOT_FOUND (404)</span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-12 text-sm font-sans font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Button>

                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/')}
                    className="flex-1 h-12 text-sm font-sans font-bold flex items-center justify-center gap-2"
                  >
                    <Home size={16} />
                    Go to Console
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    className="flex-1 h-12 text-sm font-sans font-bold flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} />
                    Sign In Console
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default NotFoundPage
