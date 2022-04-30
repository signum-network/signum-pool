# Welcome to Signum's Pool website

_Maybe you will find helpful tips_

## How to use testing or production mode 📋

-   **Testing mode refers to the "development enviroment"**

    > Testing mode will fetch data from a remote pool server

    > **Example: you can fetch data from different pools by just changing the variable TEST_NODE in globalParameters.js**

-   **Production mode refers to the "production enviroment"**

    > Production mode will fetch data from the local pool server which you will host the web app

Per default the testing mode is activated automatically when running `npm start`, but `npm run build` activates production mode

> _If you need - for whatever reasons - to develop on production mode you need to override the "useTestNet" variable_

> The variable useTestnet also refers to the "development enviroment"

-   Go to the folder src/utils/
-   You will find the file "globalParameter.js"
-   Find the variable "useTestNet"

    -   If that variable is equal to true, the website will fetch data from a remote pool node **you can change the url**
    -   If that variable is equal to false, the website will fetch data from your local pool node!

> The variable "useTestNet" is assigned correspondingly, so it's not necessary to override it

## Commands for deployment 🛠️

_Use this commands if you are going to deploy changes or start the deployment_

-   If you have not installed the dependencies, run "npm install", if there is already a folder called "node_modules", forget this step
-   npm run build - Build project's production site
-   After the build command has finished, you will only need the folder "Build"
-   Only use the folder "Build", you can deploy the production app in your pool node
-   Always serve the file index.html

## Available Languages 🌐

Discover the available languages you can set by default or users can freely choose!

-   `en` English
-   `fr` French
-   `es` Spanish
-   `de` Deutsche
-   `it` Italiano
-   `pt` Português
-   `tr` Türk
-   `nl` Nederlands
-   `pl` Polskie
-   `zh` Chinese (Simplified)
-   `ru` Russian

> `code` -> language name

## How to implement extra links on your header 🕹️

If you want extra links to be put in your header, you must go to the file `pool.properties` and find and customize the variable `extraMenuItems`

> The variable is a `String` which is contained as JSON data, look at the next example

> **The variable must be assigned completly in one line, maybe you can use bitly.com, for having shorter links and cleaner source code**

```

# Example (How it should be in your source code)
extraMenuItems=[ {"label":"Signum", "url":"https://www.signum.network", "newTab": true }, {"label":"BTDEX", "url":"https://btdex.trade", "newTab": true } ]

# This example shows, that the website will have 2 websites, : signum.network and btdex.trade

# Example (Just take this example as a reference. This have line breaks, which it won't work)
extraMenuItems=[
  {"label":"Signum", "url":"https://www.signum.network", "newTab": true },
  {"label":"BTDEX", "url":"https://btdex.trade", "newTab": true },
  {"label":"Miners", "url":"/miners", "newTab": false }
  ]

# You can add as many routes you want, you just need to add the object, and keep the variable asignation in just one line
# Look at the examples
# {"label":"My chat", "url":"https://telegram.org", "newTab":true }
# {"label":"My Pool", "url":"http://poolUrlExample.com", "newTab":true }

# Make sure to format correctly the JSON data
# Make sure to keep the variable asigned in just one line, NO LINE BREAKS
```

-   To add another route, you just need to add another object to that variable and then put the respective values in their properties:

    -   **label:** means what is the text of the Link
    -   **URL:** is the link or complete url which the user will be redirected to
    -   **newTab:** It indicates if the url will be an external or local one
        -   You must assign this property to **false** when you are making your own custom page in the pool
        -   You must assign this property to **true** if you are going to use an external link

> **Tip:** If the external url is going to be large, i do recommend using an url shortener bitly.com

## How to put your pool website in iframes

If you want your pool website to be shown on iframes, you can just add the following get parameter in the URL

> **embedMode=true**

> Example #1: **http://poolUrlExample.com/?embedMode=true**

> Example #2: **http://poolUrlExample.com/randomRoute/?random=true&embedMode=true**

## How to use Google Analytics (Optional)

-   Go to Google Analytics website and if you’re first time user, you’ll asked to set up an account including your data sharing settings.
-   Create a new property — remember to select the Universal Analytics property option. You have the options to create UA, or GA4 or both properties.
-   Fill up the remaining information for setting up your account and properties; and then you’ll get the tracking ID (e.g. UA-123456789–1)
-   Once you get the Tracking ID, you just need to assign that value in the variable "GOOGLETRACKINGID"
-   If you do not want google analytics, just leave the variable empty

> Example of a tracking ID: **UA-200778790-1**

## URL used for embed in trading viewer page

_I used bitly.com for shortening these links, the first link is the mini widget, and the second one is the large widget_

-   https://s.tradingview.com/embed-widget/tickers/?locale=en#%7B%22symbols%22%3A%5B%7B%22description%22%3A%22BTC%2FSIGNA%22%2C%22proName%22%3A%22BITTREX%3ASIGNABTC%22%7D%2C%7B%22description%22%3A%22SIGNA%2FUSD%22%2C%22proName%22%3A%22BITTREX%3ASIGNAUSD%22%7D%5D%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22showSymbolLogo%22%3Atrue%2C%22width%22%3A%22100%25%22%2C%22height%22%3A104%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22tickers%22%7D

-   https://www.tradingview.com/widgetembed/?frameElementId=tradingview_846da&symbol=BITTREX%3ASIGNAUSD&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&showpopupbutton=1&locale=en&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=chart&utm_term=BITTREX%3ASIGNAUSD
