import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Building, Lock, UserCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { PageTransition } from '../components/layout/PageTransition'
import { ScrollAnimate } from '../components/ui/ScrollAnimate'
import { SplitHeading } from '../components/ui/SplitHeading'

// Single unified form schema for all steps
const formSchema = z.object({
  workspaceName: z.string().min(3, 'Workspace name must be at least 3 characters'),
  subdomain: z.string().min(3, 'Subdomain must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Lowercases, numbers and dashes only'),
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  teamSize: z.string().min(1, 'Please select team size'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

// Unified form values type
type FormValues = z.infer<typeof formSchema>

export const FormsPage: React.FC = () => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Configure react-hook-form
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      workspaceName: '',
      subdomain: '',
      fullName: '',
      teamSize: '5-10',
      password: '',
      confirmPassword: ''
    }
  })

  // Validate current step before advancing
  const handleNextStep = async () => {
    let fieldsToValidate: any[] = []
    if (step === 1) fieldsToValidate = ['workspaceName', 'subdomain']
    if (step === 2) fieldsToValidate = ['fullName', 'teamSize']

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setStep((s) => s + 1)
    }
  }

  const handlePrevStep = () => {
    setStep((s) => Math.max(1, s - 1))
  }

  // Handle final submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    // Simulate server call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
    // Avoid unused warning by referencing the workspaceName
    console.log('Instance provisioned successfully for:', data.workspaceName)
  }

  // Slide animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <PageTransition>
      <div className="max-w-xl mx-auto space-y-8 select-none">

        {/* Title (Architectural Editorial Center) */}
        <ScrollAnimate delay={0.05} className="py-12 flex flex-col items-center justify-center text-center">
          <span className="font-sans font-semibold text-[11px] tracking-[0.22em] text-text-secondary uppercase mb-6">
            INSTANCE SETUP
          </span>
          <SplitHeading text="PROVISION INSTANCE" />
          <p className="font-sans font-normal text-[15px] md:text-[17px] leading-[1.7] tracking-[0.02em] text-text-secondary max-w-[560px] mt-8 mx-auto">
            Spin up a custom workspace configured with your secure credentials and custom routing paths.
          </p>
        </ScrollAnimate>

        {/* Step Progress Indicators */}
        {!isSuccess && (
          <ScrollAnimate delay={0.1}>
            <div className="flex items-center justify-between px-6 py-3 bg-black/[0.01] border border-black/[0.06] rounded-full">
              {[
                { number: 1, label: 'Workspace', icon: Building },
                { number: 2, label: 'Owner', icon: UserCircle },
                { number: 3, label: 'Security', icon: Lock }
              ].map((s) => {
                const isActive = step === s.number
                const isCompleted = step > s.number
                return (
                  <div key={s.number} className="flex items-center space-x-2">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border ${isActive
                          ? 'bg-orange-primary text-white border-orange-primary shadow-orange-glow'
                          : isCompleted
                            ? 'bg-success-custom/20 text-success-custom border-success-custom/40'
                            : 'bg-black/[0.01] text-text-secondary border-black/[0.06]'
                        }`}
                    >
                      {isCompleted ? <CheckCircle2 size={14} /> : s.number}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden md:inline ${isActive ? 'text-white font-bold' : 'text-text-secondary'
                        }`}
                    >
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </ScrollAnimate>
        )}

        {/* Form Container */}
        <ScrollAnimate delay={0.15}>
          <Card className="shadow-premium">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* Success Presentation */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="h-16 w-16 rounded-full bg-success-custom/10 border-2 border-success-custom/30 flex items-center justify-center text-success-custom shadow-[0_0_30px_rgba(0,210,106,0.2)]">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">Instance Provisioned!</h2>
                    <p className="text-sm text-text-secondary mt-2 max-w-sm">
                      Workspace <span className="text-text-primary font-bold">{getValues('workspaceName')}</span> has been successfully compiled and deployed to global edge CDNs.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button variant="primary" onClick={() => { setStep(1); setIsSuccess(false); }}>
                      Provision Another
                    </Button>
                  </div>
                </motion.div>
              ) : (
                /* Wizard Forms */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      className="space-y-4"
                    >
                      <CardHeader className="p-0">
                        <CardTitle>Workspace details</CardTitle>
                        <CardDescription>Specify the corporate moniker and DNS settings.</CardDescription>
                      </CardHeader>

                      <Input
                        label="Workspace Name"
                        placeholder="e.g. Acme Corporation"
                        error={errors.workspaceName?.message}
                        {...register('workspaceName')}
                      />

                      <div className="relative w-full">
                        <Input
                          label="Subdomain Prefix"
                          placeholder="e.g. acme-corp"
                          className="pr-32"
                          error={errors.subdomain?.message}
                          {...register('subdomain')}
                        />
                        <span className="absolute right-5 top-[18px] text-xs text-text-secondary select-none">
                          .workforhub.io
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      className="space-y-4"
                    >
                      <CardHeader className="p-0">
                        <CardTitle>Owner Information</CardTitle>
                        <CardDescription>Tell us about the billing administrator.</CardDescription>
                      </CardHeader>

                      <Input
                        label="Administrator Full Name"
                        placeholder="e.g. Ada Lovelace"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />

                      <div className="flex flex-col">
                        <label className="text-xs text-text-secondary mb-1.5 ml-1">Team Size Scope</label>
                        <select
                          className="bg-black/[0.02] text-text-primary px-4 py-3 rounded-input border border-black/[0.06] outline-none text-xs focus:border-orange-primary focus:ring-1 focus:ring-orange-primary/30"
                          {...register('teamSize')}
                        >
                          <option value="1-5" className="bg-white text-text-primary">1 - 5 seats</option>
                          <option value="5-10" className="bg-white text-text-primary">5 - 10 seats</option>
                          <option value="10-50" className="bg-white text-text-primary">10 - 50 seats</option>
                          <option value="50+" className="bg-white text-text-primary">Enterprise seats</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                      className="space-y-4"
                    >
                      <CardHeader className="p-0">
                        <CardTitle>Security Protocol</CardTitle>
                        <CardDescription>Create administrative access locks.</CardDescription>
                      </CardHeader>

                      <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                      />

                      <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                      />
                    </motion.div>
                  )}

                  {/* Errors Summary Panel if any */}
                  {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-2xl bg-danger-custom/5 border border-danger-custom/15 flex items-start space-x-2">
                      <ShieldAlert size={16} className="text-danger-custom mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-danger-custom">Please resolve the input errors</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">Ensure all credentials match security constraints.</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-black/[0.05]">
                    {step > 1 ? (
                      <Button type="button" variant="secondary" onClick={handlePrevStep} className="flex items-center space-x-1.5">
                        <ChevronLeft size={16} />
                        <span>Back</span>
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <Button type="button" variant="primary" onClick={handleNextStep} className="flex items-center space-x-1.5 ml-auto">
                        <span>Continue</span>
                        <ChevronRight size={16} />
                      </Button>
                    ) : (
                      <Button type="submit" variant="primary" loading={isSubmitting} className="flex items-center space-x-1.5 ml-auto">
                        <Sparkles size={14} />
                        <span>Deploy Instance</span>
                      </Button>
                    )}
                  </div>

                </form>
              )}
            </AnimatePresence>
          </Card>
        </ScrollAnimate>

      </div>
    </PageTransition>
  )
}
export default FormsPage
