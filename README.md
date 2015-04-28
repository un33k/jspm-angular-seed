#jspm-angular-seed

Example app demonstrating use of jspm package manager, ES6 and Angular.

##Getting Started

This project requires node, npm, jspm, and gulp along with additional dependencies that will
automatically be installed upon installing the application in the final step.

###Install Node & Npm

If you already have Node & Npm installed you can skip this step and go to "Install jspm".

You can download Node which typically has npm bundled with it from <a href="https://nodejs.org/download/">
NodeJS Downloads</a> page.

Alternatively for Mac users you can install using Homebrew.

```sh
$ brew install node
```

For additional installation methods and examples see 
[Installing and Building Node](https://github.com/joyent/node/wiki/Installation).

###Install jspm

In order to use jspm from our command line terminal/console we need to first install it using the global flag (-g).

```sh
$ npm install jspm -g
`

###Install jspm-angular-seed

If you have cloned the repository skip this step and and go to **Install the Project**

```sh
$ npm install jspm-angular-seed
`

###Install Project

Now that you have your seed project installed or cloned change directories
then run install to install the project's remaining dependencies.

```sh
$ cd jspm-angular-seed
$ npm install
```

###Chrome Extension (optional)

In order to see changes reflected in your browser you may wish to use [Google Chrome](http://www.google.com/chrome)
and the livereload extension. You can install the extension from the Chrome Web Store.

[Livereload Chrome Extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en-US)

###Running the Server

```sh
$ gulp serve
```

###Package Management

Please see the [jspm documentation](https://github.com/jspm/jspm-cli/wiki/Getting-Started) 
for instruction, examples and command line flags.

You may also wish to checkout this [video](https://youtu.be/iukBMY4apvI). It's only about 10 minutes
but makes it clear what your work flow should be as to development and production respectively.

That said the basic syntax is:

```sh
$ jspm install package
```

or (github)

```sh
$ jspm install github:username/repo
```

or (npm)

```sh
$ jspm install npm:package
```