const _ = require('lodash'),
      addValidator = require('swagger-model-validator');

function ModelValidationError(model, errors) {
    this.name = 'ModelValidationError';
    this.message = 'ModelValidationError';
    this.status = 500;
    this.body = {
        error: 'Response Validation Failed',
        error_name: 'RESPONSE_VALIDATION_FAILED',
        details: [{
            model: model,
            errors: errors
        }]
    };
}

// Creates a model validation function for a spec.
function createModelValidator(spec) {
    // Add a validateModel function to the spec.
    // Unfortunately, swagger-model-validator works this way.
    addValidator(spec);

    // Validates and returns a model, or throws a validation error.
    return function(modelName, obj) {
        if (spec.definitions[modelName] === undefined) {
            throw new ModelValidationError(
                modelName, ['model not found in definitions']
            );
        }
        const validation = spec.validateModel(modelName, obj);
        if (validation.valid) {
            return obj;
        } else {
            throw new ModelValidationError(
                modelName, validation.GetErrorMessages()
            );
        }
    };
}

// Creates middleware to handle model validation.
function createMiddleware(spec) {
    const validateModel = createModelValidator(spec);
    return function*(next) {
        // Add the validation function to the context for controllers.
        this.fleek.validateModel = validateModel

        // Run the next middleware, and catch any model validation errors.
        try {
            yield next;
        } catch (error) {
            if (error instanceof ModelValidationError) {
                this.status = error.status;
                this.body = error.body;
            } else {
                throw error;
            }
        }
    };
}

module.exports = createMiddleware;
