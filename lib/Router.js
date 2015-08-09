var React = require('react');
var history = require('history-events'); // browser patch
var assing = require('object-assign');
var Url = require('url');
var RouteParser = require('./RouteParser');

var routeCache = {};

var Router = React.createClass({
  propTypes: {
    url: React.PropTypes.string
  },

  childContextTypes: {
    router: React.PropTypes.object
  },

  getInitialState: function() {
    return this.getCurrentRoute();
  },

  componentDidMount: function() {
    window.addEventListener('changestate', this.windowStateDidChange);
  },

  componentWillUnmount: function() {
    window.removeEventListener('changestate', this.windowStateDidChange);
  },

  windowStateDidChange: function(e) {
    this.setState(this.getCurrentRoute());
  },

  getChildContext: function() {
    return {router: this};
  },

  getCurrentRoute: function() {
    var href = this.props.url || location.href;
    if (routeCache[href]) return routeCache[href];

    var url = Url.parse(href);
    var parse = RouteParser.create({sensitive: false, strict: false, end: false});
    var routes = this.props.routes;

    var i, route, match, params, props;
    for (i in routes) {
      route = routes[i];
      match = parse(route.match);
      params = match(url.pathname);

      if (params) { // route found
        props = props = assing({key: url.pathname}, route.props);
        delete props.handler;
        delete props.path;

        return routeCache[href] = {url: url, params: params, handler: route.handler, route: route, props: props};
      }
    }
    return routeCache[href] = null; // no route found
  },

  render: function() {
    return React.createElement(this.state.handler, this.state.props);
  }
});

module.exports = Router;
