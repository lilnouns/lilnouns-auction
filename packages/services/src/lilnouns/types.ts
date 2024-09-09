export interface Env {
  LILNOUNS_SUBGRAPH_URL: string
}

export interface Auction {
  id: string
  noun: {
    id: string
  }
  amount: bigint
  startTime: bigint
  endTime: bigint
  settled: boolean
}
