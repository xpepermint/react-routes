var pathToRegexp = require('path-to-regexp');

function create(options) {
  options = options || {};

  return function(path) {
    var keys = [];
    var re = pathToRegexp(path, keys, options);

    return function(pathname, params) {
      var m = re.exec(pathname);
      if (!m) return false;

      params = params || {};

      var i, key, param;
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        param = m[i + 1];
        if (!param) continue;
        params[key.name] = decodeURIComponent(param);
        if (key.repeat) params[key.name] = params[key.name].split(key.delimiter);
      }

      return params;
    }
  }
};

module.exports = {create: create};
