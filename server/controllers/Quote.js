const models = require('../models');

const { Quote } = models;

const makerPage = (req, res) => {
  Quote.QuoteModel.findByAuthor(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. ' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), quotes: docs });
  });
};

const makeQuote = (req, res) => {
  if (!req.body.quote
    || !req.body.speaker) {
    console.log(`req.body.quote: ${req.body.quote}`);
    console.log(`req.body.public: ${req.body.public}`);
    return res.status(400).json({ error: 'QUACK! All fields are required!' });
  }

  const quoteData = {
    quote: req.body.quote,
    speaker: req.body.speaker,
    public: req.body.public === 'on',
    author: req.session.account._id,
  };

  const newQuote = new Quote.QuoteModel(quoteData);
  const quotePromise = newQuote.save();

  quotePromise.then(() => res.json({ redirect: '/maker' }));

  quotePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Quote already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return quotePromise;
};
/*
const deleteQuote = (req, res) => Quote.QuoteModel.deleteByAuthorQuote(
  req.session.account._id,
  req.body.quote,
  (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.status(204).send();
  },
);
*/
const deleteQuote = (req, res) => Quote.QuoteModel.deleteId(req.body.id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.json({ quotes: docs });
});

const getQuotes = (req, res) => Quote.QuoteModel.findByAuthor(
  req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ quotes: docs });
  },
);

const quotePage = (req, res) => {
  Quote.QuoteModel.findByAuthor(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. ' });
    }
    return res.json({ csrfToken: req.csrfToken(), quotes: docs });
  });
};

const allQuotesPage = (req, res) => {
  Quote.QuoteModel.find({ public: true }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred. ' });
    }
    return res.json({ csrfToken: req.csrfToken(), quotes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.quotePage = quotePage;
module.exports.allQuotesPage = allQuotesPage;
module.exports.getQuotes = getQuotes;
module.exports.make = makeQuote;
module.exports.delete = deleteQuote;
