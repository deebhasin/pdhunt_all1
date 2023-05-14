class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.status = 400;
    this.isOperational = true;
  }

  toString() {
    return `${this.message}`;
  }
}

module.exports = ValidationError;
