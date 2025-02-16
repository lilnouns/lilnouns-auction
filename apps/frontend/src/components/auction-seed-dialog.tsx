import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardFooter } from '@repo/ui/components/card'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@repo/ui/components/table'
import { Seed } from '@/types'
import { useAccount } from 'wagmi'
import { useDialogStore } from '@/stores/dialog-store'
import { walletOptions } from '@/components/wallet-options-dialog'
import { AuctionSeedImage } from '@/components/auction-seed-image'

import { ImageData } from '@repo/utilities'
import { formatTraitName } from '@/utils/format-trait-name'

const { palette, images, bgcolors } = ImageData

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

  const backgrounds: { [key: string]: string } = {
    d5d7e1: 'cold',
    e1d7d5: 'warm',
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seed Details</DialogTitle>
        </DialogHeader>
        <Card className={'shadow-none border-none'}>
          <CardContent className="p-0">
            <div className="grid gap-6">
              <AuctionSeedImage seed={seed} />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Background</TableCell>
                    <TableCell className={'text-end'}>
                      {formatTraitName(
                        backgrounds[bgcolors[seed.background!]!] ?? '',
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Body</TableCell>
                    <TableCell className={'text-end'}>
                      {formatTraitName(
                        images.bodies[seed.body]?.filename ?? '',
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Accessory</TableCell>
                    <TableCell className={'text-end'}>
                      {formatTraitName(
                        images.accessories[seed.accessory]?.filename ?? '',
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Head</TableCell>
                    <TableCell className={'text-end'}>
                      {formatTraitName(images.heads[seed.head]?.filename ?? '')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Glasses</TableCell>
                    <TableCell className={'text-end'}>
                      {formatTraitName(
                        images.glasses[seed.glasses]?.filename ?? '',
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="p-0">
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
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
