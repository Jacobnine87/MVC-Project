const handleQuote = (e) => {
	e.preventDefault();

	$("#popupMessage").animate({width: 'hide'}, 350);

	if($("#quoteText").val() == '' || $("#quotedPerson").val() == '' || $("#quoteDate").val() == '') {
		handleError("RAWR! All fields are required!");
		return false;
	}

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
			<label className="switch">
			  <input type="checkbox" name="public" defaultChecked />
			  <span className="slider round"><p id="sliderText">Public?</p></span>
			</label>
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
	console.log(props); // Debugging

	//	TODO: https://css-tricks.com/snippets/css/simple-and-nice-blockquote-styling/
	//	THIS ^^ Would look really cool

	const quoteNodes = props.quotes.map((quote) => {
		return (
			<div key={quote._id} className="quote">
				<img src="/assets/img/bubble.png" alt="thought bubble" className="bubble" />
				<h3 className="quote">Quote: {quote.quote} </h3>
				<h3 className="speaker"> -{quote.speaker} </h3>
				<form id="deleteQuoteForm"
					name="deleteQuoteForm"
					onSubmit={handleDelete}
					action="/delete"
					method="DELETE"
					className="deleteQuoteForm"
				>
					<input type="hidden" name="_csrf" value={props.csrf} />
					<input type="hidden" name="quote" value={quote.quote} />
					{/* TODO: Fix above line to use quote._id */}
					<input className="formSubmit" type="submit" value="&#xe020;" />
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

const loadQuotesFromServer = (csrf) => {
	sendAjax('GET', '/getQuotes', null, (data) => {
		ReactDOM.render(
			<QuoteList quotes={data.quotes} csrf={csrf}/>,
			document.getElementById('quotes'));
	});
};

const setup = (csrf) => {
	ReactDOM.render(
		<QuoteForm csrf={csrf} />,
		document.getElementById('makeQuote')
	);

	ReactDOM.render(
		<QuoteList quotes={[]} csrf={csrf} />,
		document.getElementById('quotes')
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