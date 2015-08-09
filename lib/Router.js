var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var history = require('history-events');
var assign = require('object-assign');
var Url = require('url');
var RouteParser = require('./RouteParser');

var urlCache = {};

var Router = React.createClass({
  propTypes: {
    url: React.PropTypes.string,
    transitionName: React.PropTypes.string,
    transitionAppear: React.PropTypes.bool,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool,
    component: React.PropTypes.string
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
    if (urlCache[href]) return urlCache[href];

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

        return urlCache[href] = {match: route.match, handler: route.handler, params: params, url: url, props: props};
      }
    }
    return urlCache[href] = null; // no route found
  },

  renderHandler: function() {
    return React.createElement(this.state.handler, this.state.props);
  },

  renderTransitionGroup: function() {
    var Handler = this.renderHandler();
    var props = assign({}, this.props, {children: Handler});
    delete props.url;

    return React.createElement(ReactCSSTransitionGroup, props);
  },

  render: function() {
    return this.props.transitionName ? this.renderTransitionGroup() : this.renderHandler();
  }
});

module.exports = Router;
