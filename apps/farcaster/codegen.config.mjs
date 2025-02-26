/**
 * @type {import('@graphql-codegen/cli').CodegenConfig}
 */
export default {
  generates: {
    './src/services/lilnouns/index.ts': {
      schema: process.env.LILNOUNS_SUBGRAPH_URL,
      documents: './graphql/lilnouns/**/*.graphql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
}
