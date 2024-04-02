export const addBurger = async (burgerData) => {
  try {
    const response = await fetch("/api/product/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(burgerData),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
