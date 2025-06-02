import { X } from 'lucide-react' // close icon
import { Button } from '@repo/ui/components/button'
import { Card, CardContent } from '@repo/ui/components/card'
import { ReactNode, useState } from 'react'

interface BannerProps {
  title: string
  description?: ReactNode
  onClose?: () => void
}

export function Banner({ title, description, onClose }: BannerProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  return (
    <Card className="sticky top-0 z-60 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="flex items-center justify-between px-4 py-2">
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          {description && (
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {description}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
