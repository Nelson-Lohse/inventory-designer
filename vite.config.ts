import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// See ARCHITECTURE.md for why no backend/server config lives here yet.
export default defineConfig({
  plugins: [react()],
});
