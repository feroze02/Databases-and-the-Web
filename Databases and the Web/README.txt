Mini Project
Recipe Buddy Dynamic Web Application

Requirement:

...........................................................................................
R1: Home page
Created get route for home page in main.js file
main.js line no: 14 to 20

R1A: Name of the web application.
Add shopData and shopName variable to main.js, index.js, and index.ejs file to display 
the name of the web application on the home page and other pages. 
main.js line no: 19
index.js line no: 63
index.ejs line no: 10

R1B: Display links to other pages or a navigation bar that contains links to other pages.
Add links of other pages to the home page.
index.ejs line on: 12 to 23


...........................................................................................
R2: About page 
Created get route for about page in main.js file
main.js line no: 24 to 28

R2A: Information about the web application including developer's name.
Display a link to the home page.
about.ejs line no: 9 to 13


...........................................................................................
R3: Register page
Created get and post route for register page in main.js file
main.js line no: 32 to 36 and 38 to 82

R3A: Form to users to add a new user to the database,
Display a link to the home page.
register.ejs line no: 8 to 19

R3B: Collect form data to be passed to the back-end (database) and store user data in the database.
main.js line no: 38 to 82

R3C: Display a message indicating that add operation has been done.
main.js line no: 78


...........................................................................................
R4: Login page
Created get and post route for login page in main.js file
main.js line no: 86 to 90 and 92 to 146

R4A: Form to users to log in to the dynamic web application
Display a link to the home page.
login.ejs line no: 8 to 16

R4B: Collect form data to be checked against data stored for each registered user in the database.
main.js line no: 92 to 146

R4C: Display a message indicating whether login is successful or not and why not successful.
main.js line no: 119, 135, and 140


...........................................................................................
R5: Logout
There is a way to logout, a message is displayed upon successful logout.
main.js line no: 150 to 159


...........................................................................................
R6: Add food page (only available to logged-in users)
Created get and post route for add food page in main.js file
main.js line no: 163 to 168 and 170 to 219

R6A: Form to users to add a new food item to the database.
Display a link to the home page
addfood.ejs line no: 8 to 22

R6B: Collect form data to be passed to the back-end (database) and store food items in the database. 
main.js line no: 170 to 219

R6C: Display a message indicating that add operation has been done.
main.js line no: 209 to 216


...........................................................................................
R7: Search food page
Created get route for search food page in main.js file
main.js line no: 223 to 227 and 229 to 259

R7A: Form to users to search for a food item in the database.
Display a link to the home page.
searchfood.ejs line no: 8 to 16

R7B:  Collect form data to be passed to the back-end (database) and search the database based on 
the food name collected from the form. 
main.js line no: 229 to 259

R7B: Display a message to the user, if not found.
main.js line no: 249 to 250


...........................................................................................
R8: Update food page (only available to logged-in users)
Created get route for update food page in main.js file
main.js line no: 263 to 268 and 270 to 297

R8A: Search food form. 
Display a link to the home page.
updatefood.ejs line no: 8 to 16

R8B: Display all data related to the food found in the database to users in forms so users can 
update each field
updatefoodlist.ejs line no: 10 to 31
main.js line no: 299 to 347

R8C: Delete button to delete the whole record.
updatefoodlist.ejs line no: 10 to 31
main.js line no: 349 to 375


...........................................................................................
R9: List food page (available to all users)
Created get route for list food page in main.js file
main.js line no: 378 to 392

R9A: Display all fields for all foods stored in the database. 
Display a link to the home page
listfood.ejs line no: 32 to 53
main.js line no: 378 to 392

R9B: list page is organised in a tabular format
listfood.ejs line no: 32 to 53


...........................................................................................
R10: API (Food Item API)
Created get route for food item api page in main.js file
main.js line no: 396 to 458

R10: API search using get methhod
apisearch.ejs line no: 8 to 14
main.js line no: 424 to 458

**API Note**
	API could be accessed by clicking the Food Item API link on the home page
	Get method of the API could be accessed by clicking the Food Item API Search link 
	on the home page


...........................................................................................
R11: Form validation
All form data validations. 
i. Register page, ii. Login page, iii. Add food page iv. Search food page, v. Update food page

	i. Register page:
	Validation of registration form
	Sanitisation of registration form
	main.js line no: 42 to 52 and 66 to 71

	ii. Login page:
	Validation of login forms
	Sanitisation of login forms
	main.js line no: 96 to 102 and 130 to 135

	iii. Add food page:
	Validation of add food item forms
	Sanitisation of add food item forms
	main.js line no: 174 to 186 and 194 to 202

	iv. Search food page:
	Validation of search food forms
	main.js line no: 233 to 237

	v. Update food page:
	Validation of Update page form
	Sanitisation of Update page form
	main.js line no: 271 to 275, 301 to 314, 322 to 330, 336 to 344, 351 to 356, and 364 to 372


...........................................................................................
***Database schema (Entity Relationship diagram)***

                      	+-------------------+
				| Tables_in_myapp   |         
				+-------------------+
				| fooditem		  |
				| user		  |	
				+-------------------+
				   |	           |
+------------------------------+    +-----------------------------+  
| fooditem TABLE               |    | user TABLE                  |       
+------------------------------+    +-----------------------------+
| id INT AUTO_INCREMENT        |    | username VARCHAR(250)		|	  
| name VARCHAR(250)		 |    | first_name VARCHAR(250)	|
| value DECIMAL(6, 2) unsigned |	| last_name VARCHAR(250)      |	
| unit VARCHAR(250)		 |    | email VARCHAR(250)		|
| carb VARCHAR(250)		 |	| hashedPassword VARCHAR(250) |	
| fat VARCHAR(250)		 |    +-----------------------------+
| protein VARCHAR(250)		 |
| salt VARCHAR(250)		 |	
| sugar VARCHAR(250)		 |
| PRIMARY KEY(id)			 |	
+------------------------------+
