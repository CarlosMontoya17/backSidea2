module.exports = (sequelize, Sequelize) => {
    const robots = sequelize.define("robots", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        instructions: {
            type: Sequelize.TEXT
        },
        name: {
            type: Sequelize.TEXT
        },
        asset: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.TEXT
        },
        source: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        },
        system:{
            type: Sequelize.TEXT
        }

    }, {freezeTableName: true});
    return robots;
};