import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    globals: true,
    css: true,
    // Exclude Playwright and nested worktrees from unit discovery
    exclude: [
      "node_modules/**",
      "tests/e2e/**",
      "**/node_modules/**",
      ".claude/**", // claude-code worktrees shadow the main test tree
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        "**/*.config.js",
        "**/*.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
