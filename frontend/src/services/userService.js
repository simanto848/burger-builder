export const getUserOrders = async () => {
  try {
    const response = await fetch("/api/user/orders");

    if (!response.ok) {
      throw new Error("Failed to fetch user orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("User orders error:", error.message);
    throw error;
  }
};
