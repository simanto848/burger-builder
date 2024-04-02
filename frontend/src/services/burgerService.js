export const fetchBurgers = async () => {
  try {
    const res = await fetch("/api/product");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw new Error("Failed to fetch burgers!");
  }
};
