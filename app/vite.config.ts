import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const dev = command === 'serve';

  return {
    plugins: [
      svelte({
        compilerOptions: {
          dev: dev
        }
      })
    ] 
  };
})
