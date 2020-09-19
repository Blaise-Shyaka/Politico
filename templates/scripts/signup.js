/* eslint-env browser */
function resetField(field) {
  // eslint-disable-next-line no-param-reassign
  field.innerHTML = '';
}

function validateFirstName() {
  const firstName = document.signup.firstName.value.trim();
  const feedback = document.querySelector('.firstName-feedback');

  // Check if the first name field is not blank
  if (firstName.length === 0) {
    feedback.innerHTML = 'First name can not be left blank';
    return;
  }

  // Check if the first name is not less than 2 characters long
  if (firstName.length < 2) {
    feedback.innerHTML = 'A first name should at least be 2 characters';
    return;
  }

  // Check if the first name is only made by alphabet letters
  if (!firstName.match(/^[a-zA-Z]+$/)) {
    feedback.innerHTML = 'A first name should only be letters of the alphabet';
    return;
  }

  // Remove the text in the feedback field
  resetField(feedback);
}

function validateLastName() {
  const lastName = document.signup.lastName.value.trim();
  const feedback = document.querySelector('.lastName-feedback');

  // Check if the last name field is not empty
  if (lastName.length === 0) {
    feedback.innerHTML = 'Last name can not be blank';
    return;
  }

  // Check if the last name is not less than 2 characters long
  if (lastName.length < 2) {
    feedback.innerHTML = 'A last name should at least be 2 characters';
    return;
  }

  // Check if the last name is only comprised by alphabet letters
  if (!lastName.match(/^[a-zA-Z]+$/)) {
    feedback.innerHTML = 'A last name should only be letters of the alphabet';
    return;
  }

  // Remove the text in the feedback field
  resetField(feedback);
}

function validateEmail() {
  const email = document.signup.email.value.trim();
  const feedback = document.querySelector('.email-feedback');
  const includesAt = email.split('').includes('@');
  const includesdot = email.split('').includes('.');
  const atSignIndex = email.split('').indexOf('@');
  const dotIndex = email.split('').lastIndexOf('.');

  // Check if the email field is not empty
  if (email.length === 0) {
    feedback.innerHTML = 'Email address is required';
    return;
  }

  // Check if the email includes an '@' and a '.'
  if (!includesAt || !includesdot) {
    feedback.innerHTML = 'Please provide a valid email address';
    return;
  }

  // Check if there are letters between '@' and '.' AND if '@' comes before the '.'
  if (dotIndex - atSignIndex < 3 || atSignIndex > dotIndex) {
    feedback.innerHTML = 'Please provide a valid email address';
    return;
  }

  // Check if the '.' is not the last character
  if (dotIndex === email.length - 1) {
    feedback.innerHTML = 'Your email is not valid';
    return;
  }

  // Remove the text in the feedback field
  resetField(feedback);
}

function validatePhoneNumber() {
  const phoneNumber = document.signup.phoneNumber.value;
  const feedback = document.querySelector('.tel-feedback');

  // Check if the phoneNumber field is not empty
  if (phoneNumber.length === 0 || phoneNumber.length !== 10) {
    feedback.innerHTML = 'A phone number should be 10 characters long';
    return;
  }

  // Check if it is made of numbers between 0 and 9
  if (!phoneNumber.match(/^[+]?[0-9]+$/)) {
    feedback.innerHTML = 'A phone number should be comprised of numbers';
    return;
  }

  // Remove the text in the phone number feedback field
  resetField(feedback);
}

function validatePassword() {
  const password = document.signup.password.value;
  const feedback = document.querySelector('.password-feedback');

  // Check if the password field is empty
  if (password.length === 0) {
    feedback.innerHTML = 'The password is required';
    return;
  }

  // Check if it's comprised of alphanumeric characters
  if (!/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(password)) {
    feedback.innerHTML =
      'The password should contain at least numbers and letters';
    return;
  }
  // Check if it's not less than 8 characters
  if (password.length < 8) {
    feedback.innerHTML = 'The password should contain at least 8 characters';
    return;
  }
  // Remove text from the feedback field
  resetField(feedback);
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
