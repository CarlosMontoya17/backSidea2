module.exports = (sequelize, Sequelize) => {
    const rfc_req = sequelize.define("rfc_req", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        search: {
            type: Sequelize.TEXT
        },
        data: {
            type: Sequelize.TEXT
        },
        comments: {
            type: Sequelize.TEXT
        },
        namefile: {
            type: Sequelize.TEXT
        },
        corte: {
            type: Sequelize.DATE
        },
        ip: {
            type: Sequelize.TEXT
        },
        id_req: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        },
        robot: {
            type: Sequelize.INTEGER
        },
        idtranspose: {
            type: Sequelize.INTEGER
        },
        downloaded: {
            type: Sequelize.BOOLEAN
        }

    }, {freezeTableName: true});
    return rfc_req;
}