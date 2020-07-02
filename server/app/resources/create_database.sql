# MySQL scripts for dropping existing tables and recreating the database table structure

### DROP EVERYTHING ###
# Tables/views must be dropped in reverse order due to referential constraints (foreign keys).

DROP TABLE IF EXISTS Rating;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Recipe;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS User;

### TABLES ###
# Tables must be created in a particular order due to referential constraints i.e. foreign keys.
CREATE TABLE User
(
    user_id        INT          NOT NULL AUTO_INCREMENT,
    name           VARCHAR(128) NOT NULL,
    email          VARCHAR(128) NOT NULL,
    password       VARCHAR(256) NOT NULL COMMENT 'Only store the hash here, not the actual password!',
    auth_token     VARCHAR(32),
    city           VARCHAR(128),
    country        VARCHAR(64),
    photo_filename VARCHAR(64),
    PRIMARY KEY (user_id),
    UNIQUE (email),
    UNIQUE (auth_token)
);

CREATE TABLE Category
(
    category_id INT         NOT NULL AUTO_INCREMENT,
    name        VARCHAR(64) NOT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE Recipe
(
    recipe_id      INT           NOT NULL AUTO_INCREMENT,
    title          VARCHAR(256)  NOT NULL,
    description    VARCHAR(1024) NOT NULL,
    yield          INT           NOT NULL,
    ready_in       INT           NOT NULL,
    ingredients    VARCHAR(1024) NOT NULL,
    directions     VARCHAR(2048) NOT NULL,
    author_id      INT           NOT NULL,
    category_id    INT           NOT NULL,
    posted_date    DATETIME      NOT NULL,
    photo_filename VARCHAR(256)  NOT NULL,
    PRIMARY KEY (recipe_id),
    FOREIGN KEY (author_id) REFERENCES User (user_id),
    FOREIGN KEY (category_id) REFERENCES Category (category_id)
);

CREATE TABLE Comment
(
    comment_id         INT           NOT NULL AUTO_INCREMENT,
    text               VARCHAR(1024) NOT NULL,
    photo_filename     VARCHAR(256),
    parent_comment_id  INT,
    recipe_id          INT           NOT NULL,
    author_id          INT           NOT NULL,
    posted_date        DATETIME      NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (author_id) REFERENCES User (user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comment (comment_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES Recipe (recipe_id) ON DELETE CASCADE
);

CREATE TABLE Rating
(
    user_id   INT   NOT NULL,
    recipe_id INT   NOT NULL,
    value     FLOAT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe (recipe_id) ON DELETE CASCADE
);

CREATE TABLE Save
(
    user_id    INT       NOT NULL,
    recipe_id  INT       NOT NULL,
    saved_date DATETIME  NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe (recipe_id) ON DELETE CASCADE
);


