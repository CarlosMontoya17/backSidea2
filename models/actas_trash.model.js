module.exports = (sequelize, Sequelize) => {
    const actas_trash = sequelize.define("actas_trash", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idsuper:{
            type: Sequelize.INTEGER
        },
        document: {
            type: Sequelize.TEXT
        },
        state: {
            type: Sequelize.TEXT
        },
        dataset: {
            type: Sequelize.TEXT
        },
        nameinside: {
            type: Sequelize.TEXT
        },
        level0: {
            type: Sequelize.INTEGER
        },
        price0: {
            type: Sequelize.DOUBLE
        },
        level1: {
            type: Sequelize.INTEGER
        },
        price1: {
            type: Sequelize.DOUBLE
        },
        level2: {
            type: Sequelize.INTEGER
        },
        price2: {
            type: Sequelize.DOUBLE
        },
        level3: {
            type: Sequelize.INTEGER
        },
        price3: {
            type: Sequelize.DOUBLE
        },
        level4: {
            type: Sequelize.INTEGER
        },
        price4: {
            type: Sequelize.DOUBLE
        },
        level5: {
            type: Sequelize.INTEGER
        },
        price5: {
            type: Sequelize.DOUBLE
        },
        corte: {
            type: Sequelize.DATE
        },
        send: {
            type: Sequelize.BOOLEAN
        },
        idcreated: {
            type: Sequelize.INTEGER
        },
        idhidden: {
            type: Sequelize.INTEGER
        },
        idtranspose: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        namefile: {
            type: Sequelize.TEXT
        }
    }, {freezeTableName: true});

    return actas_trash;
}