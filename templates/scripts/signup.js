/* eslint-env browser */
const feedback = document.querySelector('.signup-feedback');

function resetField(field) {
  // eslint-disable-next-line no-param-reassign
  field.innerHTML = '';
}

function sendFeedback(field, message) {
  // eslint-disable-next-line no-param-reassign
  field.innerHTML = message;
}

const user = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
};

/* This variable will be incremented every time a user's input fails validation.
  In the sendRequestToServer function, I will check if it is greater than 0 and stop sending the fetch request
*/
let numberOfWrongInputs = 0;

function validateFirstName() {
  const firstName = document.signup.firstName.value.trim();
  const feedbackField = document.querySelector('.firstName-feedback');
  const firstNameRequired = 'First name is required';
  const minFirstNameLength =
    'First name should be at least be 2 characters long';
  const shouldBeLetters = 'First name should only be letters of the alphabet';

  // Check if the first name field is not blank
  if (firstName.length === 0) {
    sendFeedback(feedbackField, firstNameRequired);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the first name is not less than 2 characters long
  if (firstName.length < 2) {
    sendFeedback(feedbackField, minFirstNameLength);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the first name is only made by alphabet letters
  if (!/^[a-zA-Z]+$/.test(firstName)) {
    sendFeedback(feedbackField, shouldBeLetters);
    numberOfWrongInputs += 1;
    return;
  }

  // Remove the text in the feedback field
  resetField(feedbackField);

  // Assign firstName value to user object
  user.firstName = firstName;
}

function validateLastName() {
  const lastName = document.signup.lastName.value.trim();
  const feedbackField = document.querySelector('.lastName-feedback');
  const lastNameRequired = 'Last name is required';
  const minLastNameLength = 'A last name should at least be 2 characters long';
  const shouldBeLetters = 'A last name should only be letters of the alphabet';

  // Check if the last name field is not empty
  if (lastName.length === 0) {
    sendFeedback(feedbackField, lastNameRequired);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the last name is not less than 2 characters long
  if (lastName.length < 2) {
    sendFeedback(feedbackField, minLastNameLength);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the last name is only comprised by alphabet letters
  if (!/^[a-zA-Z]+$/.test(lastName)) {
    sendFeedback(feedbackField, shouldBeLetters);
    numberOfWrongInputs += 1;
    return;
  }

  // Remove the text in the feedback field
  resetField(feedbackField);

  // Assign lastName value to user object
  user.lastName = lastName;
}

function validateEmail() {
  const email = document.signup.email.value.trim();
  const feedbackField = document.querySelector('.email-feedback');
  const includesAt = email.split('').includes('@');
  const includesdot = email.split('').includes('.');
  const atSignIndex = email.split('').indexOf('@');
  const dotIndex = email.split('').lastIndexOf('.');
  const emailRequired = 'Email address is required';
  const invalidEmail = 'Please provide a valid email address';

  // Check if the email field is not empty
  if (email.length === 0) {
    sendFeedback(feedbackField, emailRequired);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the email includes an '@' and a '.'
  if (!includesAt || !includesdot) {
    sendFeedback(feedbackField, invalidEmail);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if there are letters between '@' and '.' AND if '@' comes before the '.'
  if (dotIndex - atSignIndex < 3 || atSignIndex > dotIndex) {
    sendFeedback(feedbackField, invalidEmail);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the '.' is not the last character
  if (dotIndex === email.length - 1) {
    sendFeedback(feedbackField, invalidEmail);
    numberOfWrongInputs += 1;
    return;
  }

  // Remove the text in the feedback field
  resetField(feedbackField);

  // Assign email value to user object
  user.email = email;
}

function validatePhoneNumber() {
  const phoneNumber = document.signup.phoneNumber.value.trim();
  const feedbackField = document.querySelector('.tel-feedback');
  const phoneNumberRequired = 'A phone number is required';
  const minPhoneNumberLength = 'A phone number should be 10 characters long';
  const shouldBeNumbers = 'A phone number should be comprised of numbers';

  // Check if phoneNumber field is empty
  if (phoneNumber.length === 0) {
    sendFeedback(feedbackField, phoneNumberRequired);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the phoneNumber is not 10 characters long
  if (phoneNumber.length !== 10) {
    sendFeedback(feedbackField, minPhoneNumberLength);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if phoneNumber is made of numbers between 0 and 9
  if (!/^[+]?[0-9]+$/.test(phoneNumber)) {
    sendFeedback(feedbackField, shouldBeNumbers);
    numberOfWrongInputs += 1;
    return;
  }

  // Remove the text in the phone number feedback field
  resetField(feedbackField);

  // Assign phoneNumber value to user object
  user.phoneNumber = phoneNumber;
}

function validatePassword() {
  const password = document.signup.password.value.trim();
  const feedbackField = document.querySelector('.password-feedback');
  const passwordRequired = 'The password is required';
  const shouldContainNumbersAndLetters =
    'The password should contain at least numbers and letters';
  const minPasswordLength = 'The password should contain at least 8 characters';

  // Check if the password field is empty
  if (password.length === 0) {
    sendFeedback(feedbackField, passwordRequired);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if it's comprised of alphanumeric characters
  if (!/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(password)) {
    sendFeedback(feedbackField, shouldContainNumbersAndLetters);
    numberOfWrongInputs += 1;
    return;
  }
  // Check if it's not less than 8 characters
  if (password.length < 8) {
    sendFeedback(feedbackField, minPasswordLength);
    numberOfWrongInputs += 1;
    return;
  }
  // Remove text from the feedback field
  resetField(feedbackField);

  // Assign password value to user object
  user.password = password;
}

function validateConfirmPassword() {
  const confirmPassword = document.signup.confirmPassword.value.trim();
  const password = document.signup.password.value.trim();
  const feedbackField = document.querySelector('.confirmPassword-feedback');
  const isRequired = 'Repeated password required';
  const shouldContainNumbersAndLetters =
    'The password should contain at least numbers and letters';
  const minPasswordLength = 'The password should contain at least 8 characters';
  const shouldMatch = 'Passwords should match';

  // Check if the field is not empty
  if (confirmPassword.length === 0) {
    sendFeedback(feedbackField, isRequired);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if the field is comprised of alphanumeric characters
  if (!/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(password)) {
    sendFeedback(feedbackField, shouldContainNumbersAndLetters);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if confirmPassword is not less than 8 characters
  if (confirmPassword.length < 8) {
    sendFeedback(feedbackField, minPasswordLength);
    numberOfWrongInputs += 1;
    return;
  }

  // Check if confirmPassword is the same as the password
  if (confirmPassword !== password) {
    sendFeedback(feedbackField, shouldMatch);
    numberOfWrongInputs += 1;
    return;
  }

  // Reset the feedback field
  resetField(feedbackField);

  // Assign confirmPassword value to user object
  user.confirmPassword = confirmPassword;
}

function userResponse(res) {
  if (res.status === 201) {
    const container = document.querySelector('.container');
    container.innerHTML =
      '<p class="warning">Account created successfully. Proceed with sign in!</p>';
    return;
  }
  feedback.innerHTML = `<span class="warning">${res.error}</span>`;
}

async function sendRequestToServer() {
  // Empty the feedback field
  feedback.innerHTML = '';
  console.log(numberOfWrongInputs);

  // Check if user input is valid
  if (numberOfWrongInputs > 0) {
    // Reset the numberOfWrongInputs and return

    numberOfWrongInputs = 0;
    return;
  }

  // Send request to the server
  // const response = await fetch('http://localhost:5000/api/auth/signup', {
  //   method: 'POST',
  //   body: JSON.stringify(user),
  //   headers: {
  //     'Content-type': 'application/json; charset=UTF-8'
  //   }

  const response = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });

  const data = await response.json();
  console.log(data);
  await userResponse(data);

  // Reset numberOfWrongInputs after sending a request
  numberOfWrongInputs = 0;
}

function validateAndSendData() {
  validateFirstName();
  validateLastName();
  validateEmail();
  validatePhoneNumber();
  validatePassword();
  validateConfirmPassword();
  sendRequestToServer();
}

const createAccount = document.querySelector('#create-account');

createAccount.addEventListener('click', event => {
  //   window.location.href = '../html/user-view-parties.html';
  event.preventDefault();
  validateAndSendData();
});
