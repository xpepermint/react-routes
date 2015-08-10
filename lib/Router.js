var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var history = require('history-events');
var assign = require('object-assign');
var Url = require('url');
var RouteParser = require('./RouteParser');

var urlRouteCache = {}; // route data per url
var urlStateCache = null; // state of the last url

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
    return {route: this.getRoute(), transitionDirection: this.getDirection()};
  },

  componentDidMount: function() {
    window.addEventListener('changestate', this.windowStateDidChange);
  },

  componentWillUnmount: function() {
    window.removeEventListener('changestate', this.windowStateDidChange);
  },

  windowStateDidChange: function(e) {
    this.setState({route: this.getRoute(), transitionDirection: this.getDirection()});
    this.cacheUrlState();
  },

  getChildContext: function() {
    return {router: this};
  },

  getRoute: function() {
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

  getDirection: function() {
    if (!this.props.transitionDirection) return null;
    if (!history.isHistorySupported()) return null;

    var state = window.history.state;
    if (!state || !state.timestamp) return null;
    if (!urlStateCache || !urlStateCache.timestamp) return 'forward';
    if (state.timestamp > urlStateCache.timestamp) return 'forward';
    if (state.timestamp < urlStateCache.timestamp) return 'back';
    return null;
  },

  getTransitionName: function() {
    var name = this.props.transitionName;
    var direction = this.state.transitionDirection;

    return direction ? name+'-'+direction : name;
  },

  cacheUrlState: function() {
    urlStateCache = history.isHistorySupported() ? assign({}, window.history.state) : null;
  },

  renderHandler: function() {
    return React.createElement(this.state.route.handler, this.state.route.props);
  },

  renderTransitionGroup: function() {
    var props = assign({}, this.props, {children: this.renderHandler(), transitionName: this.getTransitionName()});
    delete props.url;

    return React.createElement(ReactCSSTransitionGroup, props);
  },

  render: function() {
    return this.props.transitionName ? this.renderTransitionGroup() : this.renderHandler();
  }
});

module.exports = Router;
