// module.exports = (requiredRole) => {
//   return (req, res, next) => {
//     const userRole = req.user.role;

//     if (userRole !== requiredRole) {
//       return res.status(403).json({ error: 'Access denied: insufficient permissions' });
//     }

//     next();
//   };
// };