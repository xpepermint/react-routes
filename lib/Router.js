var history = require('history-events');
var React = require('react');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var Url = require('url');
var assing = require('object-assign');
var RouteParser = require('./RouteParser');

var Router = React.createClass({
  propTypes: {
    url: React.PropTypes.string,
    transitionName: React.PropTypes.string
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
    return {
      router: {route: this.state.route, url: this.state.url, params: this.state.params, props: this.state.props}
    };
  },

  getCurrentRoute: function(url) {
    url = Url.parse(url || this.props.url || location.href);
    var parse = RouteParser.create({sensitive: false, strict: false, end: false});
    var routes = this.props.children;

    var i, props, match, params, data;
    for (i in routes) {
      props = assing({}, routes[i].props);
      match = parse(props.path);
      params = match(url.pathname);

      if (params) {
        data = { url: url, params: params, handler: props.handler, route: {path: props.path}};
        delete props.handler;
        delete props.path;
        data.props = props;
        return data;
      }
    }
    return null;
  },

  render: function() {
    var Component = React.createElement(this.state.handler, this.state.props);
    return React.createElement(CSSTransitionGroup, {transitionName: 'example', children: [Component]});
  }
});

module.exports = Router;


// var invariant = require('react/lib/invariant');
// invariant(
//   current.props.handler !== undefined && current.props.path !== undefined,
//   "Router should contain either Route or NotFound components as routes"
// );
