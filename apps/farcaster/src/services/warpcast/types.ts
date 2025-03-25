export interface Pfp {
  url: string
  verified: boolean
}

export interface Bio {
  text: string
  mentions: string[]
  channelMentions?: string[]
}

export interface Location {
  placeId: string
  description: string
}

export interface Profile {
  bio: Bio
  location: Location
}

export interface UserViewerContext {
  following?: boolean
  followedBy?: boolean
  blockedBy?: boolean
  canSendDirectCasts?: boolean
  enableNotifications?: boolean
  hasUploadedInboxKeys?: boolean
}

type Author = User

export interface User {
  fid: number
  username?: string
  displayName: string
  pfp: Pfp
  profile: Profile
  followerCount: number
  followingCount: number
  activeOnFcNetwork?: boolean
  connectedAccounts?: string[]
  viewerContext: UserViewerContext
}

export interface OpenGraph {
  url: string
  sourceUrl: string
  title: string
  description?: string
  domain: string
  image?: string
  useLargeImage: boolean
  channel?: {
    key: string
    followerCount: number
  }
  frame?: {
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
    frameEmbedNext?: {
      frameUrl: string
      frameEmbed: {
        version: string
        imageUrl: string
        button: {
          title: string
          action: {
            type: string
            name: string
            url: string
            splashImageUrl: string
            splashBackgroundColor: string
          }
        }
      }
      author: Author
    }
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
  groupInvites: never[]
}

export interface ParentSource {
  type: string
  url: string
}

interface Tag {
  type: string
  id: string
  name: string
  imageUrl: string
}

export interface Channel {
  key: string
  name: string
  imageUrl: string
  authorContext: AuthorContext
  authorRole: string
}

export interface AuthorContext {
  role: string
  restricted: boolean
  banned: boolean
}

export interface Cast {
  hash: string
  threadHash: string
  parentSource?: ParentSource
  author: Author
  castType?: string
  text: string
  timestamp: number
  mentions: never[]
  attachments?: never
  embeds: Embeds
  ancestors?: { count: number; casts?: Cast[] }
  replies: { count: number }
  reactions: { count: number }
  recasts: {
    count: number
    recasters?: never[]
  }
  watches: { count: number }
  tags: Tag[]
  viewCount?: number
  quoteCount: number
  combinedRecastCount: number
  warpsTipped: number
  channel?: Channel
  viewerContext: CastViewerContext
}

export interface CastViewerContext {
  reacted: boolean
  recast: boolean
  bookmarked: boolean
}
