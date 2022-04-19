module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
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
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        }
        

    }, { freezeTableName: true });
    return Users;
}