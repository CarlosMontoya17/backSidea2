const controller = require("../controllers/notifications.controller");
const session = require("../middlewares/verifySession");
module.exports =  (app, socket) => {
    app.post('/api/notify/newNotify/', session.verifySession, (req, res) => {
        const notify = { data: req.body};
        socket.emit('notification', notify);
        res.json(notify);
    });
}