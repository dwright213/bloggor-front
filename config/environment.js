/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'bloggor-front',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },




  contentSecurityPolicy : {
    'default-src': "'none'",
    'script-src': "'self' https://cdn.mxpnl.com http://stats.pusher.com", // Allow scripts from https://cdn.mxpnl.com
    'font-src': "'self' https://maxcdn.bootstrapcdn.com", // Allow fonts to be loaded from http://fonts.gstatic.com
    'connect-src': "'self' https://api.mixpanel.com http://custom-api.local ws://ws.pusherapp.com", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
    'img-src': "'self' http://i0.kym-cdn.com www.unsigneddesign.com",
    'style-src': "'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com",
    'media-src': "'self'"
  },

    APP: {
      PUSHER_OPTS: {
        key: '1e5793784101bb7963f6',
        connection: {},
        logAllEvents: true
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
