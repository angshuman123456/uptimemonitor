/**
 * Test runner
 */

// Application logic for the test runner
var _app = {};

// Container for the tests
_app.tests = {};

// Add the unit tests
_app.tests.unit = require('./unit');
// Add the api tests
_app.tests.api = require('./api');

// Count all the tests
_app.countTests = function() {
  var counter = 0;
  for (var key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      var subTests = _app.tests[key];
      for (var testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter++;
        }
      }
    }
  }
  return counter;
};

// Run all the tests, collecting the errors and successes
_app.runTests = function() {
  var error = [];
  var successes = 0;
  var limit = _app.countTests();
  var counter = 0;
  for (var key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      var subTests = _app.tests[key];
      for (var testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (function() {
            var tempTestName = testName;
            var testVal = subTests[testName];
            // Call the test
            try {
              testVal(function() {
                // If it calls back without throwing, then test succeded, log it in green
                console.log('\x1b[32m%s\x1b[0m', tempTestName);
                successes++;
                counter++;
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, error);
                }
              });
            } catch(err) {
              // If it throws then the test failed, capture the thrown error and log it in red
              error.push({
                'name': tempTestName,
                'error': err,
              });
              console.log('\x1b[31m%s\x1b[0m', tempTestName);
              counter++;
              if (counter === limit) {
                _app.produceTestReport(limit, successes, error);
              }
            }
          })();
        }
      }
    }
  }
}

// Produce test outcome report
_app.produceTestReport = function(limit, successes, errors) {
  console.log('');
  console.log('------------------ BEGIN TEST REPORT ------------------');
  console.log('');
  console.log('Total tests: ', limit);
  console.log('Pass: ', successes);
  console.log('Fail: ', errors.length);
  console.log('');

  // If there are errors print them in detail
  if (errors.length > 0) {
    console.log('------------------ BEGIN ERROR DETAILS ------------------');
    console.log('');

    errors.forEach(function(testError) {
      console.log('\x1b[31m%s\x1b[0m', testError.name);
      console.log(testError.error);
      console.log('');
    });

    console.log('');
    console.log('------------------ END ERROR DETAILS ------------------');
  }

  console.log('');
  console.log('------------------ END TEST REPORT ------------------');
  process.exit(0);
};

// Run the tests
_app.runTests();