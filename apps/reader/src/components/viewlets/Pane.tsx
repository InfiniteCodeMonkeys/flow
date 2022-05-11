import { useBoolean } from '@literal-ui/hooks'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { Children, ComponentProps } from 'react'
import { MdExpandMore, MdChevronRight } from 'react-icons/md'

import { Action, ActionBar } from '../base'

interface PaneProps extends ComponentProps<'div'> {
  headline: string
  /**
   * If count of line is greater than threshold and
   * space is not enough, the container will shrink to
   * the threshold.
   */
  shrinkThreshold?: number
  actions?: Action[]
}
export const Pane = forwardRef<HTMLDivElement, PaneProps>(function Pane(
  { className, headline, children, shrinkThreshold = 0, actions, ...props },
  ref,
) {
  const [open, toggle] = useBoolean(true)
  const Icon = open ? MdExpandMore : MdChevronRight
  const n = open ? Children.count(children) : 0
  const minLine = Math.min(n, shrinkThreshold)
  return (
    <div
      className="scroll-parent group select-none"
      style={{
        minHeight: (minLine + 1) * 24,
      }}
    >
      <div role="button" className="flex items-center py-0.5" onClick={toggle}>
        <div>
          <Icon size={20} className="text-outline" />
        </div>
        <div className="typescale-label-medium text-on-surface-variant">
          {headline.toUpperCase()}
        </div>
        {actions && (
          <ActionBar
            actions={actions}
            className="ml-auto hidden pr-1 group-hover:flex"
          />
        )}
      </div>
      <div
        ref={ref}
        className={clsx(
          'scroll typescale-body-small text-on-surface-variant',
          !open && 'hidden',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
