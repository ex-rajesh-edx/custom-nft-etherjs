/**
 * @extends Error
 */
// @ts-ignore
class ExtendableError extends Error {
    constructor({
        message,
        errors,
        status,
        isPublic,
        stack,
    }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        // @ts-ignore
        this.errors = errors;
        // @ts-ignore
        this.status = status;
        // @ts-ignore
        this.isPublic = isPublic;
        // @ts-ignore
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        this.stack = stack;
        // Error.captureStackTrace(this, this.constructor.name);
    }
}

module.exports = ExtendableError;
