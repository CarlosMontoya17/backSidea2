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
        request: {
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
        }

    }, {freezeTableName: true});
    return robots;
};