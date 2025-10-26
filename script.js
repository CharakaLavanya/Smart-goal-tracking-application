document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const goalForm = document.getElementById("goalForm");
  const goalList = document.getElementById("goalList");

  // === Register ===
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;

      localStorage.setItem("user", JSON.stringify({ name, email, password, goals: [] }));
      alert("Registration successful!");
      window.location.href = "index.html";
    });
  }

  // === Login ===
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.email === email && user.password === password) {
        localStorage.setItem("loggedIn", true);
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid email or password!");
      }
    });
  }

  // === Dashboard ===
  if (goalForm) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first!");
      window.location.href = "index.html";
      return;
    }

    const updateGoals = () => {
      goalList.innerHTML = user.goals
        .map(
          (goal, index) => `
          <div class="goal-item ${goal.completed ? 'completed' : ''}">
            <div class="goal-details">
              <h3>${goal.title}</h3>
              <p>${goal.desc}</p>
            </div>
            <div class="goal-buttons">
              ${
                goal.completed
                  ? `<button class="undo-btn" onclick="undoGoal(${index})">Undo</button>`
                  : `<button class="complete-btn" onclick="completeGoal(${index})">Complete</button>`
              }
              <button class="delete-btn" onclick="deleteGoal(${index})">Delete</button>
            </div>
          </div>`
        )
        .join("");
    };

    goalForm.addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("goalTitle").value;
      const desc = document.getElementById("goalDesc").value;

      user.goals.push({ title, desc, completed: false });
      localStorage.setItem("user", JSON.stringify(user));
      goalForm.reset();
      updateGoals();
    });

    window.completeGoal = index => {
      user.goals[index].completed = true;
      localStorage.setItem("user", JSON.stringify(user));
      updateGoals();
    };

    window.undoGoal = index => {
      user.goals[index].completed = false;
      localStorage.setItem("user", JSON.stringify(user));
      updateGoals();
    };

    window.deleteGoal = index => {
      user.goals.splice(index, 1);
      localStorage.setItem("user", JSON.stringify(user));
      updateGoals();
    };

    window.logoutUser = () => {
      localStorage.removeItem("loggedIn");
      alert("Logged out successfully!");
      window.location.href = "index.html";
    };

    updateGoals();
  }
});
