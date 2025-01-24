module.exports = {
  apps: [
    {
      name: "03-BranchService",
      namespace: "revive-branch-service",
      script: "./src/index.js",
      watch: ["./src", "./src/*.js"],
      output: "./logs/out.log",
      error: "./logs/error.log",
    },
  ],
};
