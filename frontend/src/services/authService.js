export async function login(credentials) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function register(user) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export const handleLogout = async () => {
  try {
    localStorage.clear();

    const res = await fetch(`/api/auth/logout`, {
      method: "GET",
    });
    if (res.ok) {
      return { success: true };
    } else {
      throw new Error("Failed to logout");
    }
  } catch (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
};
