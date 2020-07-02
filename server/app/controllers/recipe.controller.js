const Recipe = require('../models/recipe.model');
const User = require('../models/user.model');
// const fs = require('fs');
// const photoDirectory = './storage/photos/';

//View recipes
exports.list = async function(req, res){
    try {
        let q = req.query.q;
        let categoryId = req.query.categoryId;
        let authorId = req.query.authorId;
        let sortBy = req.query.sortBy;
        let startIndex = +req.query.startIndex;
        let count = +req.query.count;
        const results = await Recipe.getRecipes(q, categoryId, authorId, sortBy);
        if (results === -1) {
            return res.sendStatus(500);
        } else {
            results.push({"numResults": results.length}); // For paginating matters on the front end

            if (!(isNaN(startIndex)) && !(isNaN(count))) { // Checking if they exist
                return res.status(200)
                    .send(results.slice(startIndex, startIndex + count));
            } else if (!(isNaN(startIndex))) { // If only the startIndex exists
                return res.status(200)
                    .send(results.slice(startIndex))
            } else {
                return res.status(200)
                    .send(results);
            }
        }

    } catch (err) {
        return res.sendStatus(500);
    }
};


//Retrieve all recipe categories
exports.categories = async function(req, res){
    try {
        const results = await Recipe.getCategories();
        if (results === -1) {
            return res.sendStatus(500);
        } else {
            let categories = [];
            for (let i = 0; i < results.length; i++) {
                categories.push({categoryId: results[i].category_id, name: results[i].name});
            }
            return res.status(200)
                .send(categories);
        }
    } catch (err) {
        return res.sendStatus(500);
    }
};


//Retrieve detailed information about a recipe
exports.listDetails = async function(req, res) {
    try {
        let id = +req.params.id;
        const isValidId = await Recipe.isValidRecipeId(id);

        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            const [recipeId, title, description, yield, readyIn, ingredients, directions, authorId, authorName, authorCity, authorCountry, category, postedDate, averageRating] = await Recipe.getRecipe(id);
            return res.status(200)
                .send({recipeId: recipeId, title: title, description: description, yield: yield, readyIn: readyIn, ingredients: ingredients,
                    directions: directions, authorId: authorId, authorName: authorName, authorCity: authorCity, authorCountry: authorCountry,
                    category: category, postedDate: postedDate, averageRating: averageRating});
        }
    } catch (err) {
        return res.sendStatus(500);
    }
};


//Retrieve a recipe's comments
exports.listComments = async function(req, res){
    try {
        let id = +req.params.id;
        const isValidId = await Recipe.isValidRecipeId(id);

        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            const results = await Recipe.getComments(id);
            if (results === -1) {
                return res.sendStatus(500);
            } else {
                return res.status(200)
                    .send(results);
            }
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};


//Add a new recipe
exports.add = async function(req, res){
    try {
        let currToken = req.get('X-Authorization');
        const exists = await User.tokenExists(currToken);
        if (!(exists) || currToken === undefined) {
            return res.sendStatus(401);
        } else {
            let recipe_data = {
                "title": req.body.title,
                "description": req.body.description,
                "yield": req.body.yield,
                "readyIn": req.body.readyIn,
                "ingredients": req.body.ingredients,
                "directions": req.body.directions,
                "categoryId": req.body.categoryId
            };

            let title = recipe_data['title'].toString();
            let description = recipe_data['description'].toString();
            let yield = recipe_data['yield'].toString();
            let readyIn = recipe_data['readyIn'].toString();
            let ingredients = recipe_data['ingredients'].toString();
            let directions = recipe_data['directions'].toString();
            let categoryId = recipe_data['categoryId'];
            let postedDate = new Date();

            const categoryExists = await Recipe.categoryExists(categoryId);

            if (!(categoryExists)) {
                return res.sendStatus(400);
            } else {
                const authorId = await User.getId(currToken);
                let recipe_details = [title, description, yield, readyIn, ingredients, directions, authorId, categoryId, postedDate];
                let insertId = await Recipe.insert(recipe_details);
                if (insertId === -1) {
                    return res.sendStatus(400);
                } else {
                    return res.status(201)
                        .send({recipeId: insertId});
                }
            }
        }

    } catch (err) {
        return res.sendStatus(400);
    }
};

/*
//Change a petition's details
exports.changeInfo = async function(req, res){
    try {
        const petitionId = +req.params.id;
        const isValidId = await Petition.isValidPetitionId(petitionId);
        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            const author_id = await Petition.getAuthor(petitionId);
            let currToken = req.get('X-Authorization'); // the user making the request
            if (currToken === undefined) { // no one logged in
                return res.sendStatus(401);
            } else {
                const userToken = await User.getToken(author_id); // the one authorised
                if (currToken !== userToken) {
                    return res.sendStatus(403);
                }
            }
        }

        let valid = true;

        if (Object.keys(req.body).length === 0) {
            console.log("No req.body");
            valid = false;
        }

        if (req.body.closingDate) {
            let currDateTime = new Date();
            if (req.body.closingDate < currDateTime) {
                valid = false;
            }
        }

        if (req.body.categoryId) {
            const categoryExists = await Petition.categoryExists(req.body.categoryId);
            if (!(categoryExists)) {
                valid = false;
            }
        }

        if (valid) {
            const [ogTitle, ogDescription, ogCategoryId, ogClosingDate] = await Petition.getDetails(petitionId);
            //let isSame = true;

            if (req.body.title) {
                const title = req.body.title.toString();
                if (title !== ogTitle) {
                    //isSame = false;
                    await Petition.updateTitle(petitionId, title);
                }
            }

            if (req.body.description) {
                const description = req.body.description.toString();
                if (description !== ogDescription) {
                    //isSame = false;
                    await Petition.updateDescription(petitionId, description);
                }
            }

            if (req.body.categoryId) {
                console.log("patch categoryId = " + req.body.categoryId);
                console.log(typeof req.body.categoryId);
                console.log("original categoryId = " + ogCategoryId);
                console.log(typeof ogCategoryId);
                if (req.body.categoryId !== ogCategoryId) {
                    //isSame = false;
                    await Petition.updateCategoryId(petitionId,  req.body.categoryId);
                }
            }

            if (req.body.closingDate) {
                const closingDate = req.body.closingDate.toString();
                if (closingDate !== ogClosingDate) {
                    //isSame = false;
                    await Petition.updateClosingDate(petitionId, closingDate);
                }
            }

            if (req.body.closingDate == null) {
                if (ogClosingDate != null) {
                    //isSame = false;
                    await Petition.updateClosingDate(petitionId, req.body.closingDate);
                }
            }

            return res.sendStatus(200);

            // if (isSame) {
            //     return res.sendStatus(400);
            // } else {
            //     return res.sendStatus(200);
            // }

        } else {
            return res.sendStatus(400);
        }

    } catch (err) {
        //console.log(err)
        return res.sendStatus(500);
    }
};


//Delete a petition
exports.remove = async function(req, res){
    try {
        const petitionId = +req.params.id;
        const isValidId = await Petition.isValidPetitionId(petitionId);
        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            const author_id = await Petition.getAuthor(petitionId);
            let currToken = req.get('X-Authorization'); // the user making the request
            if (currToken === undefined) { // no one logged in
                return res.sendStatus(401);
            } else {
                const userToken = await User.getToken(author_id); // the one authorised
                if (currToken !== userToken) {
                    return res.sendStatus(403);
                }
            }
        }

        await Petition.remove(petitionId);
        await Petition.removeAll(petitionId);
        return res.sendStatus(200);

    } catch (err) {
        return res.sendStatus(500);
    }
};


//Sign a petition
exports.comment = async function(req, res){
    try {
        let petitionId = +req.params.id;
        const isValidId = await Petition.isValidPetitionId(petitionId);
        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            let currToken = req.get('X-Authorization'); // the user making the request
            if (currToken === undefined) { // no one logged in
                return res.sendStatus(401);
            } else {
                const userId = await User.getId(currToken);
                let currDateTime = new Date();
                const hasSigned = await User.hasSigned(userId, petitionId);
                const hasClosed = await Petition.hasClosed(petitionId, currDateTime);
                if (hasSigned || hasClosed) {
                    return res.sendStatus(403);
                } else {
                    let signature_details = [userId, petitionId, currDateTime];
                    await Petition.addSignature(signature_details);
                    return res.sendStatus(201);
                }
            }
        }

    } catch (err) {
        return res.sendStatus(500);
    }
};


//Remove a signature from a petition
exports.removeComment = async function(req, res){
    try {
        let petitionId = +req.params.id;
        const isValidId = await Petition.isValidPetitionId(petitionId);
        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            let currToken = req.get('X-Authorization'); // the user making the request
            if (currToken === undefined) { // no one logged in
                return res.sendStatus(401);
            } else {
                const userId = await User.getId(currToken);
                const author = await Petition.getAuthor(petitionId);
                let currDateTime = new Date();
                const hasSigned = await User.hasSigned(userId, petitionId);
                const hasClosed = await Petition.hasClosed(petitionId, currDateTime);
                if (!(hasSigned) || hasClosed || (userId === author)) {
                    return res.sendStatus(403);
                } else {
                    await Petition.removeOne(userId, petitionId);
                    return res.sendStatus(200);
                }
            }
        }

    } catch (err) {
        return res.sendStatus(500);
    }
};


//Retrieve a petition's hero image
exports.showPhoto = async function(req, res){
    try {
        let id = +req.params.id;
        const isValidId = await Petition.isValidPetitionId(id);
        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            const photo_filename = await Petition.getPhoto(id);
            if (photo_filename == null) {
                return res.sendStatus(404);
            } else {
                const type = photo_filename.split('.')[1];
                const image = fs.readFileSync(photoDirectory + photo_filename);
                // const image = fs.createReadStream(photoDirectory + photo_filename);
                //
                // image.pipe(res);
                res.type(type);
                res.send(image);
                return res.status(200);
            }
        }
    } catch (err) {
        return res.sendStatus(500);
    }
};


//Set a petition's hero image
exports.setPhoto = async function(req, res){
    try {
        const petitionId = +req.params.id;
        const isValidId = await Petition.isValidPetitionId(petitionId);
        if (!(isValidId)) {
            return res.sendStatus(404);
        } else {
            const author_id = await Petition.getAuthor(petitionId);
            let currToken = req.get('X-Authorization'); // the user making the request
            if (currToken === undefined) { // no one logged in
                return res.sendStatus(401);
            } else {
                const userToken = await User.getToken(author_id); // the one authorised
                if (currToken !== userToken) {
                    return res.sendStatus(403);
                }
            }
        }

        const currPhoto = await Petition.getPhoto(petitionId);
        // get the binary data from the request body and store the photo in a place it can be retrieved from + update database to set the photo_filename
        const photoType = req.get('Content-Type');
        if (photoType === 'image/jpeg') {
            let currDateTime = new Date().toString();
            const photoName = 'petition_' + petitionId + '_' + Date.parse(currDateTime) + '.jpg';
            const image = req.body;
            fs.writeFileSync(photoDirectory + photoName, image);
            // const file = fs.createWriteStream(photoDirectory + photoName);
            // req.pipe(file);

            await Petition.putPhoto(petitionId, photoName);
        } else if (photoType === 'image/png') {
            let currDateTime = new Date().toString();
            const photoName = 'petition_' + petitionId + '_' + Date.parse(currDateTime) + '.png';
            const image = req.body;
            fs.writeFileSync(photoDirectory + photoName, image);
            // const file = fs.createWriteStream(photoDirectory + photoName);
            // req.pipe(file);

            await Petition.putPhoto(petitionId, photoName);
        } else if (photoType === 'image/gif') {
            let currDateTime = new Date().toString();
            const photoName = 'petition_' + petitionId + '_' + Date.parse(currDateTime) + '.gif';
            const image = req.body;
            fs.writeFileSync(photoDirectory + photoName, image);
            // const file = fs.createWriteStream(photoDirectory + photoName);
            // req.pipe(file);

            await Petition.putPhoto(petitionId, photoName);
        } else {
            return res.sendStatus(400);
        }

        if (currPhoto == null) {
            return res.sendStatus(201);
        } else {
            return res.sendStatus(200);
        }

    } catch (err) {
        res.sendStatus(500);
    }
};

*/