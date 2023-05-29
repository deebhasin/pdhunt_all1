class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status || 401;
    this.isOperational = true;
  }

  toString() {
    return `${this.message}`;
  }
}
module.exports = AuthError;
