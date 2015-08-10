var React = require('react');
var assing = require('object-assign');
var Navigator = require('./Navigator');

var Link = React.createClass({
  propTypes: {
    href: React.PropTypes.string.isRequired
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  onClick: function(e) {
    e.preventDefault();

    var path = '/'+e.target.href.split('/').slice(3).join('/');
    Navigator.pushState(null, null, path);
  },

  render: function() {
    var props = assing({}, this.props, {onClick: this.onClick});
    return React.DOM.a(props);
  }
});

module.exports = Link;
