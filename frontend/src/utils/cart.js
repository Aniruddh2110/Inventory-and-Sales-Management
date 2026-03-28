export const getCart = () =>
  JSON.parse(localStorage.getItem("cart")) || [];

export const setCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};
