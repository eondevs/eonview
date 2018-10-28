# Eonbot Desktop

This is an unfinished v2.0.0 EonBot

EonView was an app that was used to manage EonBot and create configuration files for it. The development started in late 2017 and was terminated on 2018-10-26.

EonView was written in HTML/TypeScript/Sass using Electron and Angular4 frameworks and it's a Node.js application.

## Running application in developer mode
    Make sure that you have node.js and npm installed.
    Install projects modules:
        npm install
    Via CMD enter the eonview directory and transpile JavaScript and CSS files by typing following command:
        gulp build  
    Then just start the application:
        gulp start
        
## Building the application
    Follow this guide:
    https://github.com/electron-userland/electron-packager    
    Before building the application make sure that you have transpiled SaSS and TypeScript files into CSS and JavaScript.


## As of 2018-10-27 these are the things that are left undone

### Main online screen
    Remote Control status connection to the WebSockets.
### Currencies Information tab
    Websocket integration;
    Reset data on currency change;
### Strategies Editor tab
    When importing the strategy outcomes and sequence needs to be checked;
    When exporting the strategy names, outcomes and sequence needs to be checked;
### Notifications service
    Improvement on timings;
