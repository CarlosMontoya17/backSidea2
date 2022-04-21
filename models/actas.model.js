module.exports = (sequelize, Sequelize) => {
    const actas = sequelize.define("actas", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        datos: {
            type: Sequelize.JSON
        },
        estado: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        }
    }, {freezeTableName:true});
    return actas;
}