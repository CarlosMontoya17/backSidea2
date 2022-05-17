module.exports = (sequelize, Sequelize) => {
    const actas_req = sequelize.define("actas_req", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.TEXT
        },
        metadata: {
            type: Sequelize.JSON
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        },
        id_req: {
            type: Sequelize.INTEGER
        },
        send: {
            type: Sequelize.BOOLEAN
        }

    }, {freezeTableName: true});

    return actas_req;

}