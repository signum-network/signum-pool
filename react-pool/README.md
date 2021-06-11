# Welcome to Signum's Pool website

_Maybe you fill find helpfull tips_

## How to use test-net or main-net enviroments 📋

_If you are going to test the website in test-net or main-net (mode), you just need to take the following steps:_

-   Go to the folder src/utils/
-   You will find the file "globalParameter.js"
-   Find the variable "useTestNet"
    -If that variable is equal to true, the website will fetching data from a demo pool node you can customize!
    -If that variable is equal to false, the website will fetching data from your pool node!

## Commands for deployment 🛠️

_Use this commands if you are going to deploy changes or start the deployment_

-   If you have not install the dependencies, run "npm install", if there is already a folder called "node_modules", forget this step
-   npm run build - Build project's production site
-   After the build command is done, you will only need the folder "Build"
-   Only use the folder "Build", you can deploy the production app in your pool node
-   Always serve the file index.html
