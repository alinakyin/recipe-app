const recipes = require('../controllers/recipe.controller');

module.exports = function(app) {
    app.route(app.rootUrl + '/recipes')
        .get(recipes.list);
        // .post(recipes.add);

     app.route(app.rootUrl + '/recipes/categories')
         .get(recipes.categories);

    app.route(app.rootUrl + '/recipes/:id')
         .get(recipes.listInfo);
    //     .patch(recipes.changeInfo)
    //     .delete(recipes.remove);
    //
    // app.route(app.rootUrl + '/recipes/:id/photo')
    //     .get(recipes.showPhoto)
    //     .put(recipes.setPhoto);
    //
    app.route(app.rootUrl + '/recipes/:id/comments')
         .get(recipes.listComments);
    //     .post(recipes.comment)
    //     .delete(recipes.removeComment);
};
