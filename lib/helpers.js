/*
* Helpers for various tasks
*/

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

// Container for all the helpers
var helpers = {};

// Sample for testing that returns a number
helpers.getANumber = function() {
  return 1;
};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  return false;
};

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
  try {
    var object = JSON.parse(str);
    return object;
  } catch(e) {
    return {};
  }
}

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstwxyz0123456789';

    // Start the string
    var str = '';
    for (i = 0; i < strLength; i++) {
      // Get a random character from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the final string
      str += randomCharacter;
    }
    return str;
  }
  return false;
}

// Get the string content of a template
helpers.getTemplate = function(templateName, data, callback) {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  if (templateName) {
    var templatesDir = path.join(__dirname, '/../templates/');
    fs.readFile(templatesDir+templateName+'.html', 'utf-8', function(err, str) {
      if (!err && str && str.length > 0) {
        // Do interpolation on the string before returning
        var finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

// Add the universal header and footer to a string and pass the provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = function(str, data, callback) {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

  // Get the header
  helpers.getTemplate('_header', data, function(err, headerStr) {
    if (!err && headerStr) {
      // Get the footer
      helpers.getTemplate('_footer', data, function(err, footerStr) {
        if (!err && footerStr) {
          // Add all the strings together
          var fullString = headerStr + str + footerStr;
          callback(false, fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
}

// take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function(str, data) {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

  // Add the template globals to the data object, prepending their key name with "globals"
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.'+keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object insert the value into the string at the corresponding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
      var replace = data[key];
      var find = '{' + key + '}';
      str = str.replace(find, replace);
    }
  }

  return str;
};

// Get the contents of a static AKA public assets
helpers.getStaticAsset = function(fileName, callback) {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if (fileName) {
    var publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir+fileName, function(err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
}

// Export the module
module.exports = helpers;