try {
  const app = require('../backend/server');
  module.exports = app;
} catch (error) {
  module.exports = (req, res) => {
    res.status(500).json({
      error: "Backend Startup Failed",
      details: error.message
    });
  };
}
