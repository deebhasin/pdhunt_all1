class AuthError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.status = 401;
    this.isOperational = true;
  }

  toString() {
    return `${this.message}`;
  }
}
module.exports = AuthError;
