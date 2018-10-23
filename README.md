
<h1 align="center"><strong>hodl.watch</strong></h1>

<p align="center">
  <strong>Simple, yet powerful web app for automatic crypto portfolio tracking</strong>
</p>
<p align="center">
  <strong>With fancy chart!</strong>
</p>

<p align="center">
  <img src='https://user-images.githubusercontent.com/15712581/36936505-585dc762-1efe-11e8-8b04-b3cbe0ea4542.png' />
</p>

[![Build Status](https://travis-ci.org/belaczek/hodlwatch.svg?branch=master)](https://travis-ci.org/belaczek/hodlwatch)

The main idea behind this project is to create portfolio tracking web application which is easy to use, easy to modify or extend and where user is an owner of his own data. That means everyone can make a fork of this project and run it in his own environment. Or they can just use the hosted app at [hodl.watch](https://hodl.watch)

All user data are stored in browser local storage.

### __Under heavy development__


## Features

### Advanced charting
Track your portfolio value in an intuitive chart containing all your assets, stacked together.

### Automatic exchange data import
Thanks to awesome [ccxt](https://github.com/ccxt/ccxt) library it has become fair simple to support many exchanges through unified API.

### Private data storage
The app stores all its data in browser localstorage, only using stored api keys to communicate with exchanges. 

One of the planned future features is optional dropbox/onedrive sync so that user can work with the same data on multiple devices.

### Easy to modify
hodl.watch being powered by React and Redux which is one of the most popular stacks
in recent web development. That reduces the difficulty of having to learn a new technology for many developers.
The code is written using well known best practises to stay readable and not difficult to modify or extend. 

A developer wiki is planned to provide some instructions about how to work with the project.

## Powered by

 - [react](https://github.com/facebook/react)
 - [next.js](https://github.com/zeit/next.js)
 - [recompose](https://github.com/acdlite/recompose)
 - [redux](https://github.com/reactjs/redux)
 - [ccxt](https://github.com/ccxt/ccxt)
 - [recharts](https://github.com/recharts/recharts)
 - [lodash](https://github.com/lodash/lodash)
 - [cryptocompare api](https://min-api.cryptocompare.com/)
 
    and others

 [![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)



### Hosted by GitHub pages

#### Keep calm and hodl!
