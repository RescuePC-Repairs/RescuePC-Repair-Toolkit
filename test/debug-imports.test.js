const { detectBot, getBotScore } = require('../utils/botDetection');

describe('Debug Imports', () => {
  it('should import detectBot function', () => {
    console.log('detectBot type:', typeof detectBot);
    console.log('detectBot:', detectBot);
    expect(typeof detectBot).toBe('function');
  });

  it('should import getBotScore function', () => {
    console.log('getBotScore type:', typeof getBotScore);
    console.log('getBotScore:', getBotScore);
    expect(typeof getBotScore).toBe('function');
  });
}); 