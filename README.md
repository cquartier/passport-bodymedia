# Passport-BodyMedia

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [BodyMedia](http://www.bodymedia.com/) using the OAuth 1.0a API.

This module lets you authenticate using BodyMedia in your Node.js applications.
By plugging into Passport, BodyMedia authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-bodymedia

## Usage

#### Configure Strategy

The BodyMedia authentication strategy authenticates users using a BodyMedia account
and OAuth tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a consumer key, consumer secret, and callback URL.

    passport.use(new FitbitStrategy({
        consumerKey: BODYMEDIA_CONSUMER_KEY,
        consumerSecret: BODYMEDIA_CONSUMER_SECRET,
        callbackURL: "http://localhost:3000/auth/bodymedia/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ bodymediaId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'bodymedia'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/bodymedia',
      passport.authenticate('bodymedia'));

    app.get('/auth/bodymedia/callback', 
      passport.authenticate('bodymedia', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

  - [Chris Quartier](http://github.com/cquartier)
  - [Jared Hanson](http://github.com/jaredhanson) - Shamelessly borrowed a lot of his work on other passport strategies

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Christopher Quartier