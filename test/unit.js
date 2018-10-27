/**
 * This is the unit tests
 */

// Dependencies
var helpers = require('./../lib/helpers');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');

// Holder for the tests
var unit = {};

// Assert that a getANumber is returning a number
unit['helpers.getANumber should a number'] = function (done) {
  var value = helpers.getANumber();
  assert.equal(typeof (value), 'number');
  done();
};

// Assert that a getANumber is returning 1
unit['helpers.getANumber should return 1'] = function (done) {
  var value = helpers.getANumber();
  assert.equal(value, 1);
  done();
};

// Assert that a getANumber is returning 2
unit['helpers.getANumber should return 2'] = function (done) {
  var value = helpers.getANumber();
  assert.equal(value, 2);
  done();
};

// logs.list should callback an array and a false error
unit['logs.list should callback an array and a false error'] = function(done) {
  logs.list(true, function(err, logFileNames) {
     assert.equal(err, false);
     assert.ok(logFileNames instanceof Array);
     assert.ok(logFileNames.length > 1);
     done();
  });
};

// logs.truncate should not throw error if the logId does not exist
unit['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = function(done) {
  assert.doesNotThrow(function() {
    logs.truncate('I do not exist', function(err) {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

// exampleDebuggingProblem.init should not throw but it does
unit['exampleDebuggingProblem.init should not throw when called'] = function (done) {
  assert.doesNotThrow(function () {
    exampleDebuggingProblem.init();
    done();
  }, TypeError);
};

// Export the tests to the runner
module.exports = unit;
