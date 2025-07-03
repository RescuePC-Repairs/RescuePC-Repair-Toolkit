module.exports = new Proxy(
  {},
  {
    get: function getter(target, key) {
      // Return the property name as the value for any requested property
      return key;
    }
  }
);
