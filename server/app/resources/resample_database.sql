INSERT INTO Category (category_id, name)
VALUES (1, 'Breakfast'),
       (2, 'Lunch'),
       (3, 'Dinner'),
       (4, 'Dessert'),
       (5, 'Snacks'),
       (6, 'Other');

INSERT INTO Recipe (recipe_id, title, description, yield, ready_in, ingredients, directions, author_id, category_id, posted_date, photo_filename)
VALUES  (1, 'Brownies', 'Enjoy these with some vanilla ice cream!', 20, 50, '2 cups flour\n1/2 cup cocoa powder\n1 cup sugar\n200g butter\n1 egg',
        'Preheat oven\nCream butter and sugar\nCombine dry ingredients\nMix together\nPour in tin\nBake for 30 min', 4, 4,
        '2020-01-23', 'recipe_1.jpg'),
        (2, 'Scrambled eggs', 'A nutritious breakfast', 4, 20, '4 eggs, beaten\n1/2 cup milk\n1/2 tsp salt\nPinch pepper\n2 mushrooms',
                'Slice mushrooms\nAdd mushrooms, milk, salt and pepper to the eggs\nHeat oil in a pan\nSwirl eggs around until they are cooked',
                 6, 1, '2019-02-12', 'recipe_2.png'),
        (3, 'Mashed potatoes', 'Try this quick and easy dinner staple', 6, 35, '12 medium potatoes\n1 tsp salt\n\n1/4 tsp pepper\n1/4 cup milk\nKnob of butter',
                'Boil water in large pot\nChop potatoes and place in hot water\nOnce potatoes are soft, drain most of the water\nAdd salt, pepper, milk and butter\nMash until smooth',
                1, 3, '2020-06-03', 'recipe_3.jpg'),
        (4, 'Scones', 'Serve hot with jam and cream!', 12, 45, '1 1/2 cups flour\n1/3 cup sugar\n90g butter, cold\n2/3 cup milk\n1/4 tsp salt',
                'Preheat oven\nCombine flour, sugar and salt\nRub butter in until the mixture resembles coarse meal\nPour in milk\nTurn out onto flat surface and knead a few times\nShape and cut into 12 pieces\nBake for 15 min',
                10, 1, '2018-12-20', 'recipe_4.jpg'),
        (5, 'Frozen grapes', 'A healthy alternative to candy', 1, 3, 'Grapes',
                'Freeze grapes in a sealed bowl for at least 3 hours', 3, 5,
                '2019-10-24', 'recipe_5.jpg'),
        (6, 'PB&J sandwich', 'The best recipe for a classic lunchbox item', 1, 5, '2 slices bread\n1 tsp peanut butter\n1 tsp jam',
                'Spread peanut butter on one slice\nSpread jam on the other slice\nPlace together and cut diagonally', 6, 2,
                '2020-03-06', 'recipe_6.jpg'),
        (7, 'Instant noodles', 'In case you forgot', 1, 3, '1 pack instant noodles\nWater',
                'Boil water in a kettle\nPlace noodles and seasoning in a bowl\nPour hot water over noodles and let sit for 2 minutes', 3, 2,
                '2019-07-20', 'recipe_7.jpg'),
        (8, 'Carrot cake', 'I believe in carrot cake supremacy', 12, 120, '2 cups flour\n1 cup sugar\n1 cup walnuts\n1/2 cup milk\n1 cup olive oil\n2 eggs\n1 tsp baking powder\n1 tsp baking soda\n5 cups grated carrot\n1 tsp nutmeg\n1 tsp cinnamon\n1/2 tsp salt\n80g cream cheese\n1 1/2 cups icing sugar\n1 tsp lemon juice',
                'Preheat oven\nSet cream cheese, icing sugar and lemon juice aside for the icing\nCombine dry ingredients and walnuts\nCombine wet ingredients, including carrots\nMix all together\nPour in tin\nBake for 1 hour\nCombine icing ingredients and spread on top of cake',
                8, 4, '2020-04-15', 'recipe_8.jpg'),
        (9, 'Plain pasta', 'The classic struggle meal', 2, 10, '2 cups pasta\nWater',
                'Boil water in a kettle\nPlace pasta in a pot\nPour hot water over pasta with a pinch of salt and boil for 8 minutes', 5, 3,
                '2019-05-30', 'recipe_9.jpg'),
        (10, 'The perfect cup of tea', 'Enjoy alone or with a friend', 1, 3, '1 teabag\nWater\nDash of milk',
                'Boil water in a kettle\nPlace teabag in a cup\nPour hot water in the cup\nLet brew for 2 minutes\nAdd a dash of milk', 4, 6,
                '2019-12-29', 'recipe_10.jpg'),
        (11, 'Avocado toast', 'A delicious millennial midday meal', 1, 6, '1 slice bread\n1/2 avocado\nDash of hot sauce\n1 tbsp hummus',
                'Toast bread till thoroughly brown\nAdd a dash of hot sauce of your choice on the toast\nSpread hummus on the toast\nSlice avocado and place on top of hummus',
                10, 2, '2020-01-27', 'recipe_11.png'),
        (12, 'Toasties', 'Fast and tasty', 4, 20, '4 slices bread\n1 can baked beans\n60g cheese',
                'Preheat oven\nPlace bread on an oven tray\nSpread baked beans on each slice\nGrate cheese evenly on top\nBake until bread is golden',
                 9, 2, '2019-08-05', 'recipe_12.jpg');

INSERT INTO Comment (comment_id, text, photo_filename, parent_comment_id, recipe_id, author_id, posted_date)
VALUES
    (1, 'Tried making this and it was great!', 'recipe_1.jpg', null, 12, 4, '2020-01-23'),
    (2, 'Omitted the hot sauce, still 10/10', 'recipe_5.jpg', null, 11, 6, '2019-05-12'),
    (3, 'The pasta was overcooked', null, null, 9, 3, '2020-01-19'),
    (4, 'So good!!!', null, null, 5, 10, '2019-10-30'),
    (5, 'Disagree, it was so messy', 'recipe_11.png', 1, 12, 7, '2020-01-24'),
    (6, 'That\'s your fault', null, 5, 12, 4, '2020-02-04'),
    (7, 'The best recipe I have ever used', null, null, 7, 1, '2019-01-11'),
    (8, 'Dumb', null, 7, 7, 2, '2019-02-04'),
    (9, 'My go to recipe', 'recipe_9.jpg', null, 12, 8, '2020-02-01'),
    (10, 'It\'s better with sugar', null, null, 10, 5, '2019-06-01'),
    (11, 'Amazing, I follow this recipe every time I want to make a cup of tea', 'recipe_9.jpg', null, 10, 8, '2020-01-19'),
    (12, 'Took way longer than two hours!!!', null, null, 8, 3, '2020-01-13'),
    (13, 'What temperature did you use?', null, 12, 8, 1, '2020-01-24'),
    (14, 'Exactly what I wanted!', null, null, 1, 9, '2020-02-01'),
    (15, 'I don\'t think it is', null, 6, 12, 7, '2020-02-06');

INSERT INTO Rating (user_id, recipe_id, value)
VALUES
    (4, 1, 5.0), # Everyone rates their recipe 5.0
    (6, 2, 5.0),
    (1, 3, 5.0),
    (10, 4, 5.0),
    (3, 5, 5.0),
    (6, 6, 5.0),
    (3, 7, 5.0),
    (9, 12, 5.0),
    (8, 8, 5.0),
    (5, 9, 5.0),
    (4, 10, 5.0),
    (10, 11, 5.0),
    (1, 5, 3.0),
    (2, 12, 5.0),
    (3, 1, 1.0),
    (4, 4, 2.0),
    (1, 11, 3.0),
    (3, 6, 2.0),
    (9, 10, 5.0),
    (8, 10, 4.0),
    (6, 3, 4.0),
    (1, 6, 5.0),
    (5, 5, 1.0),
    (9, 6, 2.0),
    (10, 7, 1.0),
    (10, 2, 5.0),
    (1, 4, 3.0),
    (2, 9, 3.0),
    (6, 11, 4.0),
    (7, 7, 2.0);




