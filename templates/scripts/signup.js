/* eslint-env browser */
function resetField(field) {
  // eslint-disable-next-line no-param-reassign
  field.innerHTML = '';
}

function sendFeedback(field, message) {
  // eslint-disable-next-line no-param-reassign
  field.innerHTML = message;
}

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
    return;
  }

  // Check if the first name is not less than 2 characters long
  if (firstName.length < 2) {
    sendFeedback(feedbackField, minFirstNameLength);
    return;
  }

  // Check if the first name is only made by alphabet letters
  if (!firstName.match(/^[a-zA-Z]+$/)) {
    sendFeedback(feedbackField, shouldBeLetters);
    return;
  }

  // Remove the text in the feedback field
  resetField(feedbackField);
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
    return;
  }

  // Check if the last name is not less than 2 characters long
  if (lastName.length < 2) {
    sendFeedback(feedbackField, minLastNameLength);
    return;
  }

  // Check if the last name is only comprised by alphabet letters
  if (!lastName.match(/^[a-zA-Z]+$/)) {
    sendFeedback(feedbackField, shouldBeLetters);
    return;
  }

  // Remove the text in the feedback field
  resetField(feedbackField);
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
    return;
  }

  // Check if the email includes an '@' and a '.'
  if (!includesAt || !includesdot) {
    sendFeedback(feedbackField, invalidEmail);
    return;
  }

  // Check if there are letters between '@' and '.' AND if '@' comes before the '.'
  if (dotIndex - atSignIndex < 3 || atSignIndex > dotIndex) {
    sendFeedback(feedbackField, invalidEmail);
    return;
  }

  // Check if the '.' is not the last character
  if (dotIndex === email.length - 1) {
    sendFeedback(feedbackField, invalidEmail);
    return;
  }

  // Remove the text in the feedback field
  resetField(feedbackField);
}

function validatePhoneNumber() {
  const phoneNumber = document.signup.phoneNumber.value;
  const feedbackField = document.querySelector('.tel-feedback');
  const phoneNumberRequired = 'A phone number is required';
  const minPhoneNumberLength = 'A phone number should be 10 characters long';
  const shouldBeNumbers = 'A phone number should be comprised of numbers';

  // Check if phoneNumber field is empty
  if (phoneNumber.length === 0) {
    sendFeedback(feedbackField, phoneNumberRequired);
    return;
  }

  // Check if the phoneNumber is not 10 characters long
  if (phoneNumber.length !== 10) {
    sendFeedback(feedbackField, minPhoneNumberLength);
    return;
  }

  // Check if phooneNumber is made of numbers between 0 and 9
  if (!phoneNumber.match(/^[+]?[0-9]+$/)) {
    sendFeedback(feedbackField, shouldBeNumbers);
    return;
  }

  // Remove the text in the phone number feedback field
  resetField(feedbackField);
}

function validatePassword() {
  const password = document.signup.password.value;
  const feedbackField = document.querySelector('.password-feedback');
  const passwordRequired = 'The password is required';
  const shouldContainNumbersAndLetters =
    'The password should contain at least numbers and letters';
  const minPasswordLength = 'The password should contain at least 8 characters';

  // Check if the password field is empty
  if (password.length === 0) {
    sendFeedback(feedbackField, passwordRequired);
    return;
  }

  // Check if it's comprised of alphanumeric characters
  if (!/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(password)) {
    sendFeedback(feedbackField, shouldContainNumbersAndLetters);
    return;
  }
  // Check if it's not less than 8 characters
  if (password.length < 8) {
    sendFeedback(feedbackField, minPasswordLength);
    return;
  }
  // Remove text from the feedback field
  resetField(feedbackField);
}

function validateAndSendData() {
  validateFirstName();
  validateLastName();
  validateEmail();
  validatePhoneNumber();
  validatePassword();
}

const createAccount = document.querySelector('#create-account');

createAccount.addEventListener('click', () => {
  //   window.location.href = '../html/user-view-parties.html';
  validateAndSendData();
});
