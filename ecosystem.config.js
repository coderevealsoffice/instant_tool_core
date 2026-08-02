module.exports = {
  apps: [
    {
      name: "instant-tool-ai",
      script: ".next/standalone/server.js",
      cwd: "/var/www/instant-tool-ai",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};