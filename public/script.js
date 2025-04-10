async function handleRegistration(event) {
  event.preventDefault(); 

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessageElement = document.getElementById("error-message");

  errorMessageElement.innerText = ""; 

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
      errorMessageElement.innerText = data.message; 
     
    } else {
      
      if (data.redirect) {
        window.location.href = data.redirect;
      }
     
    }
  } catch (error) {
    errorMessageElement.innerText = "An error occurred. Please try again.";
  }
}

async function handleLogin(event) {
  event.preventDefault(); 

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessageElement = document.getElementById("error-message");

  errorMessageElement.innerText = ""; 

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
      errorMessageElement.innerText = data.message; 
      console.log(data.message);
    } else {
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    }
  } catch (error) {
    errorMessageElement.innerText = "An error occurred. Please try again.";
  }
}




async function handleLogin2(event) {
  event.preventDefault(); 

  const code = document.getElementById("code").value;
  const errorMessageElement = document.getElementById("error-message");

  errorMessageElement.innerText = ""; 

  try {
    const response = await fetch("/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessageElement.innerText = data.message;
      console.log(data.message);
    } else {
      
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", data.username); 

     
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    }
  } catch (error) {
    errorMessageElement.innerText = "An error occurred. Please try again.";
  }
}

