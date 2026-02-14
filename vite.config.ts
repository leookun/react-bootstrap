/* eslint-disable antfu/top-level-function */
import type { UserConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'

const isDev = process.env.NODE_ENV === 'development'

const removeDebuggerPlugin = () => ({
  name: 'remove-debugger',
  config(config: UserConfig, { command }: { command: 'build' | 'serve' }) {
    if (command === 'build') {
      config.build = config.build || {}
      config.build.minify = 'esbuild'
      config.esbuild = {
        ...(config.esbuild || {}),
        drop: ['debugger'],
      }
    }
  },
})

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    isDev && codeInspectorPlugin({
      bundler: 'vite',
      editor: 'cursor',
      hotKeys: ['ctrlKey'],
    }),
    removeDebuggerPlugin(),
    topLevelAwait(),
    react(),
    autoImport({
      dts: 'imports.d.ts',
      imports: ['react', 'react-router-dom'],
    }),
    tailwindcss(),
  ].filter(Boolean),
})
