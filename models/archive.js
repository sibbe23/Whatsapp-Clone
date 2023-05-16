const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const ArchivedChat = sequelize.define("archived_chat", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    from: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = ArchivedChat;