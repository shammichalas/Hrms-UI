import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, ShieldCheck, X, Mail, Landmark, Eye, Phone, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../utils/api'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ScrollAnimate } from '../components/ui/ScrollAnimate'
import { PageTransition } from '../components/layout/PageTransition'
import { SplitHeading } from '../components/ui/SplitHeading'

interface Employee {
  id: string
  name: string
  role: string // UI role maps to jobTitle
  email: string
  department: string
  departmentId?: string
  status: string // ACTIVE, INACTIVE, SUSPENDED
  roleType?: string // ADMIN, HR, EMPLOYEE
  phone?: string
  baseSalary?: number
}

interface Department {
  id: string
  name: string
  code: string
  description?: string
}

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 5

  // Selected Employee for Detail Drawer
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Modals States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Current Working Record
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({
    name: '',
    role: '',
    email: '',
    departmentId: '',
    status: 'ACTIVE',
    roleType: 'EMPLOYEE',
    phone: '',
    baseSalary: 50000
  })

  // Load departments list for filters/dropdowns
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/api/departments?size=100')
        setDepartments(res.data.data.content || [])
      } catch (err) {
        console.error('Failed to fetch departments:', err)
      }
    }
    fetchDepartments()
  }, [])

  // Fetch employees list from backend
  const fetchEmployees = async () => {
    setLoading(true)
    try {
      let url = `/api/employees?page=${currentPage - 1}&size=${itemsPerPage}`
      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }
      if (deptFilter !== 'All') {
        url += `&departmentId=${deptFilter}`
      }
      const res = await api.get(url)
      
      // Map API Response (EmployeeResponse) to Employee interface
      const mapped: Employee[] = (res.data.data.content || []).map((emp: any) => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        role: emp.jobTitle || 'Staff Member',
        email: emp.email,
        department: emp.departmentName || 'Unassigned',
        departmentId: emp.departmentId,
        status: emp.status || 'ACTIVE',
        roleType: emp.role || 'EMPLOYEE',
        phone: emp.phone || '',
        baseSalary: emp.baseSalary || 0
      }))

      setEmployees(mapped)
      setTotalPages(res.data.data.totalPages || 0)
      setTotalElements(res.data.data.totalElements || 0)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
      toast.error('Sync Error', {
        description: 'Failed to retrieve directory records from the database.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [currentPage, search, deptFilter])

  // Handlers
  const handleOpenCreate = () => {
    setCurrentEmployee({
      name: '',
      role: '',
      email: '',
      departmentId: departments[0]?.id || '',
      status: 'ACTIVE',
      roleType: 'EMPLOYEE',
      phone: '',
      baseSalary: 50000
    })
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (emp: Employee, e: React.MouseEvent) => {
    e.stopPropagation() // Don't trigger drawer opening
    setCurrentEmployee(emp)
    setIsEditModalOpen(true)
  }

  const handleOpenDelete = (emp: Employee, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentEmployee(emp)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEmployee.name || !currentEmployee.email || !currentEmployee.role) {
      toast.error('Missing required fields')
      return
    }

    // Split name
    const nameParts = (currentEmployee.name || '').trim().split(/\s+/)
    const firstName = nameParts[0] || 'New'
    const lastName = nameParts.slice(1).join(' ') || 'Employee'

    try {
      await api.post('/api/employees', {
        email: currentEmployee.email,
        password: 'password123', // Default temp password
        role: currentEmployee.roleType || 'EMPLOYEE',
        firstName,
        lastName,
        phone: currentEmployee.phone || '',
        departmentId: currentEmployee.departmentId || null,
        jobTitle: currentEmployee.role || '',
        status: currentEmployee.status || 'ACTIVE',
        baseSalary: currentEmployee.baseSalary || 0
      })

      setIsCreateModalOpen(false)
      toast.success('Member created', {
        description: `${currentEmployee.name} provisioned successfully in the registry.`
      })
      fetchEmployees()
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'Failed to create employee.'
      toast.error('Creation Failed', { description: msg })
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEmployee.name || !currentEmployee.email || !currentEmployee.role) {
      toast.error('Missing required fields')
      return
    }

    const nameParts = (currentEmployee.name || '').trim().split(/\s+/)
    const firstName = nameParts[0] || 'New'
    const lastName = nameParts.slice(1).join(' ') || 'Employee'

    try {
      await api.put(`/api/employees/${currentEmployee.id}`, {
        role: currentEmployee.roleType || 'EMPLOYEE',
        firstName,
        lastName,
        phone: currentEmployee.phone || '',
        departmentId: currentEmployee.departmentId || null,
        jobTitle: currentEmployee.role || '',
        status: currentEmployee.status || 'ACTIVE',
        baseSalary: currentEmployee.baseSalary || 0
      })

      setIsEditModalOpen(false)
      toast.success('Member info updated')
      fetchEmployees()
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'Failed to update employee.'
      toast.error('Update Failed', { description: msg })
    }
  }

  const handleDelete = async () => {
    if (!currentEmployee.id) return
    try {
      await api.delete(`/api/employees/${currentEmployee.id}`)
      setIsDeleteModalOpen(false)
      toast.success('Member removed', {
        description: 'The employee account has been deleted from systems.'
      })
      fetchEmployees()
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'Failed to delete employee.'
      toast.error('Deletion Failed', { description: msg })
    }
  }

  const handleRowClick = (emp: Employee) => {
    setSelectedEmployee(emp)
    setIsDrawerOpen(true)
  }

  return (
    <PageTransition>
      <div className="space-y-16 select-none pb-12">
        
        {/* Header Title (Architectural Editorial Center) */}
        <ScrollAnimate delay={0.05} className="py-12 flex flex-col items-center justify-center text-center">
          <span className="font-sans font-semibold text-[11px] tracking-[0.22em] text-text-secondary uppercase mb-6">
            ADMIN REGISTRY
          </span>
          <SplitHeading text="IDENTITY DIRECTORY" />
          <p className="font-sans font-normal text-[15px] md:text-[17px] leading-[1.7] tracking-[0.02em] text-text-secondary max-w-[560px] mt-8 mx-auto">
            Manage, filter, audit, and provision administrative seats in compliance with active directory access tokens.
          </p>
          <div className="mt-12">
            <Button variant="primary" className="flex items-center space-x-1.5" onClick={handleOpenCreate}>
              <Plus size={16} />
              <span>Add Member</span>
            </Button>
          </div>
        </ScrollAnimate>

        {/* Toolbar (Search & Filters) */}
        <ScrollAnimate delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/[0.01] border border-border-custom p-4 rounded-2xl backdrop-blur-xl">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-custom">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search index..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full bg-black/[0.02] text-text-primary pl-10 pr-4 py-2.5 rounded-full text-xs border border-border-custom focus:border-orange-primary focus:ring-1 focus:ring-orange-primary/30 outline-none transition-all"
              />
            </div>

            {/* Department Buttons */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              <button
                onClick={() => { setDeptFilter('All'); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                  deptFilter === 'All'
                    ? 'bg-orange-primary text-white shadow-orange-glow'
                    : 'bg-black/[0.01] hover:bg-black/[0.03] text-text-secondary hover:text-text-primary border border-border-custom'
                }`}
              >
                All
              </button>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => { setDeptFilter(dept.id); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                    deptFilter === dept.id
                      ? 'bg-orange-primary text-white shadow-orange-glow'
                      : 'bg-black/[0.01] hover:bg-black/[0.03] text-text-secondary hover:text-text-primary border border-border-custom'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        </ScrollAnimate>

        {/* Employees Table */}
        <ScrollAnimate delay={0.15}>
          <div className="bg-white/70 border border-border-custom rounded-card p-4 shadow-premium">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-transparent border-none">
                  <TableHead>Member</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-16">
                      <p className="text-sm text-text-secondary">Syncing records with the active registry...</p>
                    </TableCell>
                  </TableRow>
                ) : employees.length > 0 ? (
                  employees.map((emp) => (
                    <TableRow key={emp.id} className="cursor-pointer" onClick={() => handleRowClick(emp)}>
                      {/* Name / Email */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-orange-primary/10 border border-orange-primary/30 flex items-center justify-center text-orange-primary font-bold text-xs flex-shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary leading-none">{emp.name}</p>
                            <p className="text-xs text-text-secondary mt-1">{emp.email}</p>
                            {/* Mobile inline badges for Role and Department */}
                            <div className="flex flex-wrap gap-1.5 mt-1.5 md:hidden">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/[0.03] text-text-secondary">
                                {emp.role}
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-orange-primary/10 text-orange-primary sm:hidden">
                                {emp.department}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {/* Role */}
                      <TableCell className="hidden md:table-cell">
                        <span className="font-medium text-text-secondary">{emp.role}</span>
                      </TableCell>
                      {/* Department */}
                      <TableCell className="hidden sm:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-black/[0.02] text-text-secondary">
                          {emp.department}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span className={`inline-flex items-center space-x-1.5 text-xs ${
                          emp.status === 'ACTIVE' ? 'text-success-custom' : 'text-warning-custom'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            emp.status === 'ACTIVE' ? 'bg-success-custom shadow-[0_0_8px_#00D26A]' : 'bg-warning-custom shadow-[0_0_8px_#FFB800]'
                          }`} />
                          <span>{emp.status}</span>
                        </span>
                      </TableCell>
                      {/* Action Menu Buttons */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRowClick(emp); }}
                            className="p-1.5 rounded-full text-text-secondary hover:bg-black/[0.03] transition-colors"
                            title="Inspect Detailed Profile"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => handleOpenEdit(emp, e)}
                            className="p-1.5 rounded-full text-text-secondary hover:bg-black/[0.03] transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => handleOpenDelete(emp, e)}
                            className="p-1.5 rounded-full text-text-secondary hover:text-danger-custom hover:bg-danger-custom/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-16">
                      <div className="max-w-xs mx-auto flex flex-col items-center justify-center">
                        <p className="text-sm font-semibold text-text-primary">No members matched filters</p>
                        <p className="text-xs text-text-secondary mt-1">Adjust search parameters or clear select filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border-custom pt-4 mt-4 select-none">
                <span className="text-xs text-text-secondary">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} members
                </span>
                <div className="flex items-center space-x-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs font-semibold text-text-primary px-2">Page {currentPage} of {totalPages}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollAnimate>

        {/* ==================== CREATE MEMBER MODAL ==================== */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Provision New Active Member">
          <form onSubmit={handleSaveCreate} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={currentEmployee.name || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@company.com"
              value={currentEmployee.email || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
              required
            />
            <Input
              label="Role Assignment (Job Title)"
              placeholder="e.g. Staff Software Engineer"
              value={currentEmployee.role || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, role: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. +1234567890"
              value={currentEmployee.phone || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
            />
            <Input
              label="Base Annual Salary ($)"
              type="number"
              placeholder="e.g. 85000"
              value={currentEmployee.baseSalary || 0}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, baseSalary: Number(e.target.value) })}
            />

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-text-secondary mb-1.5 ml-1">Department</label>
                <select
                  value={currentEmployee.departmentId || ''}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, departmentId: e.target.value })}
                  className="bg-black/[0.02] text-text-primary px-4 py-2.5 rounded-input border border-border-custom outline-none text-xs"
                >
                  <option value="" className="bg-white text-text-primary">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id} className="bg-white text-text-primary">
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs text-text-secondary mb-1.5 ml-1">System Permission Role</label>
                <select
                  value={currentEmployee.roleType || 'EMPLOYEE'}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, roleType: e.target.value })}
                  className="bg-black/[0.02] text-text-primary px-4 py-2.5 rounded-input border border-border-custom outline-none text-xs"
                >
                  <option value="EMPLOYEE" className="bg-white text-text-primary">Employee (Standard)</option>
                  <option value="HR" className="bg-white text-text-primary">HR Representative</option>
                  <option value="ADMIN" className="bg-white text-text-primary">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-text-secondary mb-1.5 ml-1">Account Status</label>
                <select
                  value={currentEmployee.status || 'ACTIVE'}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, status: e.target.value })}
                  className="bg-black/[0.02] text-text-primary px-4 py-2.5 rounded-input border border-border-custom outline-none text-xs"
                >
                  <option value="ACTIVE" className="bg-white text-text-primary">Active</option>
                  <option value="INACTIVE" className="bg-white text-text-primary">Inactive</option>
                  <option value="SUSPENDED" className="bg-white text-text-primary">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Provision Account</Button>
            </div>
          </form>
        </Modal>

        {/* ==================== EDIT MEMBER MODAL ==================== */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Member Assignment">
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Full Name"
              value={currentEmployee.name || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={currentEmployee.email || ''}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <Input
              label="Role Assignment (Job Title)"
              value={currentEmployee.role || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, role: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              value={currentEmployee.phone || ''}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
            />
            <Input
              label="Base Annual Salary ($)"
              type="number"
              value={currentEmployee.baseSalary || 0}
              onChange={(e) => setCurrentEmployee({ ...currentEmployee, baseSalary: Number(e.target.value) })}
            />

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-text-secondary mb-1.5 ml-1">Department</label>
                <select
                  value={currentEmployee.departmentId || ''}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, departmentId: e.target.value })}
                  className="bg-black/[0.02] text-text-primary px-4 py-2.5 rounded-input border border-border-custom outline-none text-xs"
                >
                  <option value="" className="bg-white text-text-primary">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id} className="bg-white text-text-primary">
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs text-text-secondary mb-1.5 ml-1">System Permission Role</label>
                <select
                  value={currentEmployee.roleType || 'EMPLOYEE'}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, roleType: e.target.value })}
                  className="bg-black/[0.02] text-text-primary px-4 py-2.5 rounded-input border border-border-custom outline-none text-xs"
                >
                  <option value="EMPLOYEE" className="bg-white text-text-primary">Employee (Standard)</option>
                  <option value="HR" className="bg-white text-text-primary">HR Representative</option>
                  <option value="ADMIN" className="bg-white text-text-primary">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-text-secondary mb-1.5 ml-1">Account Status</label>
                <select
                  value={currentEmployee.status || 'ACTIVE'}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, status: e.target.value })}
                  className="bg-black/[0.02] text-text-primary px-4 py-2.5 rounded-input border border-border-custom outline-none text-xs"
                >
                  <option value="ACTIVE" className="bg-white text-text-primary">Active</option>
                  <option value="INACTIVE" className="bg-white text-text-primary">Inactive</option>
                  <option value="SUSPENDED" className="bg-white text-text-primary">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save Changes</Button>
            </div>
          </form>
        </Modal>

        {/* ==================== DELETE MEMBER MODAL ==================== */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Deprovision Account">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              Are you absolutely sure you want to deprovision the administrative seat for{' '}
              <span className="text-text-primary font-bold">{currentEmployee.name}</span>? This action is permanent and revokes all production logs access.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
              <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="primary" className="bg-danger-custom text-white shadow-none hover:bg-danger-custom/90" size="sm" onClick={handleDelete}>
                Confirm Deprovision
              </Button>
            </div>
          </div>
        </Modal>

        {/* ==================== PROFILE SLIDING DRAWER ==================== */}
        <AnimatePresence>
          {isDrawerOpen && selectedEmployee && (
            <div className="fixed inset-0 z-50 overflow-hidden select-none">
              {/* Backdrop backdrop blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsDrawerOpen(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              />

              {/* Slider panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-border-custom shadow-premium p-8 flex flex-col z-10"
              >
                {/* Close handle */}
                <div className="flex justify-between items-center mb-8 border-b border-border-custom pb-4">
                  <span className="text-xs font-bold text-orange-primary flex items-center space-x-1.5">
                    <ShieldCheck size={14} />
                    <span>SECURE PROFILE AUDIT</span>
                  </span>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-black/[0.03] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                  <div className="h-20 w-20 rounded-full bg-orange-primary/10 border-2 border-orange-primary/30 flex items-center justify-center text-orange-primary font-bold text-3xl shadow-orange-glow">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary leading-tight m-0">{selectedEmployee.name}</h2>
                    <p className="text-xs text-orange-primary font-medium mt-1">{selectedEmployee.role}</p>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  <div className="flex items-center space-x-4 p-4 bg-black/[0.01] border border-border-custom rounded-2xl">
                    <Mail size={16} className="text-muted-custom" />
                    <div>
                      <p className="text-[10px] text-muted-custom uppercase leading-none">Email Address</p>
                      <p className="text-sm font-medium text-text-primary mt-1">{selectedEmployee.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-black/[0.01] border border-border-custom rounded-2xl">
                    <Landmark size={16} className="text-muted-custom" />
                    <div>
                      <p className="text-[10px] text-muted-custom uppercase leading-none">Department Assignment</p>
                      <p className="text-sm font-medium text-text-primary mt-1">{selectedEmployee.department}</p>
                    </div>
                  </div>

                  {selectedEmployee.phone && (
                    <div className="flex items-center space-x-4 p-4 bg-black/[0.01] border border-border-custom rounded-2xl">
                      <Phone size={16} className="text-muted-custom" />
                      <div>
                        <p className="text-[10px] text-muted-custom uppercase leading-none">Phone Contact</p>
                        <p className="text-sm font-medium text-text-primary mt-1">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 p-4 bg-black/[0.01] border border-border-custom rounded-2xl">
                    <CreditCard size={16} className="text-muted-custom" />
                    <div>
                      <p className="text-[10px] text-muted-custom uppercase leading-none">Base Annual Salary</p>
                      <p className="text-sm font-medium text-text-primary mt-1">
                        ${selectedEmployee.baseSalary ? Number(selectedEmployee.baseSalary).toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-black/[0.01] border border-border-custom rounded-2xl">
                    <ShieldCheck size={16} className="text-muted-custom" />
                    <div>
                      <p className="text-[10px] text-muted-custom uppercase leading-none">System Access Authorization</p>
                      <p className="text-sm font-medium text-text-primary mt-1">
                        {selectedEmployee.roleType === 'ADMIN' ? 'Level 5 Administrator' : selectedEmployee.roleType === 'HR' ? 'Level 3 HR Operator' : 'Level 1 Standard Employee'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footnotes */}
                <div className="text-[10px] text-muted-custom border-t border-border-custom pt-4 mt-auto">
                  Registry ID: {selectedEmployee.id}. Provisioned in compliance with SOC2 Type II criteria.
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  )
}
export default EmployeesPage
