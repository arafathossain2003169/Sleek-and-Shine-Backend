const bcrypt = require('bcrypt');
const { User, Order } = require('../models'); // adjust if you have an index.js in models exporting all

// GET /users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Order, as: 'orders', attributes: ['id'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = users.map(u => ({
      id: u.id,
      first_name: u.firstName,
      last_name: u.lastName,
      email: u.email,
      phone: u.phone || "",
      role: u.role || "user",
      is_active: u.isActive,
      name: `${u.firstName} ${u.lastName}`,
      status: u.isActive ? 'Active' : 'Inactive',
      joinDate: u.created_at.toISOString().split('T')[0],
      orders: u.orders.length,
      totalSpent: '$' + (Math.random() * 1000).toFixed(2) // optional: calculate from orders
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Order, as: 'orders', attributes: ['id'] }]
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const formatted = {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role || "user",
      is_active: user.isActive,
      name: `${user.firstName} ${user.lastName}`,
      status: user.isActive ? 'Active' : 'Inactive',
      joinDate: user.created_at.toISOString().split('T')[0],
      orders: user.orders.length,
      totalSpent: '$' + (Math.random() * 1000).toFixed(2)
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, role, is_active } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: first_name,
      lastName: last_name,
      email,
      password: hashed,
      phone,
      role: role || "user",
      isActive: is_active !== undefined ? is_active : true
    });

    const formatted = {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      is_active: user.isActive,
      name: `${user.firstName} ${user.lastName}`,
      status: user.isActive ? 'Active' : 'Inactive',
      joinDate: user.created_at.toISOString().split('T')[0],
      orders: 0,
      totalSpent: '$0.00'
    };

    res.status(201).json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// PATCH /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, role, is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.update({
      firstName: first_name,
      lastName: last_name,
      email,
      phone,
      role,
      isActive: is_active
    });

    const formatted = {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      is_active: user.isActive,
      name: `${user.firstName} ${user.lastName}`,
      status: user.isActive ? 'Active' : 'Inactive',
      joinDate: user.created_at.toISOString().split('T')[0],
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
