var React = require('react');

var Route = React.createClass({
  propTypes: {
    path: React.PropTypes.string.isRequired,
    handler: React.PropTypes.any.isRequired
  },

  render: function() {
    return null;
  }
});

module.exports = Route;
