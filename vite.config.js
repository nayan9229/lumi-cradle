import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/ws': {
          target: proxyTarget,
          ws: true,
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET' || err.code === 'EPIPE') {
                return
              }
              console.error('[vite] ws proxy error:', err.message)
            })
          },
        },
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
