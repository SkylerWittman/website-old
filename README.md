# Personal website for Skyler Wittman

## To develop locally

Pre-requisites:

- [nvm](https://github.com/nvm-sh/nvm) - optional but very helpful to keep track of node versions
- node 18.13.x or above required: `nvm install 18.13`
- yarn globally: `npm install --global yarn`
- node dependencies: `yarn install`

### To use hot-reload

```console
yarn run dev
```

If you want the files you modify to be updated during hot-reload then add your changes to input.css, and and .ejs file and run

```console
yarn start
```

To modify parameters for browser-sync, update [bs-config.js](bs-config.js)
