module.exports = async function(cookieObject) {
    // Example validation logic
    for (const [key, value] of Object.entries(cookieObject)) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Invalid cookie: ${key}`);
      }
    }
};