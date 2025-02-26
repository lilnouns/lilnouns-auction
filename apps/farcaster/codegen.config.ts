import 'dotenv/config'
import type { CodegenConfig } from '@graphql-codegen/cli'

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
        useTypeImports: true,
        namingConvention: {
          transformUnderscore: true,
        },
      },
    },
  },
}

export default config
