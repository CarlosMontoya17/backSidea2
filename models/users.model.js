module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.TEXT
        },
        password: {
            type: Sequelize.TEXT
        },
        rol: {
            type: Sequelize.TEXT
        },
        type: {
            type: Sequelize.TEXT
        },
        idSuper: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        precios: {
            type: Sequelize.JSON
        },
        crm: {
            type: Sequelize.BOOLEAN
        }
        

    }, { freezeTableName: true });
    return Users;
}