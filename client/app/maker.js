const handleQuote = (e) => {
	e.preventDefault();

	$("#popupMessage").animate({width: 'hide'}, 350);

	if($("#quoteText").val() == '' || $("#quotedPerson").val() == '' || $("#quoteDate").val() == '') {
		handleError("RAWR! All fields are required!");
		return false;
	}
	//debugger;
	sendAjax('POST', $('#quoteForm').attr('action'), $('#quoteForm').serialize(), () => {
		loadQuotesFromServer($('#csrf').val());
	});

	return false;
};

const handleDelete = (e) => {
	e.preventDefault();

	sendAjax('DELETE', $('#deleteQuoteForm').attr('action'), $('#deleteQuoteForm').serialize(), () => {
		loadQuotesFromServer($('#csrf').val());
	});

	return false;
};

const handlePassChange = (e) => {
	e.preventDefault();

	$("#popupMessage").animate({width:'hide'}, 350);

	if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
		handleError("QUACK! All fields required!");
		return false;
	}

	if($("#pass").val() !== $("#pass2").val()) {
		handleError("QUACK! Passwords don't match!");
		return false;
	}

	sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);
};

const formClasses = `box`;

const QuoteForm = (props) => {
	return (
		<form 
		id="quoteForm"
		onSubmit={handleQuote}
		name="quoteForm"
		action="/submitquote"
		method="POST"
		className={formClasses}
		>
			<input id="quote" type="text" name="quote" placeholder="Quote to record"/>
			<input id="speaker" type="text" name="speaker" placeholder="Who said it?"/>
			<input id="public" type="checkbox" name="public" defaultChecked />
			  <p id="sliderText">Public?</p>
			<input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
			<input className="quoteSubmit" type="submit" value="Save"/>
		</form>
	);
};

const QuoteList = (props) => {
	if(props.quotes.length === 0) {
		return (
			<div className="quoteList">
				<h3 className="emptyQuote">No Quotes Yet!</h3>
			</div>
		);
	}

	//	TODO: https://css-tricks.com/snippets/css/simple-and-nice-blockquote-styling/
	//	THIS ^^ Would look really cool

	const quoteNodes = props.quotes.map((quote) => {
		return (
			<div key={quote._id} className="quote">
				<img src="/assets/img/bubble.png" alt="thought bubble" className="bubble" />
				<h3 className="quote">Quote: {quote.quote} </h3>
				<h3 className="speaker"> - {quote.speaker} </h3>
				<form id="deleteQuoteForm"
					name="deleteQuoteForm"
					onSubmit={handleDelete}
					action="/delete"
					method="DELETE"
					className="deleteQuoteForm"
				>
					<input type="hidden" name="_csrf" value={props.csrf} />
					<input type="hidden" name="id" value={quote._id} />
					{/* TODO: Fix above line to use quote._id */}
					<input className="formSubmit" type="submit" value="X" />
				</form>
			</div>
		);
	});

	return (
		<div className="quoteList">
			{quoteNodes}
		</div>
	);
};

const PassChangeWindow = (props) => {
	return (
	<form id="passChangeForm"
		name="passChangeForm"
		onSubmit={handlePassChange}
		action="/changepassword"
		method="POST"
		className={formClasses}
	>
	<input id="user" type="text" name="username" placeholder="Username"/>
	<input id="pass" type="password" name="pass" placeholder="New Password"/>
	<input id="pass2" type="password" name="pass2" placeholder="Retype New Password"/>
	<input type="hidden" name="_csrf" value={props.csrf}/>
	<input className="formSubmit" type="submit" value="Change Password!"/>
	</form>
	);
};

const loadQuotesFromServer = (csrf) => {
	sendAjax('GET', '/quotes', null, (data) => {
			ReactDOM.render(
				<QuoteList quotes={data.quotes} csrf={csrf}/>,
				document.getElementById('content'));
		});
};

const createPassChangeWindow = (csrf) => {
	ReactDOM.render(
	<PassChangeWindow csrf={csrf} />,
	document.getElementById('content')
	);
};

const setup = (csrf) => {
	const passChangeButton = document.getElementById('changePassButton');
	const makerButton = document.getElementById('makerButton');
	const quotesButton = document.getElementById('quotesButton');
	const allQuotesButton = document.getElementById('allQuotesButton');

	passChangeButton.addEventListener('click', (e) => {
		e.preventDefault();
		createPassChangeWindow(csrf);
	});

	makerButton.addEventListener('click', (e) => {
		e.preventDefault();
		ReactDOM.render(
			<QuoteForm csrf={csrf} />,
			document.getElementById('content')
		);
	});

	quotesButton.addEventListener('click', (e) => {
		e.preventDefault();
		loadQuotesFromServer();
	});

	allQuotesButton.addEventListener('click', (e) => {
		e.preventDefault();
		sendAjax('GET', '/allquotes', null, (data) => {
			ReactDOM.render(
				<QuoteList quotes={data.quotes} csrf={csrf}/>,
				document.getElementById('content'));
		});
	})

	ReactDOM.render(
		<QuoteForm csrf={csrf} />,
		document.getElementById('content')
	);

	loadQuotesFromServer(csrf);
};



const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(() => {
	getToken();
});