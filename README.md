# Click-It Right!

![logo](./src/assets/img/logo_title_small.png)

`Click-it Right!` is a free, open-source, collaborative app to easily **create** and **share** Windows **contextual menu shortcuts**. With a straight-forward interface, it allows you to simply open your favourite application or script by right-clicking it without having to deal directly with the Registry.

![preview](https://repository-images.githubusercontent.com/264091076/766e3300-9c7d-11ea-984a-f175b6975a1c)

## Install
Simply use the installer hosted on GitHub last release.

[Click-It Right Setup.exe](https://github.com/kevincastejon/click-it-right/releases/latest/download/Click-It.Right.Setup.1.0.0.exe)

## Usage

Use the top left menu to navigate between your own shortcuts and the ones of the community.

## Share
This app offers an simple interface to submit your shortcuts to the community using GitHub, so you need to have an GitHub account and to sign in to share with others. Installing community's shortcuts does not require to be logged in though.

## Open source
This project is open to PR!

Consult the [todo list](./todo.md) or propose your own feature

## Development
**Strongly recommended to use Yarn instead of NPM for this project !**

Development:
```
yarn dev
```

Build and package:
```
yarn dist
```

## About the GitHub API
This app is using the same method that GitHub Desktop to authenticate users on the GitHub API, so the client_secret and client_id of this app are public, since it's open source you can use them to build your own version of the app but users won't be notified of the difference, they would still have to accept 'Click-it-right' app for signing in. Instead of that you should get your own client_id and client_secret from GitHub developers page and name your app as you wish.

## Structure

The `build` folder contains the build resources such as the app icon, etc...

The `dist` folder contains the packaged app
