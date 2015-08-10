function patchStateAttributes(attrs) {
  if (!attrs[0]) attrs[0] = {};
  if (!attrs[0].timestamp) attrs[0].timestamp = Date.now();
  return attrs;
}

function pushState() {
  var args = patchStateAttributes(arguments);
  setImmediate(function() {
    window.history.pushState.apply(window.history, args);
  });
}

function replaceState() {
  var args = patchStateAttributes(arguments);
  setImmediate(function() {
    window.history.replaceState.apply(window.history, args);
  });
}

function back() {
  var args = arguments;
  setImmediate(function() {
    window.history.back.apply(window.history, args);
  });
}

function forward() {
  var args = arguments;
  setImmediate(function() {
    window.history.forward.apply(window.history, args);
  });
}

function go() {
  var args = arguments;
  setImmediate(function() {
    window.history.go.apply(window.history, args);
  });
}

module.exports = {pushState: pushState, replaceState: replaceState, back: back, forward: forward, go: go};
