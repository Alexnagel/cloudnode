'use strict';

var nwGui = require('nw.gui');
var mainWindow = nwGui.Window.get();
var app   = {};

/**
 * Start point of the app
 * Checks if the user is logged in, if so
 * show the app, otherwise show log in popup
 * @return {void}
 */
app.startApp = function startApp() {
  mainWindow.hide();
  mainWindow.showDevTools();

  if (!this.isAuthenticated()) {
    this.openAuthenticationPopup();
  } else {
    mainWindow.show();
  }
};

/**
 * Authenticate the user
 * Use the localstorage to look for a key
 * @return {boolean}
 */
app.isAuthenticated = function isAuthenticated() {
  return false;
};

/**
 * Function to open the soundcloud authenticate popup
 * If successful, save token and show app
 * @return {void}
 */
app.openAuthenticationPopup = function openPopup() {
  var popUp = nwGui.Window.open('http://www.cloudnodeapp.com/redirect.html', {
        position: 'center',
        width: 500,
        height: 500,
        focus: true,
        toolbar: false
      });

  var self = this;

  popUp.on('loaded', function() {
    if ((popUp.window.location.hostname + popUp.window.location.pathname) === 'www.cloudnodeapp.com/authcallback.html'){
      this.hide();

      var windowHref = popUp.window.location.href;

      this.close(true);

      self.saveAuthentication(windowHref);
    }
  });
};

/**
 * Receives the location of the popup window
 * this contains the accesstoken. Save this
 * in the SQLite database
 * @param  {string} windowHref The popup href
 * @return {void}
 */
app.saveAuthentication = function saveAuthentication(windowHref) {
  var token = this.getUrlVars(windowHref)['#access_token'];
  console.log(token);

  this.bootstrapSoundNode();
  mainWindow.show();
};

/**
 * Starts up the angular app
 * @return {void}
 */
app.bootstrapSoundNode = function bootstrapApp() {
  angular.bootstrap(document, ['cloudnode']);
};

/**
 * Get url vars out of a window.location.href
 * @param  {string} windowHref A window.location.href
 * @return {array}            array with the hashes
 */
app.getUrlVars = function getUrlVars(windowHref) {
  var vars = [], hash;

  var hashes = windowHref.slice(windowHref.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
};

// Starts the app
app.startApp();
