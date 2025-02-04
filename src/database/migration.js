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

var enums = ["create_resources_table", "create_resource_categories_table"];

var statements = [
  // create_resources_table
  `CREATE TABLE resources (${[
    "id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "user_id BIGINT UNSIGNED NOT NULL",
    "category_id BIGINT UNSIGNED NOT NULL",
    "title VARCHAR(255) NOT NULL",
    "slug VARCHAR(255) NOT NULL UNIQUE",
    "body TEXT NULL",
    "additional_fields LONGTEXT NULL",
    "link VARCHAR(255) NULL",
    "status VARCHAR(255) NULL",
    "created_at TIMESTAMP NULL",
    "created_at_order DOUBLE NULL",
    "updated_at TIMESTAMP NULL",
    "updated_at_order DOUBLE NULL",
    "deleted_at TIMESTAMP NULL",
    "deleted_at_order DOUBLE NULL",
  ]})`,
  // create_resource_categories_table
  `CREATE TABLE resource_categories (${[
    "id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "name VARCHAR(255) NOT NULL",
    "description TEXT NULL",
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
