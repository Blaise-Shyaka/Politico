/* eslint-env browser */

// Validate the user input
const email = document.loginForm.email.value.trim();
const password = document.loginForm.password.value.trim();
const emailFeedback = document.querySelector('#email-feedback');
const pwFeedback = document.querySelector('#password-feedback');
const signin = document.querySelector('#signin');

function validEmail() {
  const includesAt = email.split('').includes('@');
  const includesdot = email.split('').includes('.');
  const atSignIndex = email.split('').indexOf('@');
  const dotIndex = email.split('').lastIndexOf('.');
  const emailRequired = 'Email address is required';
  const invalidEmail = 'Please provide a valid email address';

  // Check if the email field is not empty
  if (email.length === 0) {
    emailFeedback.innerHTML = emailRequired;
    return;
  }

  // Check if the email includes an '@' and a '.'
  if (!includesAt || !includesdot) {
    emailFeedback.innerHTML = invalidEmail;
    return;
  }

  // Check if there are letters between '@' and '.' AND if '@' comes before the '.'
  if (dotIndex - atSignIndex < 3 || atSignIndex > dotIndex) {
    emailFeedback.innerHTML = invalidEmail;
    return;
  }

  // Check if the '.' is not the last character
  if (dotIndex === email.length - 1) emailFeedback.innerHTML = invalidEmail;

  emailFeedback.innerHTML = '';

  // eslint-disable-next-line consistent-return
  return true;
}

function validPassword() {
  const passwordRequired = 'The password is required';
  const shouldContainNumbersAndLetters =
    'The password should contain at least numbers and letters';
  const minPasswordLength = 'The password should contain at least 8 characters';

  // Check if the password field is empty
  if (password.length === 0) {
    pwFeedback.innerHTML = passwordRequired;
    return;
  }

  // Check if it's comprised of alphanumeric characters
  if (!/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(password)) {
    pwFeedback.innerHTML = shouldContainNumbersAndLetters;
    return;
  }
  // Check if it's not less than 8 characters
  if (password.length < 8) {
    pwFeedback.innerHTML = minPasswordLength;
    return;
  }

  // Remove text from the feedback field
  pwFeedback.innerHTML = '';

  // eslint-disable-next-line consistent-return
  return true;
}

async function loginUser(mail, pw) {
  const userData = await fetch(
    'https://politico-web-io.herokuapp.com/api/auth/signin',
    {
      method: 'POST',
      body: JSON.stringify({ email: mail, password: pw }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }
  );

  const userDetails = await userData.json();

  localStorage.setItem('userInfo', userDetails);
}

signin.addEventListener('click', e => {
  e.preventDefault();
});
// Make a fetch request and persist the JWT
