import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const production = command === 'build';
  
  return { 
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        }
      })
    ]
  };
})
