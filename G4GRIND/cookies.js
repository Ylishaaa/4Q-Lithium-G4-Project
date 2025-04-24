    function setCookie(cookieName, cookieValue, days = 365, path = "/") {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      let expires = "expires=" + date.toUTCString();
      document.cookie = ${cookieName}=${cookieValue}; ${expires}; path=${path};
    }

    function getCookie(cookieName) {
      const name = cookieName + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function checkUsername() {
      const username = getCookie("username");
      if (username) {
        document.getElementById("greeting").innerText = "Welcome back, " + username + "!";
      }
    }

    function setUsername() {
      const username = document.getElementById("username").value.trim();
      if (/^[a-zA-Z0-9]+$/.test(username)) {
        setCookie("username", username);
        document.getElementById("greeting").innerText = "Welcome, " + username + "!";
      } else {
        alert("Username can only contain letters and numbers.");
      }
    }

    window.onload = checkUsername;
