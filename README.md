# CS35L_GSW
Spring 2025 CS35L Project

## Getting Started (from Github)
1. Request for repo access from Kashyap
2. Clone repo
   - Use GitHub Desktop
3. Download node from the internet
   - Read https://nodejs.org/en/download
5. Installing project dependencies
   - `cd CS35L_GSW`
   - `npm install`
   - `cd client`
   - `npm install`
6. Create two separate .env files: one in root and one in client. Get the contents of the .env files from Andrew
7. Create a google-cloud-key.json in root. Get the contents of the google-cloud-key.json file from Nathan

## Getting Started (from tar file)
1. Extract `CS35L_GSW` directory from tar file 
2. Download node from the internet
   - Read https://nodejs.org/en/download
3. Installing project dependencies
   - `cd CS35L_GSW`
   - `npm install`
   - `cd client`
   - `npm install`
4. .env and google-cloud-key.json files should come pre-installed

## Starting the dev server 
### `npm run dev`

Run the frontend and backend components from two separate terminal windows. The backend server can be run from root, and the frontend client can be run from client.
1. Terminal window 1 (root)
   - `npm run dev`
2. Terminal window 2
   - `cd client`
   - `npm run dev`

## Opening the app
* In a web browser, navigate to `http://localhost:5173/`
* Backend routes are accessible at `http://localhost:3000` (for dev purposes only)

The page will auto-reload when edits are made and saved.

## Development Guide
1. Create a new branch using the follow naming conventions 
   - `git checkout -b <your_name/new_branch_name>` (i.e. `git checkout -b andrew/update-mapview`)
2. Make the neccessary changes
   - Be sure to test your code!
4. Commit changes
   - `git add <files to include in commit>`
   - `git commit -m <message>`
5. Push changes
   - If first time pushing branch, `git push -u origin HEAD`; otherwise, `git push`
6. Create a pull request on the Github UI
   - You should always merge to the `main` branch
   - Write a concise title and detailed description
       - What was changed?
       - Why was it changed?
       - How did you test?
7. Ping other team members and wait for review
