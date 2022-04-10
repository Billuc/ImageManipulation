import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const production = command === 'build';
  
  return { 
    resolve: { alias: {
        '@lib': '/src/lib',
        '@assets': '/src/assets',
        '@services': '/src/services',
        '@model': '/src/model'
      }
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        },
        hot: !production
      })
    ],
    server: {
      watch: {
        usePolling: true
      }
    }
  };
})
