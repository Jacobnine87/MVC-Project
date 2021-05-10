"use strict";

var handleQuote = function handleQuote(e) {
  e.preventDefault();
  $("#popupMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#quoteText").val() == '' || $("#quotedPerson").val() == '' || $("#quoteDate").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  } //debugger;


  sendAjax('POST', $('#quoteForm').attr('action'), $('#quoteForm').serialize(), function () {
    loadQuotesFromServer($('#csrf').val());
  });
  return false;
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  sendAjax('DELETE', $('#deleteQuoteForm').attr('action'), $('#deleteQuoteForm').serialize(), function () {
    loadQuotesFromServer($('#csrf').val());
  });
  return false;
};

var handlePassChange = function handlePassChange(e) {
  e.preventDefault();
  $("#popupMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("QUACK! All fields required!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("QUACK! Passwords don't match!");
    return false;
  }

  sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);
};

var formClasses = "box";

var QuoteForm = function QuoteForm(props) {
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
  }), /*#__PURE__*/React.createElement("input", {
    id: "public",
    type: "checkbox",
    name: "public",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("p", {
    id: "sliderText"
  }, "Public?"), /*#__PURE__*/React.createElement("input", {
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

var QuoteList = function QuoteList(props) {
  if (props.quotes.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "quoteList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyQuote"
    }, "No Quotes Yet!"));
  } //	TODO: https://css-tricks.com/snippets/css/simple-and-nice-blockquote-styling/
  //	THIS ^^ Would look really cool


  var quoteNodes = props.quotes.map(function (quote) {
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
    }, " - ", quote.speaker, " "), /*#__PURE__*/React.createElement("form", {
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
      name: "id",
      value: quote._id
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "X"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "quoteList"
  }, quoteNodes);
};

var PassChangeWindow = function PassChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "passChangeForm",
    name: "passChangeForm",
    onSubmit: handlePassChange,
    action: "/changepassword",
    method: "POST",
    className: formClasses
  }, /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "Username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "Retype New Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password!"
  }));
};

var loadQuotesFromServer = function loadQuotesFromServer(csrf) {
  sendAjax('GET', '/quotes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(QuoteList, {
      quotes: data.quotes,
      csrf: csrf
    }), document.getElementById('content'));
  });
};

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PassChangeWindow, {
    csrf: csrf
  }), document.getElementById('content'));
};

var setup = function setup(csrf) {
  var passChangeButton = document.getElementById('changePassButton');
  var makerButton = document.getElementById('makerButton');
  var quotesButton = document.getElementById('quotesButton');
  var allQuotesButton = document.getElementById('allQuotesButton');
  passChangeButton.addEventListener('click', function (e) {
    e.preventDefault();
    createPassChangeWindow(csrf);
  });
  makerButton.addEventListener('click', function (e) {
    e.preventDefault();
    ReactDOM.render( /*#__PURE__*/React.createElement(QuoteForm, {
      csrf: csrf
    }), document.getElementById('content'));
  });
  quotesButton.addEventListener('click', function (e) {
    e.preventDefault();
    loadQuotesFromServer();
  });
  allQuotesButton.addEventListener('click', function (e) {
    e.preventDefault();
    sendAjax('GET', '/allquotes', null, function (data) {
      ReactDOM.render( /*#__PURE__*/React.createElement(QuoteList, {
        quotes: data.quotes,
        csrf: csrf
      }), document.getElementById('content'));
    });
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(QuoteForm, {
    csrf: csrf
  }), document.getElementById('content'));
  loadQuotesFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#popupMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("popupMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, err) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
