import React from 'react'
import { cn } from '../../utils/cn'

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  ...props
}) => (
  <div className="relative w-full overflow-auto">
    <table
      className={cn('w-full caption-bottom text-sm border-collapse border-spacing-y-2 border-spacing-x-0', className)}
      style={{ borderCollapse: 'separate' }}
      {...props}
    />
  </div>
)

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => <thead className={cn('[&_tr]:border-b-0 sticky top-0 bg-bg-primary/80 backdrop-blur-md z-10', className)} {...props} />

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  ...props
}) => (
  <tr
    className={cn(
      'group/row bg-black/[0.01] hover:bg-black/[0.03] transition-all duration-300 border-none select-none',
      className
    )}
    {...props}
  />
)

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => (
  <th
    className={cn(
      'h-12 px-6 text-left align-middle font-sans font-bold text-xs text-text-secondary uppercase tracking-wider',
      className
    )}
    {...props}
  />
)

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...props
}) => (
  <td
    className={cn(
      'px-6 py-4 align-middle text-sm text-text-primary border-t border-b border-black/[0.04] first:border-l first:border-r-0 last:border-r last:border-l-0 first:rounded-l-table last:rounded-r-table group-hover/row:border-black/[0.08] transition-colors duration-300',
      className
    )}
    {...props}
  />
)
