const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
module.exports = function(app, shopData) {
    
    //access control
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
        res.redirect('./login')
        } else { next (); }
    }
    

    //..........................................................................................................
    //R1: Home page (get route) 
    //R1A: Name of the web application
    //R1B: Links to other pages
    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });


    //..........................................................................................................
    //R2: About page (get route)
    //R2A: Information about the web application including developer's name
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });


    //..........................................................................................................
    //R3: Register page (get route)
    //R3A: Form to users to add a new user to the database
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });     

    //R3: Register page (post route)
    //R3B: Collect form data to be passed to the back-end (database) and store user data in the database
    //R3C: Display a message indicating that add operation has been done

    //R11: Form validation
    //Validation of registration form (Task)
    //Sanitisation of registration form (Task)
    //***validation of register form***
    app.post('/registered', [check('email').isEmail()], 
                            [check('password').not().isEmpty().isLength({min:8, max:50})], 
                            [check('username').not().isEmpty().isLength({min:1, max:30}).trim().escape()], 
                            [check('first').not().isEmpty().isLength({min:1, max:30}).trim().escape()], 
                            [check('last').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./register'); }

        else {
        const saltRounds = 10; 
        //***sanitisation of register form***
        const plainPassword = req.sanitize(req.body.password);
        //Bcrypt to hashed password
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        
        // saving data in database
        let sqlquery = "INSERT INTO user (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
        // execute sql query
        //***sanitisation of register form***
        let newrecord = [req.sanitize(req.body.username), 
            req.sanitize(req.body.first), 
            req.sanitize(req.body.last), 
            req.sanitize(req.body.email), 
            req.sanitize(hashedPassword)];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
            return console.error(err.message);
            }
            else
                //***sanitisation of register form***
                result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered! We will send an email to you at ' + req.sanitize(req.body.email); result += ' Your password is: '+ req.sanitize(req.body.password) +' and your hashed password is: '+ req.sanitize(hashedPassword)+'<p><a href='+'./'+'>Home</a></p>'; res.send(result);
            });  
          })
        }
    }); 


    //..........................................................................................................
    //R4: Login page (get route)
    //R4A: Form to users to log in to the dynamic web application
    app.get('/login', function (req,res) {
	    res.render('login.ejs', shopData);
    });

    //R4: Login page (post route)
    //R4B: Collect form data to be checked against data stored for each registered user in the database
    //R4C: Display a message indicating whether login is successful or not and why not successful

    //R11: Form validation
    //validation of login forms (Task)
    //Sanitisation of login forms (Task)
    //***validation of login form***
    app.post('/loggedin', [check('password').not().isEmpty().isLength({min:1, max:50})], 
                          [check('username').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./login'); }

        else {
        let sqlquery = "select hashedPassword from user WHERE username = '"+req.body.username+"'";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            console.log(result)

        if(err){
        //TODO: Handle error
        console.log("error")
        res.redirect('./');
        }
        else if (result.length == 0){
            console.log("error1")
            res.send('Hi ' + ' Username entered is incorrect.'+'<p><a href='+'./'+'>Home</a></p>')
        }
        else {
            let hashedPassword = result[0].hashedPassword;
            bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                if(err){
                    console.log("not working" + hashedPassword);
                    res.redirect('./');
                }
                else if(result == true){
                    // Save user session here, when login is successful
                    //***sanitisation of login form***
                    req.session.userId = req.sanitize(req.body.username);
                    //TODO: Send message
                    console.log(req.body.username + " is logged in successfully")
                    //***sanitisation of login form***
                    res.send('Hello! ' + req.sanitize(req.body.username) + ' is logged in.'+'<p><a href='+'./'+'>Home</a></p>')
                }
                else{
                    //TODO: Send message
                    console.log("Incorrect password" + hashedPassword)
                    res.send('Password entered incorrect!' + '' + ' Please try again.'+'<p><a href='+'./'+'>Home</a></p>')
                    }
                })
            }
        });
      }
    });


    //..........................................................................................................
    //R5: Logout (get route)
    //R5: Way to logout, a message is displayed upon successful logout
    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
        return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })


    //..........................................................................................................
    //R6: Add food page (only available to logged-in users) (get route)
    //R6A: Form to users to add a new food item to the database
    //Add Food Item page access control (Task)
    app.get('/addfood', redirectLogin, function (req, res) {
        res.render('addfood.ejs', shopData);
    });
    
    //R6: Add food page (post route)
    //R6B: Collect form data to be passed to the back-end (database) and store food items in the database
    //R6C: Display a message indicating that add operation has been done

    //R11: Form validation
    //validation of add food item forms (Task)
    //Sanitisation of add food item forms (Task)
    //***validation of addfood form***
    app.post('/foodadded', [check('name').not().isEmpty().isLength({min:1, max:30}).trim().escape()], 
                        [check('value').not().isEmpty().isNumeric().isLength({min:1, max:30}).trim().escape()], 
                        [check('unit').not().isEmpty().isLength({min:1, max:30}).trim().escape()], 
                        [check('carb').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('fat').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('protein').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('salt').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('sugar').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.redirect('./addfood'); }

        else {
        // saving data in database
            let sqlquery = "INSERT INTO fooditem (name, value, unit, carb, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?)";
            // execute sql query
            //***sanitisation of addfood form***
            let newrecord = [req.sanitize(req.body.name), 
            req.sanitize(req.body.value), 
            req.sanitize(req.body.unit), 
            req.sanitize(req.body.carb), 
            req.sanitize(req.body.fat), 
            req.sanitize(req.body.protein), 
            req.sanitize(req.body.salt), 
            req.sanitize(req.body.sugar)];
            db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
            return console.error(err.message);
            }
            else
            //***sanitisation of addfood form***
            res.send(' These food item are added to database. name: '+ req.sanitize(req.body.name) + 
            ', value: '+ req.sanitize(req.body.value) +
            ', unit: '+ req.sanitize(req.body.unit) +
            ', carb: '+ req.sanitize(req.body.carb) +
            ', fat: '+ req.sanitize(req.body.fat) +
            ', protein: '+ req.sanitize(req.body.protein) +
            ', salt: '+ req.sanitize(req.body.salt) +
            ', sugar: '+ req.sanitize(req.body.sugar) +'<p><a href='+'./'+'>Home</a></p>');
            });
        }
    }); 


    //..........................................................................................................
    //R7: Search food page (get route)
    //R7A: Form to users to search for a food item in the database
    app.get('/searchfood', function(req,res){
        res.render("searchfood.ejs", shopData);
    });
    
    //R7: Search food result page (get route)
    //R7B: Collect form data to be passed to the back-end (database) and search the database based on the food name collected from the form
    //R7B: Display a message to the user, if not found

    //R11: Form validation
    //validation of search food forms (Task)
    //***validation of search form***
    app.get('/search-result', [check('keyword').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.redirect('./searchfood'); }
        //searching in the database
       
        else {
        let sqlquery = "SELECT * FROM fooditem WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the food item
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            else if (result.length == 0){
            res.send('Food item not found!'+'<p><a href='+'./'+'>Home</a></p>'+'<p><a href='+'./searchfood'+'>Search food</a></p>')
            }
            else {
            let newData = Object.assign({}, shopData, {availableFooditem:result});
            console.log(newData)
            res.render("listfood.ejs", newData)
            }
         });   
       }
    });


    //..........................................................................................................
    //R8: Update food page (only available to logged-in users) (get route)
    //R8A: Display search food form. Display a link to the home page
    //4. Update page access control (Task)
    app.get('/updatefood', redirectLogin, function(req,res){
        res.render("updatefood.ejs", shopData);
    });
    
    //R8: Update food result page (get route)
    //R11: Form validation
    //validation of Update page form (Task)
    //***validation of Update page form***
    app.get('/update-result', [check('keyword').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.redirect('./updatefood'); }
        //searching in the database
        
        else {
        let sqlquery = "SELECT * FROM fooditem WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the food item
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            else if (result.length == 0){
            res.send('Food item not found!'+'<p><a href='+'./'+'>Home</a></p>'+'<p><a href='+'./updatefood'+'>Search food item for update</a></p>')
            }
            else {
            let newData = Object.assign({}, shopData, {availableFooditem:result});
            console.log(newData)
            res.render("updatefoodlist.ejs", newData)
            }
            });   
        }
    });

    //R8B: Display all data related to the food found in the database to users in forms so users can update each field
    //R8: Update food item forms (post route)
    //R11: Form validation
    //validation of update food item forms (Task)
    //Sanitisation of update food item forms (Task)
    //***validation of addfood form***
    app.post('/updatefooditem', [check('id').not().isEmpty().isLength({min:1}).trim().escape()], 
                        [check('name').not().isEmpty().isLength({min:1, max:30}).trim().escape()], 
                        [check('value').not().isEmpty().isNumeric().isLength({min:1, max:30}).trim().escape()], 
                        [check('unit').not().isEmpty().isLength({min:1, max:30}).trim().escape()], 
                        [check('carb').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('fat').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('protein').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('salt').not().isEmpty().isLength({min:1, max:30}).trim().escape()],
                        [check('sugar').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.redirect('./updatefood'); }

        else {
        // saving data in database
            let sqlquery = "UPDATE fooditem SET name = ?, value = ?, unit = ?, carb = ?, fat =?, protein = ?, salt = ?, sugar = ? WHERE id = "+req.body.id+"";
            // execute sql query
            //***sanitisation of update food item form***
            let newrecord = [req.sanitize(req.body.name), 
            req.sanitize(req.body.value), 
            req.sanitize(req.body.unit), 
            req.sanitize(req.body.carb), 
            req.sanitize(req.body.fat), 
            req.sanitize(req.body.protein), 
            req.sanitize(req.body.salt), 
            req.sanitize(req.body.sugar), req.sanitize(req.body.id)];
            db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
            return console.error(err.message);
            }
            else
            //***sanitisation of update food item form***
            res.send(' This food item is updated. name: '+ req.sanitize(req.body.name) + 
            ', value: '+ req.sanitize(req.body.value) +
            ', unit: '+ req.sanitize(req.body.unit) +
            ', carb: '+ req.sanitize(req.body.carb) +
            ', fat: '+ req.sanitize(req.body.fat) +
            ', protein: '+ req.sanitize(req.body.protein) +
            ', salt: '+ req.sanitize(req.body.salt) +
            ', sugar: '+ req.sanitize(req.body.sugar) +'<p><a href='+'./'+'>Home</a></p>');
            });
        }
    });

    //R8C: Delete button to delete the whole record
    //R8: Delete food item forms (post route)
    //R11: Form validation
    //validation of update food item forms (Task)
    //Sanitisation of update food item forms (Task)
    //***validation of addfood form***
    app.post('/fooditemdeleted', [check('name').not().isEmpty().isLength({min:1, max:30}).trim().escape()], function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        res.redirect('./updatefood'); }
        
        else {
        // deleting food item from database
        let sqlquery = "DELETE FROM fooditem WHERE id = '" + req.body.id + "'";
        // execute sql query
        //***sanitisation of delete food item form***
        let newrecord = [req.sanitize(req.body.name), req.sanitize(req.body.id)];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else
          //***sanitisation of delete food item form***
          res.send(' This food item is deleted from the list, name: '+ req.sanitize(req.body.name)+'<p><a href='+'./'+'>Home</a></p>');
          });
       }
    });

    //..........................................................................................................
    //R9: List food page (available to all users) (get route)
    //R9A: Display all fields for all foods stored in the database. Display a link to the home page
    //R9B: list page is organised in a tabular format
    app.get('/listfood', function(req, res) {
        let sqlquery = "SELECT * FROM fooditem"; // query database to get all the food item
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableFooditem:result});
            console.log(newData)
            res.render("listfood.ejs", newData)
         });
    });


    //..........................................................................................................
    //R10: API (Food Item API) (get route) 
    //API could be accessed by clicking the Food Item API link on the home page
    //Get method of the API could be accessed by clicking the Food Item API Search link on the home page
    //Food Item API  
    app.get("/api", function (req, res) {
        // Add keyword query
        let keyword = req.query.keyword

        // Query database to get all the food item
        var sqlquery = "SELECT * FROM fooditem";

        // Query database to search book 
        if(keyword !== undefined) {
        sqlquery = `SELECT * FROM fooditem WHERE name LIKE '%${keyword}%'`
        }
        
        // Execute the sql query
        db.query(sqlquery, (err, result) => {
        if (err) {
            console.log(err)
            res.redirect("./");
        }

        // Return results as a JSON object
        res.json(result);
        });
    });

    //R10: API Search (Food Item API Search) (get route)
    //Get method of the API could be accessed by clicking the Food Item API Search link on the home page
    //API search using get methhod
    //Food Item API search term
    app.get('/apisearch', function (req,res) {
        res.render('apisearch.ejs', shopData);  
    });

    //R10: API Search result (Food Item API Search) (get route)
    //Get method of the API could be accessed by clicking the Food Item API Search link on the home page
    //API search using get methhod
    //Food Item API search term
    app.get("/api", function (req, res) {
        // Add keyword query
        let keyword = req.query.keyword

        // Query database to get all the food item
        var sqlquery = "SELECT * FROM fooditem";

        // Query database to search food item 
        if(keyword !== undefined) {
        sqlquery = `SELECT * FROM fooditem WHERE name LIKE '%${keyword}%'`
        }
        
        // Execute the sql query
        db.query(sqlquery, (err, result) => {
        if (err) {
            console.log(err)
            res.redirect("./");
        }

        // Return results as a JSON object
        res.json(result);
        });
    });

}


