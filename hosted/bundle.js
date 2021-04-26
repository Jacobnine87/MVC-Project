const handleQuote = e => {
  e.preventDefault();
  $("#popupMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#quoteText").val() == '' || $("#quotedPerson").val() == '' || $("#quoteDate").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  }

  sendAjax('POST', $('#quoteForm').attr('action'), $('#quoteForm').serialize(), () => {
    loadQuotesFromServer($('#csrf').val());
  });
  return false;
};

const handleDelete = e => {
  e.preventDefault();
  sendAjax('DELETE', $('#deleteQuoteForm').attr('action'), $('#deleteQuoteForm').serialize(), () => {
    loadQuotesFromServer($('#csrf').val());
  });
  return false;
};

const formClasses = `box`;

const QuoteForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "quoteForm",
    onSubmit: handleQuote,
    name: "quoteForm",
    action: "/submitquote",
    method: "POST",
    className: formClasses
  }, /*#__PURE__*/React.createElement("input", {
    id: "quote",
    type: "text",
    name: "quote",
    placeholder: "Quote to record"
  }), /*#__PURE__*/React.createElement("input", {
    id: "speaker",
    type: "text",
    name: "speaker",
    placeholder: "Who said it?"
  }), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "public",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider round"
  }, /*#__PURE__*/React.createElement("p", {
    id: "sliderText"
  }, "Public?"))), /*#__PURE__*/React.createElement("input", {
    id: "csrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "quoteSubmit",
    type: "submit",
    value: "Save"
  }));
};

const QuoteList = props => {
  if (props.quotes.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "quoteList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyQuote"
    }, "No Quotes Yet!"));
  }

  console.log(props); // Debugging
  //	TODO: https://css-tricks.com/snippets/css/simple-and-nice-blockquote-styling/
  //	THIS ^^ Would look really cool

  const quoteNodes = props.quotes.map(quote => {
    return /*#__PURE__*/React.createElement("div", {
      key: quote._id,
      className: "quote"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/bubble.png",
      alt: "thought bubble",
      className: "bubble"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "quote"
    }, "Quote: ", quote.quote, " "), /*#__PURE__*/React.createElement("h3", {
      className: "speaker"
    }, " -", quote.speaker, " "), /*#__PURE__*/React.createElement("form", {
      id: "deleteQuoteForm",
      name: "deleteQuoteForm",
      onSubmit: handleDelete,
      action: "/delete",
      method: "DELETE",
      className: "deleteQuoteForm"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "quote",
      value: quote.quote
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "\uE020"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "quoteList"
  }, quoteNodes);
};

const loadQuotesFromServer = csrf => {
  sendAjax('GET', '/getQuotes', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(QuoteList, {
      quotes: data.quotes,
      csrf: csrf
    }), document.getElementById('quotes'));
  });
};

const setup = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(QuoteForm, {
    csrf: csrf
  }), document.getElementById('makeQuote'));
  ReactDOM.render( /*#__PURE__*/React.createElement(QuoteList, {
    quotes: [],
    csrf: csrf
  }), document.getElementById('quotes'));
  loadQuotesFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});
const handleError = message => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: (xhr, status, err) => {
      let messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
