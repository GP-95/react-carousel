import reactRefresh from '@vitejs/plugin-react-refresh'
import {defineConfig} from 'vite'

export default defineConfig({
    esbuild: {
        jsxInject: `import React from 'react'`
    }, 
    plugins: [reactRefresh()]
})