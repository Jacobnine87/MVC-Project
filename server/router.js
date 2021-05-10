const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getQuotes', mid.requiresLogin, controllers.Quote.getQuotes);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/maker', mid.requiresLogin, controllers.Quote.makerPage);
  app.get('/quotes', mid.requiresLogin, controllers.Quote.quotePage);
  app.get('/allquotes', mid.requiresLogin, controllers.Quote.allQuotesPage);
  app.post('/submitquote', mid.requiresLogin, controllers.Quote.make);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.delete('/delete', mid.requiresLogin, controllers.Quote.delete);
  // TODO: Home page gets all public quotes WITHOUT login
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
