const promise = require("bluebird");
const { Client } = require("pg");
const config = require("./config");

let connection;

class DB {
  async getConnection() {
    return new promise((resolve, reject) => {
      connection = new Client({
        host: 'localhost',
        user: 'postgres',
        password: 'root',
        database: 'mobilefirst',
      });
      connection.connect((err) => {
        if (err) {
          console.error("error connecting: " + err.stack);
          reject("Error while connectiong database !");
        }
        console.log(
          `connected to mobilefirst as id ${connection.processID}`
        );
        resolve("Database Connected !");
      });
    });
  }

  select(table, selectParams, condition) {
    return new promise((resolve, reject) => {
      let query = `SELECT ${selectParams} FROM ${table}`;
      if (condition) {
        query += ` WHERE ${condition}`;
      }
      console.log("\n\n", query, "\n\n");
      connection.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject("DB_ERROR");
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  insert(table, data) {
    return new promise((resolve, reject) => {
      let query = `INSERT INTO ${table}(${Object.keys(data).join(
          ","
        )}) VALUES(${Object.keys(data).map(
          (d, index) => "$" + (index + 1)
        )}) RETURNING *`,
        values = Object.values(data);
      console.log("query", query);
      connection.query(query, values, (error, results) => {
        if (error) {
          console.log(error);
          reject("DB_ERROR");
        } else {
          resolve(results.rows[0]);
        }
      });
    });
  }

  update(table, condition, data) {
    return new promise((resolve, reject) => {
      let query = `UPDATE ${table} SET ${Object.entries(data).map(
        (entry) =>
          entry[0] + "=" + (entry[1] == null ? entry[1] : "'" + entry[1] + "'")
      )} WHERE ${condition}`;
      console.log("query", query);
      connection.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject("DB_ERROR");
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = new DB();
