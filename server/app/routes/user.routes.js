const users = require('../controllers/user.controller');

module.exports = function(app) {
    app.route(app.rootUrl + '/users/register')
        .post(users.register);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(users.logout);

    app.route(app.rootUrl + '/users/:id')
        .get(users.getInfo)
        .patch(users.changeInfo);

    // app.route(app.rootUrl + '/users/:id/save')
    //     .get(users.getSaved);

    app.route(app.rootUrl + '/users/:id/photo')
        .get(users.showPhoto)
        .put(users.setPhoto)
        .delete(users.removePhoto);
};