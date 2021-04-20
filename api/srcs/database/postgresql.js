const { Client } = require("pg");

const DEBUG = process.env.NODE_ENV != "production";

/*
 * Overlay of Postgresql controller
 * provide function for handle query
 */
class PsqlController {
  client;
  user;
  password;
  host;
  port;

  constructor({
    database,
    callback,
    user = "postgres",
    host = "localhost",
    password = "psql",
    port = 5432,
    virgin = false
  }) {
    this.user = user;
    this.password = password;
    this.host = host;
    this.port = port;
    this.database = database;
    this.callbackConnect = callback;

    console.log("PostgresqlController: database " + database);

    if (!virgin) this.connect(this.database);
  }

  init() {}

  async connect(database) {
    return new Promise(resolve => {
      this.client = new Client({
        user: this.user,
        host: this.host,
        database: database,
        password: this.password,
        port: this.port
      });

      this.client.connect().then(() => {
        if (this.callbackConnect) this.callbackConnect(this);
        return resolve(this);
      });
    });
  }

  async query(sql, val, debug) {
    if (val) {
      val.forEach(p => {
        sql = sql.replace("\\?", p);
      });
    }
    if (debug) {
      console.log(sql);
    }

    try {
      var res = await this.client.query(sql);
      return res.rows;
    } catch (e) {
      console.error(e);
      return { error: true };
    }
  }

  async get(sql, val) {
    var r = await this.query(sql, val, DEBUG);
    if (r.error) return r;
    return r[0];
  }

  async all(sql, val) {
    return await this.query(sql, val, DEBUG);
  }

  async run(sql, val, debug = DEBUG) {
    var r = await this.query(sql, val, debug);
    return r;
  }

  async init(sql, val) {
    this.run(sql, val, false);
  }

  /*
   * Create and db and connect
   */
  async createdb(namedb) {
    await this.run("create db ? ", [namedb]);
    return await this.connect(namedb);
  }
}

module.exports = PsqlController;
