var history = require('history-events');
var React = require('react');
var Url = require('url');

var Link = React.createClass({
  propTypes: {
    href: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
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
    return React.createElement('a', {href: this.props.href, onClick: this.onClick, children: this.props.children});
  }
});

module.exports = Link;
