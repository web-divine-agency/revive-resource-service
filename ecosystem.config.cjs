module.exports = {
  apps: [
    {
      name: "ReviveResourceService",
      namespace: "revive-resource-service",
      script: "./src/index.js",
      watch: ["./src", "./src/*.js"],
      ignore_watch: ["src/uploads"],
      output: "./logs/out.log",
      error: "./logs/error.log",
    },
  ],
};
