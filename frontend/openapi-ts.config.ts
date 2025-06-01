import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "http://localhost:5050/openapi.json",
  output: {
    lint: 'eslint',
    path: './src/api',
    clean: true
  },
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/schemas',
    "zod",
    {
      dates: true,
      name: '@hey-api/transformers',
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
    },
  ],
})
