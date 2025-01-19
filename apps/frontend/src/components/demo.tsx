import sdk from '@farcaster/frame-sdk'
import { useEffect, useState } from 'react'

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready()
    }
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true)
      load()
    }
  }, [isSDKLoaded])

  return (
    <div className="mx-auto w-[300px] px-2 py-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Frames v2 Demo</h1>
    </div>
  )
}
