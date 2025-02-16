'use client'

import React, { useState, useEffect } from 'react'
import Joyride, { Step, TooltipRenderProps } from 'react-joyride'
import { Button } from '@repo/ui//components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@repo/ui//components/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover'
import { Card, CardContent } from '@repo/ui/components/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip'

const steps: Step[] = [
  {
    target: '#filter-button',
    content: 'This is the first step, highlighting the filter button.',
  },
  {
    target: '#wallet-button',
    content:
      'Here you can manage your wallet and access account features with ease!',
  },
]

export function Tour() {
  const [run, setRun] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Show modal when the user first enters the site
  useEffect(() => {
    setTimeout(() => setShowModal(true), 500) // Delay for better UX
  }, [])

  return (
    <>
      {/* Welcome Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Welcome to the Site 🎉</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Would you like a quick tour of the features?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              No, Thanks
            </Button>
            <Button
              onClick={() => {
                setShowModal(false)
                setRun(true)
              }}
            >
              Start Tour 🚀
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Joyride Tour */}
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        spotlightPadding={8}
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            zIndex: 10000, // Adjust this value as needed
          },
        }}
      />
    </>
  )
}

const CustomTooltip = React.forwardRef<HTMLDivElement, TooltipRenderProps>(
  (
    {
      continuous,
      index,
      isLastStep,
      step,
      backProps,
      closeProps,
      primaryProps,
      tooltipProps,
    },
    ref,
  ) => {
    return (
      <div className="relative z-[9999]">
        {' '}
        {/* Ensures it's above popover but below Joyride spotlight */}
        <Popover open>
          <PopoverTrigger asChild>
            <span {...tooltipProps} ref={ref} />
          </PopoverTrigger>
          <PopoverContent
            className="w-80 z-[10001] mt-[-4px] shadow-none"
            side="bottom"
            align="center"
          >
            {step.title && (
              <h3 className="text-lg font-medium">{step.title}</h3>
            )}
            <div className="mt-2">{step.content}</div>
            <div className="mt-4 flex justify-between">
              {index > 0 && (
                <Button variant="outline" {...backProps}>
                  Back
                </Button>
              )}
              {continuous && (
                <Button variant="outline" {...primaryProps}>
                  {isLastStep ? 'Finish' : 'Next'}
                </Button>
              )}
              {!continuous && (
                <Button variant="outline" {...closeProps}>
                  Close
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)
