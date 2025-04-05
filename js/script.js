async function handleRegistration(event) {
    event.preventDefault(); // Prevent any default form behavior
  
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("error-message");
  
    errorMessageElement.innerText = ""; // Clear previous error messages
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
  
      if (data.redirect) {
        window.location.href = data.redirect;
      }
  
      if (!response.ok) {
        errorMessageElement.innerText = data.message; // Display error message
        // console.log(data.message);
      } else {
        // localStorage.setItem("loggedIn", "true"); // Store login status
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        // window.location.href = "/account"; // Redirect to Account Page
      }
    } catch (error) {
      errorMessageElement.innerText = "An error occurred. Please try again.";
    }
  }
  
  async function handleLogin(event) {
    event.preventDefault(); // Prevent any default form behavior
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("error-message");
  
    errorMessageElement.innerText = ""; // Clear previous error messages
  
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (data.redirect) {
        window.location.href = data.redirect;
      }
  
      if (!response.ok) {
        errorMessageElement.innerText = data.message; // Display error message
        console.log(data.message);
      } else {
        // localStorage.setItem("loggedIn", "true"); // Store login status
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        // window.location.href = "/account"; // Redirect to Account Page
      }
    } catch (error) {
      errorMessageElement.innerText = "An error occurred. Please try again.";
    }
  }
  
  async function handleLogin2(event) {
    event.preventDefault(); // Prevent any default form behavior
  
    const code = document.getElementById("code").value;
    const errorMessageElement = document.getElementById("error-message");
  
    errorMessageElement.innerText = ""; // Clear previous error messages
  
    try {
      const response = await fetch("/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        errorMessageElement.innerText = data.message; // Display error message
        console.log(data.message);
      } else {
        localStorage.setItem("loggedIn", "true"); // Store login status
        if (data.redirect) {
          window.location.href = data.redirect;
        }
        // window.location.href = "/account"; // Redirect to Account Page
      }
    } catch (error) {
      errorMessageElement.innerText = "An error occurred. Please try again.";
    }
  }
  