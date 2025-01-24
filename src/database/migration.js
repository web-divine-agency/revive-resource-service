import mysql from "mysql";

var mysqlClient = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 24,
  waitForConnections: true,
  queueLimit: 0,
});

var enums = ["create_branches_table"];

var statements = [
  // create_users_table
  `CREATE TABLE branches (${[
    "id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "name VARCHAR(255) NOT NULL",
    "address_line_1 VARCHAR(255) NULL",
    "address_line_2 VARCHAR(255) NULL",
    "city VARCHAR(255) NULL",
    "state VARCHAR(255) NULL",
    "country VARCHAR(255) NULL",
    "zip_code INT NULL",
    "opening TIME NULL",
    "closing TIME NULL",
    "created_at TIMESTAMP NULL",
    "created_at_order DOUBLE NULL",
    "updated_at TIMESTAMP NULL",
    "updated_at_order DOUBLE NULL",
    "deleted_at TIMESTAMP NULL",
    "deleted_at_order DOUBLE NULL",
  ]})`,
];

if (process.argv[2]) {
  mysqlClient.getConnection((err, con) => {
    if (err) throw err;

    con.query(statements[enums.indexOf(process.argv[2])], function (e) {
      con.release();

      if (e) throw e;
      console.log("Success");
    });
  });
} else {
  statements.forEach((statement) => {
    mysqlClient.getConnection((err, con) => {
      if (err) throw err;

      con.query(statement, function (e) {
        con.release();

        if (e) throw e;
        console.log("Success");
      });
    });
  });
}
