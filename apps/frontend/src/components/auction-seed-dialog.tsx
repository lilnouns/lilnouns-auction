import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { Button } from '@repo/ui/components/button'
import { Seed } from '@/types'
import { useAccount } from 'wagmi'
import { useDialogStore } from '@/stores/dialog-store'
import { walletOptions } from '@/components/wallet-options-dialog'
import { AuctionSeedImage } from '@/components/auction-seed-image'

interface AuctionSeedDialogProps {
  seed: Seed
  onBuy: () => void
  children: React.ReactNode
}

export function AuctionSeedDialog({
  seed,
  onBuy,
  children,
}: AuctionSeedDialogProps) {
  const { isConnected } = useAccount()
  const { openDialog } = useDialogStore()

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="grid gap-4">
          <div className="space-y-2">
            {/* Add Noun information here */}
            <div className="flex flex-col space-y-4">
              <AuctionSeedImage seed={seed} />
              <div>
                {/* Display noun traits information */}
                <p>Background: {seed.background}</p>
                <p>Body: {seed.body}</p>
                <p>Accessory: {seed.accessory}</p>
                <p>Head: {seed.head}</p>
                <p>Glasses: {seed.glasses}</p>
              </div>
              <Button
                onClick={() => {
                  if (isConnected) {
                    onBuy()
                  } else {
                    openDialog(walletOptions)
                  }
                }}
                className="w-full"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
