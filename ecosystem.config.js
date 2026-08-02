module.exports = {
  apps: [
    {
      name: "instant-tool-3002",
      script: "npm",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3002, // Aap ise apni zarurat ke hisaab se change kar sakte hain
      },
      instances: "max", // Yeh aapke VPS ke CPU cores ke hisaab se instances banayega (cluster mode)
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G", // Agar app 1GB se zyada RAM use karta hai toh auto-restart hoga
    },
  ],
};
