let userData = {
  email: '',
  password: '',  
  username: '',  
  date_of_birth: '',
  profile_picture: '/images/oh-no-space.gif', 
};

const showErrorModal = (message) => {
  document.querySelector('#errorModalText').textContent = message;
  $('#errorModal').modal('show');
};

//handle teh close button on the modal
document.querySelector('#errorModalClose').addEventListener('click', () => {
  $('#errorModal').modal('hide');
});


const signupHandler = async (event) => {
  event.preventDefault(); 

  const firstname = document.querySelector('#firstname').value.trim();
  const lastname = document.querySelector('#lastname').value.trim();
  const email = document.querySelector('#email').value.trim();
  const dob = document.querySelector('#dob').value.trim();

  if (firstname && lastname && email && dob) {
    userData.email = email;
    userData.username = firstname + lastname;
    userData.date_of_birth = dob;

    // Replace the form
    document.querySelector('#signup-form').outerHTML = `
      <div class="signup-container">
        <form class="signup-form" id="password-form">
          <h2 class="signup-title">Create Password</h2>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <div class="form-group">
            <label for="password_confirm">Confirm Password</label>
            <input type="password" id="password_confirm" required>
          </div>
          <button type="submit" class="signup-button">Create Account</button>
        </form>
      </div>
    `;

    // Listen for the submit event on the new form
    document.querySelector('#password-form').addEventListener('submit', passwordHandler);
  }
};

const passwordHandler = async (event) => {
  event.preventDefault();

  const password = document.querySelector('#password').value.trim(); 
  const password_confirm = document.querySelector('#password_confirm').value.trim(); // Get the confirmed password

  if (password && password_confirm) {
    if (password !== password_confirm) {
      showErrorModal('Passwords do not match');
      return;
    }

    userData.password = password; 

    
    const response = await fetch('/api/user/signup', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      const data = await response.json();
      showErrorModal(data.message || 'Failed to register');
    }
  }
};

document.querySelector('#signup-form').addEventListener('submit', signupHandler);
