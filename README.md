# Insallation 

`npm i`
`cordova prepare`

# Develop 

`npm start` 

## cordova-plugin-webpack issue

At the moment `cordova-plugin-webpack` plugin has issue, it does not work on different computer with different path to the project

Here is a workaround until it's fixed.

```
cordova plugin rm cordova-plugin-webpack
cordova plugin add cordova-plugin-webpack
```

it will start webpack dev server with hot reload using [cordova-plugin-webpack](https://github.com/kotarella1110/cordova-plugin-webpack#readme)

## Code 

`npm run prettier` to "prettify" source files with [Prettier.js](https://prettier.io/)
or `option+shift+f` to format opened file