Steps-

1. Manifest file load logIn page(popup.js)
2. After successful login user is redirected to "**successful login page**". Now **context.js** comes into picture.
   - **Context.js**(runs for on load of all webpages) is always checking for  "**successful login page **" url match and "**successful logout page**" url match. From successful login page **username is garbed** and stored into chrome.storage.local and **sends message to background.js to replace popup.js(login page) to**  **main_popup.js logged in page**
3. When user clicks on extension-icon next time then Logged in window(main_popup.js) opens.
   - 

https://candor-app.herokuapp.com/