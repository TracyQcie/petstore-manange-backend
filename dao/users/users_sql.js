module.exports = {
    addUser:"INSERT INTO users (headerImg, username, password, addres, sex, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?);",
    deleteUser: "DELETE FROM users WHERE id = ?;",
    queryUser: "SELECT * FROM users WHERE id = ?;",
    updateUser: "INSERT INTO users (id, headerImg, username, password, addres, sex, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE;"
}