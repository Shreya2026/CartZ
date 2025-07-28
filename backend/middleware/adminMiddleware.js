const adminMiddleware = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      })
    }

    // Check if user is admin
    const adminEmail = 'shreyanshisinghal210@gmail.com'
    if (req.user.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      })
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during admin authorization',
      error: error.message
    })
  }
}

export default adminMiddleware
