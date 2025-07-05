module.exports = {
  createRateLimit: jest.fn(() => ({
    check: jest.fn().mockResolvedValue(true)
  }))
}; 