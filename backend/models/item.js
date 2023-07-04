const Sequelize = require('sequelize');
const config = require('./../config');

const Item = config.define('item', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    clo_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    or_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
   
}, {timestamps: false});

module.exports = Item; 