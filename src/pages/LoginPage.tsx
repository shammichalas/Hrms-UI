import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Lock, Mail, Sparkles, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../utils/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { PageTransition } from '../components/layout/PageTransition'

// Form Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // 1. Authenticate with backend
      const authRes = await api.post('/api/auth/login', values)
      const { accessToken } = authRes.data.data

      // Save token in localStorage
      localStorage.setItem('token', accessToken)

      // 2. Fetch authenticated user profile details
      const profileRes = await api.get('/api/profile')
      const profileData = profileRes.data.data

      // Save full profile and name
      localStorage.setItem('user', JSON.stringify({
        id: profileData.id,
        email: profileData.email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        role: profileData.role,
        jobTitle: profileData.jobTitle,
        departmentName: profileData.departmentName,
      }))

      toast.success('Access Authenticated', {
        description: `Welcome back, ${profileData.firstName}!`,
      })

      // Redirect to dashboard root
      navigate('/')
    } catch (err: any) {
      console.error('Login error:', err)
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.'
      setErrorMessage(msg)
      toast.error('Authentication Failed', {
        description: msg,
      })
    } finally {
      setIsLoading(false)
    }
  }

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
          className="flex flex-col items-center space-y-3 mb-10 z-10"
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-orange-primary to-orange-secondary flex items-center justify-center shadow-orange-glow">
            <Sparkles size={22} className="text-white" />
          </div>
          <span className="font-sans font-bold tracking-[0.25em] text-xs uppercase text-text-primary">
            WORKFORHUB WORKSPACE
          </span>
        </motion.div>

        {/* Main Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="w-full max-w-[420px] z-10"
        >
          <Card className="glass-morphic shadow-premium p-8 relative overflow-hidden">
            <CardHeader className="p-0 pb-6 text-center">
              <CardTitle className="font-display text-3xl tracking-tight text-text-primary">
                SIGN IN
              </CardTitle>
              <CardDescription className="text-text-secondary text-sm font-sans font-normal mt-2">
                Enter your security credentials to access the console
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {errorMessage && (
                <div className="flex items-center space-x-2.5 bg-danger-custom/10 text-danger-custom text-xs font-sans font-medium px-4 py-3 rounded-xl border border-danger-custom/20 mb-6">
                  <AlertCircle size={15} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em] block">
                    Workspace Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                      <Mail size={16} />
                    </span>
                    <Input
                      type="email"
                      placeholder="admin@company.com"
                      {...register('email')}
                      className="pl-11"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger-custom text-xs font-medium font-sans mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em] block">
                    Security Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                      <Lock size={16} />
                    </span>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...register('password')}
                      className="pl-11"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-danger-custom text-xs font-medium font-sans mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Action Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="w-full h-12 text-sm font-sans font-bold transition-all duration-300 mt-8"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Authenticate Console'}
                </Button>
              </form>

              {/* Demo Hint */}
              <div className="mt-8 pt-6 border-t border-black/[0.04] text-center">
                <p className="text-[11px] text-text-secondary font-sans leading-normal">
                  Demo Credentials:<br />
                  <span className="font-semibold text-text-primary">admin@company.com</span> / <span className="font-semibold text-text-primary">password</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default LoginPage
