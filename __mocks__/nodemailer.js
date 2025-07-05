const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue({
    messageId: 'test-message-id',
    response: 'OK'
  })
};

const createTransport = jest.fn(() => mockTransporter);

module.exports = createTransport;
module.exports.default = createTransport;
module.exports.createTransport = createTransport;
