document.getElementById('signinBtn').addEventListener('click', function() {
    switchToSignIn();
});

document.getElementById('signupBtn').addEventListener('click', function() {
    if (document.getElementById('form-title').textContent === "Sign Up") {
        handleSignUp();
    } else {
        handleSignIn();
    }
});

function switchToSignIn() {
    document.getElementById('nameField').style.display = 'none'
    document.getElementById('form-title').textContent = 'Log In';
    document.getElementById('signupBtn').textContent = 'Log In';
    document.getElementById('signinBtn').textContent = 'Sign Up';
    document.getElementById('signinBtn').classList.toggle('toggle-btn');
    document.getElementById('signupBtn').classList.toggle('toggle-btn');
}

function switchToSignUp() {
    document.getElementById('nameField').style.display = 'block';
    document.getElementById('form-title').textContent = 'Sign Up';
    document.getElementById('signupBtn').textContent = 'Sign Up';
    document.getElementById('signinBtn').textContent = 'Sign In';
    document.getElementById('signinBtn').classList.toggle('toggle-btn');
    document.getElementById('signupBtn').classList.toggle('toggle-btn');
}

function handleSignUp() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Sign Up clicked:', username, email, password);  // Debugging output

    if (username && email && password) {
        const user = {
            username: username,
            email: email,
            password: password
        };

        // Storing in localStorage
        try {
            localStorage.setItem('user', JSON.stringify(user));
            console.log('User stored in localStorage:', localStorage.getItem('user'));  // Debugging output
            alert('Sign Up successful! Please sign in.');
            switchToSignIn();
        } catch (e) {
            console.error('Error storing user in localStorage:', e);  // Error handling
        }
    } else {
        alert('Please fill in all fields.');
    }
}

function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieving stored user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Sign In clicked:', email, password, 'Stored User:', storedUser);  // Debugging output

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert('Sign In successful!');
    } else {
        alert('Invalid email or password');
    }
}

document.getElementById('signinBtn').addEventListener('click', function() {
    if (document.getElementById('form-title').textContent === "Sign In") {
        switchToSignUp();
    }
});
