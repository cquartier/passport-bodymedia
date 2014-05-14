/**
 * Module dependencies.
 */
var util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The BodyMedia authentication strategy authenticates requests by delegating to
 * BodyMedia using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Fitbit
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Fitbit will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new FitbitStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/fitbit/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'https://api.bodymedia.com/oauth/request_token';
  options.accessTokenURL = options.accessTokenURL || ' https://api.bodymedia.com/oauth/access_token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://api.bodymedia.com/oauth/authorize';
  options.sessionKey = options.sessionKey || 'oauth:bodymedia';

  OAuthStrategy.call(this, options, verify);
  this.name = 'bodymedia';
}


/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
* Return extra parameters to be included in the request token request.
*
* Mashery APIs require a parameter named api_key to be included on all requests
* which is the same as the consumerKey
*
* @param {Object} options
* @return {Object}
* @api protected
*/
Strategy.prototype.requestTokenParams = function(options) {
  return { api_key: options.consumerKey };
};

/**
* Return extra parameters to be included in the user authorization request.
*
* Mashery APIs require a parameter named api_key to be included on all requests
* which is the same as the consumerKey
* the provider.
*
* @param {Object} options
* @return {Object}
* @api protected
*/
Strategy.prototype.userAuthorizationParams = function(options) {
  return { api_key: options.consumerKey };
};

/**
 * Retrieve user profile from BodyMedia.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.get('http://api.bodymedia.com/v2/user/info?api_key=' + params.api_key, token, tokenSecret, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'fitbit' };
      profile.id = json.user.encodedId;
      profile.displayName = json.user.displayName;
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;