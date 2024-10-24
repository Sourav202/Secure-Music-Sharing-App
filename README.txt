THIS WAS DONE AS A PROJECT IN COMP2406
NAME: Sourav Minhas

Note: Run these commands in the folder containing all files: Secure Streaming App

INSTALL INSTRUCTIONS:
npm install

LAUNCH INSTRUCTIONS:
npm start

TESTING INSTRUCTIONS:
http://localhost:3000/userSignUp

You will be prompted to log in at: localhost:3000/userSignUp
1a. You may sign up by entering a Username and Password and pressing the Sign Up button.
1b. You may log in using an existing user (provided you know the Username and Password):
    Username: Louis, Password: secret, Authorization: Admin
    Username: Frank, Password: secret, Authorization: Guest
    Username: Sourav, Password: secret3, Authorization: Guest
    Different permissions and accessibility are assigned based on who signs in.
    A new user signing up will always be a Guest.

Enter a song title or artist to search the catalog for your desired song.
2a. Add the song to the public playlist using the "➕" button.
2b. Modify the order of songs in the playlist using "🔼" or "🔽".
2c. Remove songs from the playlist using the "➖" button.
2d. All songs in the playlist are saved across sessions and users via local storage.

The Admin page is only accessible to Admins.
3a. A Guest trying to access this page will see the following error:
"Sorry, you are not an admin!"
3b. An Admin will be greeted with a list of all users in the database upon entering the page.