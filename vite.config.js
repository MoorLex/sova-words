import path from 'path'
import vue from '@vitejs/plugin-vue'

module.exports = {
  build: {
    chunkSizeWarningLimit: 700
  },
  resolve: {
    alias: {
      '/~': path.resolve(__dirname, 'src'),
      '/-': path.resolve(__dirname, 'node_modules/@la-moore/shared'),
    }
  },
  plugins: [
    vue()
  ],
  optimizeDeps: {
    include: [],
  }
}
