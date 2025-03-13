const env = {
  dev: {
    databaseService: "http://revive-database-service:8801",
    userService: "http://revive-user-service:8802",
    ticketService: "http://revive-ticket-service:8803",
    branchService: "http://revive-branch-service:8804",
    loggerService: "http://revive-logger-service:8805",
  },
  uat: {
    databaseService: "http://revive-database-service:8801",
    userService: "http://revive-user-service:8802",
    ticketService: "http://revive-ticket-service:8803",
    branchService: "http://revive-branch-service:8804",
    loggerService: "http://revive-logger-service:8805",
  },
};

export const url = env[process.env.APP_ENV];
