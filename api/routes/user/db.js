const sqlite3 = require('sqlite3').verbose();

const dbname = 'mySqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname)

// 创建一个articles表
db.serialize(() => {
  const sql = `
        CREATE TABLE IF NOT EXISTS users
        (id integer primary key,name,email,phone TEXT)
    `;
  // 如果没有users表,创建一个
  db.run(sql);
});

// Users API
class Users {
  // 获取所有user
  static all(cb) {
    // 使用sqlite3的all
    db.all('SELECT * FROM users', cb);
  }
  // 根据id 获取用户信息
  static find(id, cb) {
    // 使用sqlite3的get
    db.run('SELECT * FROM users WHERE id = ?', id,cb);
  }
  // 创建一个用户
  static create(data, cb) {
    const sql = `
                INSERT INTO
                users(name,email,phone)
                VALUES(?,?,?)
                ;select last_insert_rowid();`;
    db.run(sql, data.name, data.email, data.phone, cb);
  }
  // 更新用户信息
  static update(data, cb) {
    const sql = `
            UPDATE users
            SET name=?,email=?, phone=?
            WHERE id=?
        `
    db.run(sql, data.name, data.email, data.phone, data.id, cb)
  }
}
module.exports.Users = Users;
