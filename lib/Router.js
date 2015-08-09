var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var history = require('history-events');
var assign = require('object-assign');
var Url = require('url');
var RouteParser = require('./RouteParser');

var urlRouteCache = {}; // route data per url
var historyCountCache = 0; // number of window.history.length before transition

var Router = React.createClass({
  propTypes: {
    url: React.PropTypes.string,
    transitionName: React.PropTypes.string,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool,
    transitionDirection: React.PropTypes.bool,
    component: React.PropTypes.string
  },

  childContextTypes: {
    router: React.PropTypes.object
  },

  getInitialState: function() {
    return {route: this.getCurrentRoute(), transition: {direction: this.getTransitionDirection()}};
  },

  componentDidMount: function() {
    window.addEventListener('changestate', this.windowStateDidChange);
  },

  componentWillUnmount: function() {
    window.removeEventListener('changestate', this.windowStateDidChange);
  },

  windowStateDidChange: function(e) {
    this.setState({route: this.getCurrentRoute(), transition: {direction: this.getTransitionDirection()}});
    this.cacheHistoryCount();
  },

  getChildContext: function() {
    return {router: this};
  },

  getCurrentRoute: function() {
    var href = this.props.url || location.href;
    if (urlRouteCache[href]) return urlRouteCache[href];

    var url = Url.parse(href);
    var parse = RouteParser.create({sensitive: false, strict: false, end: false});
    var routes = this.props.routes;

    var i, route, match, params, props;
    for (i in routes) {
      route = routes[i];
      match = parse(route.match);
      params = match(url.pathname);

      if (params) { // route found
        props = props = assign({key: url.pathname}, route.props);
        delete props.handler;
        delete props.path;

        return urlRouteCache[href] = {match: route.match, handler: route.handler, params: params, url: url, props: props};
      }
    }
    return urlRouteCache[href] = null; // no route found
  },

  getTransitionDirection: function() {
    if (history.isHistorySupported()) {
      if (historyCountCache < window.history.length) return 'forward';
      if (historyCountCache > window.history.length) return 'back';
    }
    return 'forward';
  },

  getTransitionName: function() {
    if (this.props.transitionName) {
      if (!this.props.transitionDirection) return this.props.transitionName;
      return this.props.transitionName+'-'+this.getTransitionDirection();
    }
    return null;
  },

  cacheHistoryCount: function() {
    if (history.isHistorySupported()) {
      historyCountCache = window.history.length;
    }
  },

  renderHandler: function() {
    return React.createElement(this.state.route.handler, this.state.route.props);
  },

  renderTransitionGroup: function() {
    var Handler = this.renderHandler();
    var props = assign({}, this.props, {children: Handler, transitionName: this.getTransitionName()});
    delete props.url;

    return React.createElement(ReactCSSTransitionGroup, props);
  },

  render: function() {
    return this.props.transitionName ? this.renderTransitionGroup() : this.renderHandler();
  }
});

module.exports = Router;
