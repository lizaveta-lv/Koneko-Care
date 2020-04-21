# Insallation 

`npm i`
`cordova prepare`

if getting warning `Unable to load PlatformApi from platform...`, run `rm -rf platforms/ plugins/` before `cordova prepare` 


# Develop 

`npm start` 


it will start webpack dev server with hot reload using [cordova-plugin-webpack](https://github.com/kotarella1110/cordova-plugin-webpack#readme)

## Code 

`npm run prettier` to "prettify" source files with [Prettier.js](https://prettier.io/)
or `option+shift+f` to format opened file