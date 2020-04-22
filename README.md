# Installation 

`npm i`
`cordova prepare`

if getting warning `Unable to load PlatformApi from platform...`, run `rm -rf platforms/ plugins/` before `cordova prepare` 

`cordova plugin add cordova-plugin-buildinfo --save`
`cordova plugin add cordova-universal-links-plugin-fix --save`
`cordova plugin add cordova-plugin-browsertab --save`
`cordova plugin add cordova-plugin-inappbrowser --save`
^^^ Use these commands to properly setup Firebase

# Develop 

`npm start` 


it will start webpack dev server with hot reload using [cordova-plugin-webpack](https://github.com/kotarella1110/cordova-plugin-webpack#readme)

## Run on Android 

`npm run android`

## Code 

`npm run prettier` to "prettify" source files with [Prettier.js](https://prettier.io/)
or `option+shift+f` to format opened file