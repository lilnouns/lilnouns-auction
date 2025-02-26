import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'
import {
  TimestampResolver,
  BigIntResolver,
  ByteResolver,
} from 'graphql-scalars'

const config: CodegenConfig = {
  emitLegacyCommonJSImports: false,
  generates: {
    './src/services/lilnouns/index.ts': {
      schema: process.env.LILNOUNS_SUBGRAPH_URL,
      documents: './graphql/lilnouns/**/*.graphql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        strictScalars: false,
        scalars: {
          BigInt: BigIntResolver,
          Bytes: ByteResolver,
          Timestamp: TimestampResolver,
        },
        useTypeImports: true,
        namingConvention: {
          transformUnderscore: true,
        },
      },
    },
  },
}

export default config
