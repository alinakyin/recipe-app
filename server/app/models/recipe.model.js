const db = require('../../config/db');

//View recipes
exports.getRecipes = async function(q, categoryId, authorId, sortBy) {
    try {
        const connection = await db.getPool().getConnection();

        var sql = "SELECT Recipe.recipe_id AS recipeId, title, description, yield, ready_in AS readyIn, Category.name AS category, " +
            "User.name AS authorName, avg(value) AS averageRating " +
            "FROM Recipe, Category, User, Rating " +
            "WHERE Recipe.category_id = Category.category_id AND Recipe.author_id = User.user_id AND Recipe.recipe_id = Rating.recipe_id";

        if (q != null) {
            sql += " AND title LIKE '%" + q + "%'";
        }

        if (categoryId != null ) {
            sql += " AND Recipe.category_id = " + categoryId;
        }

        if (authorId != null) {
            sql += " AND Recipe.author_id = " + authorId;
        }

        sql += " GROUP BY recipeId";

        if (sortBy == "READY_ASC") {
            sql += " ORDER BY readyIn ASC";
        } else if (sortBy == "READY_DESC") {
            sql += " ORDER BY readyIn DESC";
        } else if (sortBy == "RATING_ASC") {
            sql += " ORDER BY averageRating ASC, recipeId"; // In case of tiebreakers
        } else {
            sql += " ORDER BY averageRating DESC, recipeId";
        }

        const [results, _] = await connection.query(sql);
        connection.release();
        return results;

    } catch {
        return -1;
    }
};


//Retrieve all recipe categories
exports.getCategories = async function(){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT * FROM Category";

        const [results, _] = await connection.query(sql);
        connection.release();
        return results;
    } catch {
        return -1;
    }
};


//Retrieve detailed information about a recipe
exports.getRecipe = async function(recipeId){
    try {
        const connection = await db.getPool().getConnection();

        const sql = "SELECT Recipe.recipe_id AS recipeId, title, description, yield, ready_in AS readyIn, ingredients, directions, User.user_id AS authorId, User.name AS authorName, " +
            "User.city as authorCity, User.country as authorCountry, Category.name AS category, posted_date AS postedDate, avg(value) AS averageRating " +
            "FROM Recipe, User, Category, Rating " +
            "WHERE Recipe.author_id = User.user_id AND Recipe.category_id = Category.category_id AND Recipe.recipe_id = Rating.recipe_id " +
            "AND Recipe.recipe_id = " + recipeId +
            " GROUP BY Recipe.recipe_id";

        const [results, _] = await connection.query(sql);
        connection.release();
        const title = results[0].title;
        const description = results[0].description;
        const yield = results[0].yield;
        const readyIn = results[0].readyIn;
        const ingredients = results[0].ingredients;
        const directions = results[0].directions;
        const authorId = results[0].authorId;
        const authorName = results[0].authorName;
        const authorCity = results[0].authorCity;
        const authorCountry = results[0].authorCountry;
        const category = results[0].category;
        const postedDate = results[0].postedDate;
        const averageRating = results[0].averageRating;
        return [recipeId, title, description, yield, readyIn, ingredients, directions, authorId, authorName, authorCity, authorCountry, category, postedDate, averageRating];

    } catch {
        return -1;
    }
};


//Check that recipe exists
exports.isValidRecipeId = async function(recipeId) {
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT count(*) AS count FROM Recipe WHERE recipe_id = " + recipeId;
        const [results, _] = await connection.query(sql);

        connection.release();
        if (results[0].count === 1) {
            return true;
        }
    } catch {
        return -1;
    }
};


//Retrieve a recipe's comments
exports.getComments = async function(recipeId){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "WITH RECURSIVE cte AS ( " +
            "SELECT comment_id, text, author_id, posted_date, CAST(comment_id AS CHAR(200)) AS path, 0 as depth " +
            "FROM Comment " +
            "WHERE recipe_id = 12 AND parent_comment_id IS NULL " +
            "UNION ALL " +
            "SELECT c.comment_id, c.text, c.author_id, c.posted_date, CONCAT(cte.path, \",\", c.comment_id), cte.depth+1 " +
            "FROM Comment c JOIN cte " +
            "ON cte.comment_id=c.parent_comment_id ) " +
            "SELECT * FROM cte ORDER BY path;";

        const [results, _] = await connection.query(sql);
        connection.release();
        return results;
    } catch (err) {
        console.log(err);
        return -1;
    }
};


//Insert a new recipe
exports.insert = async function(recipe_details){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "INSERT INTO Petition (title, description, yield, ready_in, ingredients, directions, author_id, category_id, posted_date) VALUES (?,?,?,?,?,?,?,?,?)";
        let [result, _] = await connection.query(sql, recipe_details);
        connection.release();
        return result.insertId;
    } catch {
        return -1;
    }
};


//Check that a category exists
exports.categoryExists = async function(categoryId) {
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT count(*) AS count FROM Category WHERE category_id = " + categoryId;
        const [results, _] = await connection.query(sql);
        connection.release();
        if (results[0].count === 1) {
            return true;
        }
    } catch {
        return -1;
    }
};

/*
//Get all petition details associated with the id
exports.getDetails = async function(id){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT title, description, category_id, closing_date FROM Petition WHERE petition_id = " + id;
        const [row, _] = await connection.query(sql);
        connection.release();
        const title = row[0].title;
        const description = row[0].description;
        const categoryId = row[0].category_id;
        const closingDate = row[0].closing_date;
        return [title, description, categoryId, closingDate];
    } catch {
        return -1;
    }
};


//Update title
exports.updateTitle = async function(id, title){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "UPDATE Petition SET title = ? WHERE petition_id = " + id;
        await connection.query(sql, [title]);
        connection.release();
    } catch {
        return -1;
    }
};


//Update description
exports.updateDescription = async function(id, description){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "UPDATE Petition SET description = ? WHERE petition_id = " + id;
        await connection.query(sql, [description]);
        connection.release();
    } catch {
        return -1;
    }
};


//Update categoryId
exports.updateCategoryId = async function(id, categoryId){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "UPDATE Petition SET category_id = ? WHERE petition_id = " + id;
        await connection.query(sql, [categoryId]);
        connection.release();
    } catch {
        return -1;
    }
};


//Update closingDate
exports.updateClosingDate = async function(id, closingDate){
    try {
        const connection = await db.getPool().getConnection();
        if (closingDate == null) {
            let sql = "UPDATE Petition SET closing_date = NULL WHERE petition_id = " + id;
            await connection.query(sql);
            connection.release();
        } else {
            let sql = "UPDATE Petition SET closing_date = ? WHERE petition_id = " + id;
            await connection.query(sql, [closingDate]);
            connection.release();
        }

    } catch {
        return -1;
    }
};


//Delete a petition
exports.remove = async function(id){
    try {
        const connection = await db.getPool().getConnection();
        const sql = 'DELETE FROM Petition WHERE petition_id = ?';
        await connection.query(sql, [id]);
        connection.release();
    } catch {
        return -1;
    }
};


//Delete all of a petition's signatures
exports.removeAll = async function(id){
    try {
        const connection = await db.getPool().getConnection();
        const sql = 'DELETE FROM Signature WHERE petition_id = ?';
        await connection.query(sql, [id]);
        connection.release();
    } catch {
        return -1;
    }
};


//Retrieve author_id of a petition
exports.getAuthor = async function(petitionId){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT author_id FROM Petition where petition_id = " + petitionId;

        const [results, _] = await connection.query(sql);
        connection.release();
        return results[0].author_id;
    } catch {
        return -1;
    }
};


//Check if a petition has closed
exports.hasClosed = async function(petitionId, currentDate) {
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT closing_date FROM Petition WHERE petition_id = " + petitionId;
        const [results, _] = await connection.query(sql);
        connection.release();
        if (results[0].closing_date < currentDate) {
            return true;
        }
    } catch {
        return -1;
    }
};


//Insert a new petition
exports.addSignature = async function(signature_details){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "INSERT INTO Signature (signatory_id, petition_id, signed_date) VALUES (?,?,?)";
        await connection.query(sql, signature_details);
        connection.release();

    } catch {
        return -1;
    }
};


//Delete one signature from a petition
exports.removeOne = async function(userId, petitionId){
    try {
        const connection = await db.getPool().getConnection();
        const sql = 'DELETE FROM Signature WHERE signatory_id = ? AND petition_id = ?';
        await connection.query(sql, [userId, petitionId]);
        connection.release();
    } catch {
        return -1;
    }
};


//Retrieve a petition's hero image photo_filename
exports.getPhoto = async function(petitionId){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "SELECT photo_filename FROM Petition WHERE petition_id = " + petitionId;

        const [results, _] = await connection.query(sql);
        connection.release();
        return results[0].photo_filename;
    } catch {
        return -1;
    }
};


//Update a petition's photo_filename
exports.putPhoto = async function(petitionId, filename){
    try {
        const connection = await db.getPool().getConnection();
        const sql = "UPDATE Petition SET photo_filename = ? WHERE petition_id = " + petitionId;

        await connection.query(sql, [filename]);
        connection.release();
    } catch {
        return -1;
    }
};

*/