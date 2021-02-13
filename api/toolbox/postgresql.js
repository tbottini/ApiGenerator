const { Client } = require("pg");

class PsqlController {
  client;
  constructor({
    database,
    callback,
    user = "postgres",
    host = "localhost",
    password = "psql",
    port = 5432
  }) {
    console.log(database);

    this.client = new Client({
      user: user,
      host: host,
      database: database,
      password: password,
      port: port
    });

    this.client.connect().then(r => {
      if (callback) callback(this);
    });
  }

  async query(sql, val) {
    if (val) {
      val.forEach(p => {
        sql = sql.replace("?", p);
      });
    }
    //console.log(sql);
    try {
      var res = await this.client.query(sql);
      return res.rows;
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  }

  async get(sql, val) {
    var r = await this.query(sql, val);
    if (r.error) return r;
    return r[0];
  }

  async all(sql, val) {
    return await this.query(sql, val);
  }

  async run(sql, val) {
    var r = await this.query(sql, val);
    if (r.error) return r.error;
  }
}

module.exports = PsqlController;
