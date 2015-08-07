var history = require('history-events');
var React = require('react');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var Url = require('url');
var assing = require('object-assign');
var RouteParser = require('./RouteParser');

var Router = React.createClass({
  propTypes: {
    url: React.PropTypes.string,
    transitionName: React.PropTypes.string,
    component: React.PropTypes.string,
    className: React.PropTypes.string
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
    var routes = this.props.routes;

    var i, route, match, params, props, data;
    for (i in routes) {
      route = routes[i];
      match = parse(route.path);
      params = match(url.pathname);

      if (params) {
        props = assing({key: url.pathname}, route.props);
        data = {url: url, params: params, handler: route.handler, route: {path: route.path}};
        delete props.handler;
        delete props.path;
        data.props = props;
        return data;
      }
    }
    return null;
  },

  render: function() {
    var Component = React.createElement(this.state.handler, {key: this.state.url.pathname});

    if (!this.props.transitionName) {
      return Component;
    } else {
      return React.createElement(CSSTransitionGroup, {
        transitionName: this.props.transitionName,
        transitionAppear: this.props.transitionAppear,
        component: this.props.component || 'div',
        className: this.props.className,
        children: [Component]
      });
    }
  }
});

module.exports = Router;
