# CANDOR

### The user will open the chrome browser on the PC. 

### He will download the candor extension from the chrome store (currently load unpacked extension from local folder).

### User clicks on the extension icon, a popup window will appear.

### Initially the popup window will contain login/signup options, with “hello guest” message on top.

### The user can login after giving the username and password directly from the extension.

### Or else just clicking on the login button will redirect to candor’s website login page.

### If the credentials didn’t match then the user will be redirected to the login page.

### If the username matches and password didn’t match then it will give an error message of “unauthorized access”.

### In case of successful login, a message confirming successful login will be displayed along with the logout option.

### If the user is new to our extension and wants to sign up, he will click the signup button and will be redirected to the signup page.

## User Sign up:

### The sign up page contains the following fields, username, email, otp, phone no., profile pic and password. All the fields are required except the profile photo, which is set to a default pic.

### To get the otp the user will be first filling the email field and then clicking on the get otp button. Once the otp is sent from the server to the email ID, an OTP sent message will  be shown. Then the user will check the otp from the email and fill in the OTP field, then he will click on the verify OTP button and if the OTP matches then it will show an 	OTP verified  message else it will show the “wrong otp” message. 

### All the fields are required and backend validated for not being empty and unique email &username. 

### If a user gives a wrong OTP on purpose and clicks on signUP button, an error message of wrong OTP will be shown before validating the rest of the fields.

## After user is logged in
### Clicking on the extension will show the user’s profile pic and username, together with the context URL, which is grabbed by the extension along with the number of posts present in each category.

### Now on his discretion, the user can click on any category he wants to visit.

### Once the category is selected the user will be shown a web page which contains all the posts in context of the particular url the extension was triggered for.

### The user now can add a post, comment on other posts, like or unlike posts, search posts by username, sort posts by time or  likes. The page will also contain the user’s profile information like name, phone no., email etc. By default only three posts are shown per page, with all their comments. The user can choose to see older or newer posts according to his wish.

### Time for posts and comments are being shown on the basis of how recently they were posted, also for simplicity, they are rounded off to minutes, hours and days.

### Front-end validation is done for post and comment which disables the submit button of the corresponding input field if it is empty.

### There is  also a section for trending tags, that automatically extracts all the tags from posts and comments and shows the top ten.

### On top of the page, the context URL, category, and username is shown.

### The user can also sort the search results by time and likes.

### Similarly users can go visit other categories of the same webpage or can go to another website and click on our extension to see the posts related to that website.

### Finally users can logout by clicking on the logout button on the extension or on the webpage.

