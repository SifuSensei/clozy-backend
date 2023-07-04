const Sequelize = require('sequelize');
const config = require('./../config');

const Review = config.define('review', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clothes_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: false
    },
    star: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {timestamps: false});

module.exports = Review;