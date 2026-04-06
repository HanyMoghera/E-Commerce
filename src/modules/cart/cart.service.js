import { Cart } from "../../database/models/cart.model.js";
import { Product } from "../../database/models/product.model.js";

// helper
const calcTotal = (cart) => {
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
};

// add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity;

      if (newQty > product.stock) {
        return res.status(400).json({ message: "Exceeds stock" });
      }

      cart.items[itemIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    calcTotal(cart);

    await cart.save();

    res.json({ message: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Exceeds stock" });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;

    calcTotal(cart);
    await cart.save();

    res.json({ message: "Updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove item
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    calcTotal(cart);

    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.json({ message: "Cart already empty" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
