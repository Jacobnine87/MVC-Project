const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let QuoteModel = {};

const convertId = mongoose.Types.ObjectId;
const setQuote = (quote) => _.escape(quote).trim();
const setSpeaker = (speaker) => _.escape(speaker).trim();

const QuoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
    trim: true,
    set: setQuote,
  },
  speaker: {
    type: String,
    required: true,
    trim: true,
    set: setSpeaker,
  },
  public: {
    type: Boolean,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

QuoteSchema.statics.toAPI = (doc) => ({
  quote: doc.quote,
  speaker: doc.speaker,
  public: doc.public,
});

QuoteSchema.statics.findByAuthor = (authorId, callback) => {
  const search = { author: convertId(authorId) };
  return QuoteModel.find(search).select('quote speaker public').lean().exec(callback);
};

QuoteSchema.statics.deleteId = (quoteId, callback) => QuoteModel.findByIdAndDelete(quoteId)
  .lean().exec(callback);

QuoteSchema.statics.deleteByAuthorQuote = (authorId, argQuote, callback) => {
  const search = {
    author: convertId(authorId),
    quote: argQuote,
  };
  return QuoteModel.deleteOne(search).lean().exec(callback);
};

QuoteModel = mongoose.model('Quote', QuoteSchema);

module.exports.QuoteModel = QuoteModel;
module.exports.QuoteSchema = QuoteSchema;
