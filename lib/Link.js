var history = require('history-events');
var React = require('react');
var Url = require('url');
var assing = require('object-assign');

var Link = React.createClass({
  propTypes: {
    href: React.PropTypes.string.isRequired
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  onClick: function(e) {
    if (!history.isHistorySupported()) return;

    e.preventDefault();

    var path = e.target.href.substr(location.origin.length);
    window.history.pushState(null, null, path);
  },

  render: function() {
    var props = assing({}, this.props, {onClick: this.onClick});
    return React.DOM.a(props);
  }
});

module.exports = Link;
