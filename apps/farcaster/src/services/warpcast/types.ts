export interface Pfp {
  url: string
  verified: boolean
}

export interface Bio {
  text: string
  mentions: string[]
  channelMentions: string[]
}

export interface Location {
  placeId: string
  description: string
}

export interface Profile {
  bio: Bio
  location: Location
}

export interface ViewerContext {
  following: boolean
  followedBy: boolean
  canSendDirectCasts: boolean
  enableNotifications: boolean
  hasUploadedInboxKeys: boolean
}

export interface User {
  fid: number
  username: string
  displayName: string
  pfp: Pfp
  profile: Profile
  followerCount: number
  followingCount: number
  activeOnFcNetwork: boolean
  connectedAccounts: string[]
  viewerContext: ViewerContext
}

export interface OpenGraph {
  url: string
  sourceUrl: string
  title: string
  domain: string
  useLargeImage: boolean
  frame: {
    version: string
    frameUrl: string
    imageUrl: string
    postUrl: string
    buttons: {
      index: number
      title: string
      type: string
      target: string
    }[]
    imageAspectRatio: string
  }
}

export interface Url {
  type: string
  openGraph: OpenGraph
}

export interface Embeds {
  images: never[]
  urls: Url[]
  videos: never[]
  unknowns: never[]
  processedCastText: string
}

export interface Cast {
  hash: string
  threadHash: string
  author: User
  text: string
  timestamp: number
  mentions: never[]
  attachments: never
  embeds: Embeds
  replies: { count: number }
  reactions: { count: number }
  recasts: { count: number }
  watches: { count: number }
  tags: {
    type: string
    id: string
    name: string
    imageUrl: string
  }[]
  quoteCount: number
  combinedRecastCount: number
  viewerContext: {
    reacted: boolean
    recast: boolean
    bookmarked: boolean
  }
}
