import { GraphQLClient } from 'graphql-request'

export function createClient(endpoint: string) {
  return new GraphQLClient(endpoint)
}
