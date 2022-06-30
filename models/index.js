const cnfg = require("../config/db.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    cnfg.DB,
    cnfg.USER,
    cnfg.PASSWORD,
    {
        host: cnfg.HOST,
        dialect: cnfg.DIALECT,
        dialectOptions: { useUTC: false },
        timezone: '-05:00',
        pool: {
            max: cnfg.pool.max,
            min: cnfg.pool.min,
            acquire: cnfg.pool.acquire,
            idle: cnfg.pool.idle
        },
        logging: false,
        
    }
);
const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;

//Users
database.Users = require("./users.model")(sequelize,Sequelize);
database.Capturistas = require("./capturistas.model")(sequelize,Sequelize);
database.Prospectos = require("./prospectos.model")(sequelize, Sequelize);

//Documents Registers
    //Notify - Sockets
database.Notifications = require("./notifications.model")(sequelize, Sequelize);
    //Registers
database.Actas_reg = require("./actas_reg.model")(sequelize, Sequelize);
database.Actas_Trash = require("./actas_trash.model")(sequelize, Sequelize);
    //Requests
database.Actas_req = require("./actas_req.model")(sequelize, Sequelize);
database.Rfc_req = require("./rfc_req.model")(sequelize,Sequelize);

//Others
database.Actas = require("./actas.model")(sequelize,Sequelize);
database.Publicidad = require("./publicidad.model")(sequelize, Sequelize);

module.exports = database;