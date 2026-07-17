import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  Users,
  PlusCircle,
  FilePlus,
  Terminal,
  Settings,
  Building,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../utils/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ScrollAnimate } from '../components/ui/ScrollAnimate'
import { PageTransition } from '../components/layout/PageTransition'
import { SplitHeading } from '../components/ui/SplitHeading'

// Dummy Chart Data (retained for visualization fallback)
const salesData = [
  { month: 'Jan', revenue: 45000, users: 1200 },
  { month: 'Feb', revenue: 52000, users: 1500 },
  { month: 'Mar', revenue: 49000, users: 1400 },
  { month: 'Apr', revenue: 63000, users: 1800 },
  { month: 'May', revenue: 58000, users: 1900 },
  { month: 'Jun', revenue: 71000, users: 2200 },
  { month: 'Jul', revenue: 85000, users: 2600 }
]

const performanceData = [
  { day: 'Mon', response: 48 },
  { day: 'Tue', response: 42 },
  { day: 'Wed', response: 45 },
  { day: 'Thu', response: 38 },
  { day: 'Fri', response: 32 },
  { day: 'Sat', response: 28 },
  { day: 'Sun', response: 30 }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 border border-black/[0.08] backdrop-blur-xl p-3 rounded-xl shadow-premium text-xs text-text-primary">
        <p className="font-semibold text-text-primary mb-1">{label}</p>
        <p className="text-orange-primary font-bold">
          {typeof payload[0].value === 'number' ? `$${payload[0].value.toLocaleString()}` : payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

interface DashboardStats {
  totalEmployees: number
  totalDepartments: number
  pendingLeaveRequests: number
  presentToday: number
  absentToday: number
  lateToday: number
}

interface AnalyticsStats {
  monthlyPayrollCost: number
  averageWorkHours: number
  leavesApprovedThisMonth: number
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          api.get('/api/dashboard'),
          api.get('/api/analytics')
        ])
        setStats(statsRes.data.data)
        setAnalytics(analyticsRes.data.data)
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err)
        toast.error('Data Sync Failure', {
          description: 'Failed to load live metrics from server.'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const triggerAction = (actionName: string) => {
    toast.success(`${actionName} triggered`, {
      description: `Task successfully enqueued to microservices.`
    })
  }

  // Format Payroll cost
  const payrollCostStr = analytics?.monthlyPayrollCost
    ? `$${Number(analytics.monthlyPayrollCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '$0.00'

  return (
    <PageTransition>
      <div className="space-y-16 select-none pb-12">
        
        {/* Page Header (Architectural Editorial Center) */}
        <ScrollAnimate delay={0.05} className="py-12 flex flex-col items-center justify-center text-center">
          <span className="font-sans font-semibold text-[11px] tracking-[0.22em] text-text-secondary uppercase mb-6">
            WORKSPACE INDEX
          </span>
          <SplitHeading text="WORKFORHUB DASHBOARD" />
          <p className="font-sans font-normal text-[15px] md:text-[17px] leading-[1.7] tracking-[0.02em] text-text-secondary max-w-[560px] mt-8 mx-auto">
            A premium, high-fidelity monitoring nexus displaying real-time employee attendance status, department structures, and monthly payroll details.
          </p>
          <div className="flex items-center space-x-3 mt-12">
            <Button variant="secondary" onClick={() => triggerAction('Export metrics')}>Export CSV</Button>
            <Button variant="primary" onClick={() => triggerAction('Refresh live metrics')}>Refresh Stats</Button>
          </div>
        </ScrollAnimate>

        {/* Statistics Grid */}
        <ScrollAnimate delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Card 1: Total Employees */}
            <Card className="relative overflow-hidden">
              <span className="absolute right-4 bottom-[-20px] text-8xl font-numbers font-black opacity-[0.06] select-none text-text-primary pointer-events-none">
                01
              </span>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em]">Total Employees</span>
                <span className="p-2 rounded-xl bg-orange-primary/10 text-orange-primary shadow-orange-glow">
                  <Users size={16} />
                </span>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-bold text-text-primary">
                  {loading ? '...' : stats?.totalEmployees ?? 0}
                </h3>
                <div className="flex items-center space-x-1 mt-1 text-xs text-success-custom font-medium">
                  <span>{loading ? '' : `Present today: ${stats?.presentToday ?? 0}`}</span>
                </div>
              </div>
            </Card>

            {/* Stat Card 2: Departments */}
            <Card className="relative overflow-hidden">
              <span className="absolute right-4 bottom-[-20px] text-8xl font-numbers font-black opacity-[0.06] select-none text-text-primary pointer-events-none">
                02
              </span>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em]">Departments</span>
                <span className="p-2 rounded-xl bg-orange-primary/10 text-orange-primary">
                  <Building size={16} />
                </span>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-bold text-text-primary">
                  {loading ? '...' : stats?.totalDepartments ?? 0}
                </h3>
                <div className="flex items-center space-x-1 mt-1 text-xs text-text-secondary">
                  <span>Organized team units</span>
                </div>
              </div>
            </Card>

            {/* Stat Card 3: Pending Leaves */}
            <Card className="relative overflow-hidden">
              <span className="absolute right-4 bottom-[-20px] text-8xl font-numbers font-black opacity-[0.06] select-none text-text-primary pointer-events-none">
                03
              </span>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em]">Pending Leaves</span>
                <span className="p-2 rounded-xl bg-orange-primary/10 text-orange-primary">
                  <FileText size={16} />
                </span>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-bold text-text-primary">
                  {loading ? '...' : stats?.pendingLeaveRequests ?? 0}
                </h3>
                <div className="flex items-center space-x-1 mt-1 text-xs text-warning-custom font-medium">
                  <span>{loading ? '' : `${analytics?.leavesApprovedThisMonth ?? 0} approved this month`}</span>
                </div>
              </div>
            </Card>

            {/* Stat Card 4: Monthly Payroll Cost */}
            <Card className="relative overflow-hidden">
              <span className="absolute right-4 bottom-[-20px] text-8xl font-numbers font-black opacity-[0.06] select-none text-text-primary pointer-events-none">
                04
              </span>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em]">Monthly Payroll</span>
                <span className="p-2 rounded-xl bg-orange-primary/10 text-orange-primary">
                  <TrendingUp size={16} />
                </span>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  {loading ? '...' : payrollCostStr}
                </h3>
                <div className="flex items-center space-x-1 mt-1.5 text-xs text-text-secondary">
                  <span>{loading ? '' : `Avg Work Hours: ${analytics?.averageWorkHours ?? 0}h/day`}</span>
                </div>
              </div>
            </Card>
          </div>
        </ScrollAnimate>

        {/* Charts & Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Area Chart */}
          <ScrollAnimate delay={0.15} className="lg:col-span-2">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Workplace Cost Trend</CardTitle>
                <CardDescription>Monthly growth progression comparing billing spikes.</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(0, 0, 0, 0.35)', fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(0, 0, 0, 0.35)', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.06)' }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF7A00"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#orangeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </ScrollAnimate>

          {/* Quick Actions Grid */}
          <ScrollAnimate delay={0.2}>
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Quick System Actions</CardTitle>
                <CardDescription>Direct interface panel triggers</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => triggerAction('Create New Team Invoice')}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/[0.01] border border-black/[0.06] hover:bg-black/[0.03] hover:border-black/[0.12] transition-all duration-300 text-text-secondary hover:text-text-primary"
                >
                  <FilePlus size={20} className="text-orange-primary mb-2" />
                  <span className="text-xs font-semibold text-center">New Invoice</span>
                </button>
                
                <button
                  onClick={() => triggerAction('Create API Key')}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/[0.01] border border-black/[0.06] hover:bg-black/[0.03] hover:border-black/[0.12] transition-all duration-300 text-text-secondary hover:text-text-primary"
                >
                  <PlusCircle size={20} className="text-orange-primary mb-2" />
                  <span className="text-xs font-semibold text-center">Create Key</span>
                </button>

                <button
                  onClick={() => triggerAction('Flush Cache Indexes')}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/[0.01] border border-black/[0.06] hover:bg-black/[0.03] hover:border-black/[0.12] transition-all duration-300 text-text-secondary hover:text-text-primary"
                >
                  <Terminal size={20} className="text-orange-primary mb-2" />
                  <span className="text-xs font-semibold text-center">Clear Cache</span>
                </button>

                <button
                  onClick={() => triggerAction('Update Config Rules')}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/[0.01] border border-black/[0.06] hover:bg-black/[0.03] hover:border-black/[0.12] transition-all duration-300 text-text-secondary hover:text-text-primary"
                >
                  <Settings size={20} className="text-orange-primary mb-2" />
                  <span className="text-xs font-semibold text-center">Settings</span>
                </button>
              </CardContent>
            </Card>
          </ScrollAnimate>
        </div>

        {/* Weekly Latency Chart & Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Latency Bar Chart */}
          <ScrollAnimate delay={0.25}>
            <Card className="h-[380px]">
              <CardHeader>
                <CardTitle>Attendance Latency</CardTitle>
                <CardDescription>Average late check-ins over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(0, 0, 0, 0.35)', fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(0, 0, 0, 0.35)', fontSize: 10 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/95 border border-black/[0.08] backdrop-blur-xl p-3 rounded-xl text-xs text-text-primary shadow-premium">
                              <p className="font-semibold text-text-primary mb-1">{label}</p>
                              <p className="text-orange-primary font-bold">{payload[0].value} late check-ins</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="response" fill="#FF7A00" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </ScrollAnimate>

          {/* Activity Feed */}
          <ScrollAnimate delay={0.3} className="lg:col-span-2">
            <Card className="h-[380px]">
              <CardHeader>
                <CardTitle>Seeded Status Information</CardTitle>
                <CardDescription>Basic system log showing administrative statuses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.01] border border-black/[0.04]">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-orange-primary shadow-orange-glow animate-pulse" />
                    <div>
                      <p className="text-xs text-text-primary font-medium">
                        <span className="font-bold">System</span> successfully established database pools
                      </p>
                      <p className="text-[10px] text-muted-custom mt-0.5">Just now</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/[0.02] text-text-secondary">
                    system
                  </span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.01] border border-black/[0.04]">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-orange-primary shadow-orange-glow" />
                    <div>
                      <p className="text-xs text-text-primary font-medium">
                        <span className="font-bold">Supabase</span> connection pool synchronized successfully
                      </p>
                      <p className="text-[10px] text-muted-custom mt-0.5">5m ago</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/[0.02] text-text-secondary">
                    database
                  </span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimate>
        </div>

      </div>
    </PageTransition>
  )
}
export default DashboardPage

