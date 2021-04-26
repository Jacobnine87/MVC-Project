const handleLogin = (e) => {
	console.log('Handling login!') // Debug
	
	e.preventDefault();

	$("#popupMessage").animate({width:'hide'}, 350);

	if($("#user").val() == '' || $("#pass").val() == '') {
		handleError("QUACK! Username or password is empty!");
		return false;
	}

	sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

	return false;
};

const handleSignup = (e) => {
	e.preventDefault();

	$("#popupMessage").animate({width:'hide'}, 350);

	if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
		handleError("QUACK! All fields are required!");
		return false;
	}

	if($("#pass").val() !== $("#pass2").val()) {
		handleError("QUACK! Passwords don't match!");
		return false;
	}

	sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

	return false;
};

const formClasses = `box mainForm`;

const LoginWindow = (props) => {
	return (
		<form 
			id="loginForm"
			name="loginForm"
			onSubmit={handleLogin}
			action="/login"
			method="POST"
			className={formClasses}
			>
			<input id="user" type="text" name="username" placeholder="Username"/>
			<input id="pass" type="password" name="pass" placeholder="Password"/>
			<input type="hidden" name="_csrf" value={props.csrf}/>
			<input type="submit" value="Login" className="formSubmit"/>
		</form>
	);
}

const SignupWindow = (props) => {
	return (
	<form id="signupForm"
		name="signupForm"
		onSubmit={handleSignup}
		action="/signup"
		method="POST"
		className={formClasses}
	>
	<input id="user" type="text" name="username" placeholder="Username"/>
	<input id="pass" type="password" name="pass" placeholder="Password"/>
	<input id="pass2" type="password" name="pass2" placeholder="Retype Password"/>
	<input type="hidden" name="_csrf" value={props.csrf}/>
	<input className="formSubmit" type="submit" value="Sign Up"/>
	</form>
	);
};

const createLoginWindow = (csrf) => {
	ReactDOM.render(
		<LoginWindow csrf={csrf} />,
		document.getElementById('content')
	);
};

const createSignupWindow = (csrf) => {
	ReactDOM.render(
		<SignupWindow csrf={csrf} />,
		document.getElementById('content')
	);
};

const setup = (csrf) => {
	const loginButton = document.getElementById('loginButton');
	const signupButton = document.getElementById('signupButton');

	signupButton.addEventListener('click', (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
	});

	loginButton.addEventListener('click', (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
	});


	createLoginWindow(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(() => {
	getToken();
});