import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { getPseudorandomPart } from '@lilnounsdao/assets'
import { NounData, NounSeed } from '@lilnounsdao/assets/dist/types'
import { default as imageData } from './image-data.json'
import { EncodedImage } from '@lilnounsdao/sdk'

type ImageData = {
  bgcolors: string[]
  palette: string[]
  images: {
    bodies: EncodedImage[]
    accessories: EncodedImage[]
    heads: EncodedImage[]
    glasses: EncodedImage[]
  }
}

const {
  bgcolors,
  images: { bodies, accessories, heads, glasses },
}: ImageData = imageData

/**
 * Generates an object containing data for a noun entity based on the provided
 * seed.
 *
 * @param seed - An object containing indices for noun parts and background.
 * @returns An object containing parts and background for the noun entity.
 */
export function getNounData(seed: NounSeed): NounData {
  return {
    parts: [
      bodies[seed.body]!,
      accessories[seed.accessory]!,
      heads[seed.head]!,
      glasses[seed.glasses]!,
    ],
    background: bgcolors[seed.background]!,
  }
}

/**
 * Generates a NounSeed object from a given noun ID and block hash.
 *
 * @param nounId - The identifier for the noun.
 * @param blockHash - The hash of the blockchain block.
 * @returns An object containing various visual properties for the Noun token.
 */
export function getNounSeedFromBlockHash(
  nounId: number,
  blockHash: string,
): NounSeed {
  const pseudorandomness = solidityKeccak256(
    ['bytes32', 'uint256'],
    [blockHash, nounId],
  )
  return {
    background: getPseudorandomPart(pseudorandomness, bgcolors.length, 0),
    body: getPseudorandomPart(pseudorandomness, bodies.length, 48),
    accessory: getPseudorandomPart(pseudorandomness, accessories.length, 96),
    head: getPseudorandomPart(pseudorandomness, heads.length, 144),
    glasses: getPseudorandomPart(pseudorandomness, glasses.length, 192),
  }
}

export { imageData }
