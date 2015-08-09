# [react](https://facebook.github.io/react/)-routes

> Lightweight isomorphic HTML5 router for ReactJS.

## Setup

Client:

```js
//- index.js
import React from 'react';
import ReactDom from 'react-dom';
import {Router} from 'react-routes';
import About from './components/About';
import Root from './components/Root';
import Stats from './components/Stats';

let routes = [
  {path: '/about', handler: About, props: {}},
  {path: '/stats', handler: Stats},
  {path: '/', handler: Root},
];

ReactDom.render(<Router routes={routes} transitionName='router'/>, document.getElementById('app'));
```
```sass
//- index.styl
*
  position: relative

.router-enter
  opacity: 0.01
.router-enter.router-enter-active
  opacity: 1
  transition: opacity 1.5s ease-in

.router-leave
  opacity: 1
.router-leave.router-leave-active
  opacity: 0.01
  transition: opacity 1.5s ease-in
```

Server:

```js
//- index.js
import React from 'react';
import ReactDomServer from 'react-dom/server';
import {Router} from 'react-routes';
import routes from '../../app/routes';

export default {render};

function render(req, res, next) {
  let html = ReactDomServer.renderToString(<Router routes={routes} url={req.url} transitionName='router'/>);
  res.render('index', {html});
}
```
```jade
//- index.jade
doctype html
html(lang="en")
  head
    title React App
    link(href="#{assetPath('bundle.css')}" media="all" rel="stylesheet" type="text/css")
  body
    #app!= html
    script(src="#{assetPath('bundle.js')}" type="text/javascript" async)
```
