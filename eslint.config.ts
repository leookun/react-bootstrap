import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  ignores: ['imports.d.ts', 'auto-import-components.d.ts', 'vite.config.ts'],
  rules: {
    'antfu/top-level-function': 'off',
    'style/arrow-parens': 'off',
  },
})
