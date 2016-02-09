const _ = require('lodash'),
      validator = require('swagger-model-validator');

function ModelValidationError(model, errors) {
    this.name = 'ModelValidationError';
    this.message = 'ModelValidationError';
    this.body = {
        error: 'Response Validation Failed',
        error_name: 'RESPONSE_VALIDATION_FAILED',
        details: [{
            model: model,
            errors: errors
        }]
    };
}

// Creates middleware to handle model validation.
function createMiddleware(spec) {
    // Add a validateModel function to spec.
    validator(spec);
    return function*(next) {

        // Add a function to the context for model validation.
        this.fleek.validateModel = function(modelName, obj) {
            validation = spec.validateModel(modelName, obj);
            if (validation.valid) {
                return obj;
            } else {
                throw new ModelValidationError(
                    modelName, validation.GetErrorMessages()
                );
            }
        };

        // Run the next middleware, and catch any model validation errors.
        try {
            yield next;
        } catch (error) {
            if (error instanceof ModelValidationError) {
                this.status = 500;
                this.body = error.body;
            } else {
                throw error;
            }
        }
    };
}

module.exports = createMiddleware;
