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

## URL used for embed in trading viewer page

_I used bitly.com for shortening these links, the first link is the mini widget, and the second one is the large widget_

-   https://s.tradingview.com/embed-widget/tickers/?locale=en#%7B%22symbols%22%3A%5B%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BITTREX%3ABURSTBTC%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22BITTREX%3ABURSTUSD%22%7D%5D%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22showSymbolLogo%22%3Atrue%2C%22width%22%3A%22100%25%22%2C%22height%22%3A104%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22tickers%22%7D

-   https://s.tradingview.com/widgetembed/?frameElementId=tradingview_7e8b7&symbol=BITTREX%3ABURSTUSD&interval=D&symboledit=0&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_medium=widget&utm_campaign=chart&utm_term=BITTREX%3ABURSTUSD
