import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Temporary diagnostic setting: preserve original variable names so
  // startup errors identify the source binding instead of a minified name.
  build: {
    minify: false,
    sourcemap: true,
  },
});
