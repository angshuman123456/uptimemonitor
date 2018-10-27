/* 
* Create and export configuration variables
*
*/

// Container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: process.env.PORT || 3000,
  httpsPort: process.env.PORT || 3001,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006'
  },
  templateGlobals: {
    'appName': 'UpTimeChecker',
    'companyName': 'NotARealCompany, Inc.',
    'yearCreated': '2018',
    'baseUrl': 'http://localhost:3000/',
  }
};

// Testing environment
environments.testing = {
  httpPort: process.env.PORT || 4000,
  httpsPort: process.env.PORT || 4001,
  envName: 'testing',
  hashingSecret: 'thisIsASecret',
  maxChecks: 5,
  templateGlobals: {
    'appName': 'UpTimeChecker',
    'companyName': 'NotARealCompany, Inc.',
    'yearCreated': '2018',
    'baseUrl': 'uptimemonitor-demo.herokuapp.com/',
  }
};

// Production environmemt
environments.production = {
  httpPort: process.env.PORT || 5000,
  httpsPort: process.env.PORT || 5001,
  envName: 'production',
  hashingSecret: 'thisIsAlsoASecret',
  maxChecks: 5,
  templateGlobals: {
    'appName': 'UpTimeChecker',
    'companyName': 'NotARealCompany, Inc.',
    'yearCreated': '2018',
    'baseUrl': 'https://uptimemonitor-demo.herokuapp.com/',
  }
};

// Determine which environment was passed as a command line argunment
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
var environmemtToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmemtToExport;
