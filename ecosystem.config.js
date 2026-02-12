module.exports = {
  apps: [
    {
      name: "laofi",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/var/www/html/laofi2",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
