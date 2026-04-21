const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const dashboardBtn = document.getElementById("dashboardBtn");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardMessage = document.getElementById("dashboardMessage");
const sessionStatus = document.getElementById("sessionStatus");
const toast = document.getElementById("toast");

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.style.background = isError ? "#7f1d1d" : "#1f2933";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();
  return { response, data };
}

async function refreshSession() {
  try {
    const { response, data } = await apiRequest("/dashboard", { method: "GET" });

    if (response.ok) {
      dashboardMessage.textContent = data.message;
      sessionStatus.textContent = "Logged in";
      sessionStatus.style.background = "rgba(13, 148, 136, 0.2)";
      sessionStatus.style.color = "#0f766e";
      return;
    }

    dashboardMessage.textContent = "Login first, then fetch your welcome message.";
    sessionStatus.textContent = "Logged out";
    sessionStatus.style.background = "rgba(190, 18, 60, 0.18)";
    sessionStatus.style.color = "#9f1239";
  } catch (error) {
    showToast("Could not connect to server", true);
  }
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const payload = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const { response, data } = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    showToast(data.message || "Register request completed", !response.ok);

    if (response.ok) {
      registerForm.reset();
    }
  } catch (error) {
    showToast("Registration failed", true);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const payload = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const { response, data } = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    showToast(data.message || "Login request completed", !response.ok);

    if (response.ok) {
      loginForm.reset();
      refreshSession();
    }
  } catch (error) {
    showToast("Login failed", true);
  }
});

dashboardBtn.addEventListener("click", refreshSession);

logoutBtn.addEventListener("click", async () => {
  try {
    const { response, data } = await apiRequest("/logout", { method: "GET" });
    showToast(data.message || "Logout request completed", !response.ok);
    refreshSession();
  } catch (error) {
    showToast("Logout failed", true);
  }
});

refreshSession();
