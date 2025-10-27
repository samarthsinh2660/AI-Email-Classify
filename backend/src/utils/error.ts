/**
 * Custom Error Classes
 * Provides standardized error handling with HTTP status codes
 */

export class RequestError extends Error {
    code: number;
    statusCode: number;
    
    constructor(message: string, code: number, statusCode: number) {
        super(message);
        this.name = 'RequestError';
        this.code = code;
        this.statusCode = statusCode;
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError);
        }
    }
}


/*
HTTP Status Codes Reference:
200 OK - Response to a successful GET, PUT, PATCH or DELETE
201 Created - Response to a POST that results in a creation
204 No Content - Response to a successful request that won't be returning a body
304 Not Modified - Used when HTTP caching headers are in play
400 Bad Request - The request is malformed, such as if the body does not parse
401 Unauthorized - When no or invalid authentication details are provided
403 Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
404 Not Found - When a non-existent resource is requested
405 Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
410 Gone - Indicates that the resource at this end point is no longer available
415 Unsupported Media Type - If incorrect content type was provided as part of the request
422 Unprocessable Entity - Used for validation errors
429 Too Many Requests - When a request is rejected due to rate limiting
500 Internal Server Error - This is either a system or application error
503 Service Unavailable - The server is unable to handle the request for a service due to temporary maintenance
*/


/*
Error Code Convention:
- 1xxxx: Common/General errors
- 2xxxx: Authentication & Authorization errors  
- 3xxxx: Email management errors
- 4xxxx: Gmail API errors
- 5xxxx: Classification errors
*/


export const ERRORS = {
    // Common Errors (1xxxx)
    DATABASE_ERROR: new RequestError("Database operation failed", 10001, 500),
    INVALID_REQUEST_BODY: new RequestError("Invalid request body", 10002, 400),
    INVALID_QUERY_PARAMETER: new RequestError("Invalid query parameters", 10003, 400),
    UNHANDLED_ERROR: new RequestError("An unexpected error occurred", 10004, 500),
    INTERNAL_SERVER_ERROR: new RequestError("Internal server error", 10005, 500),
    FILE_NOT_FOUND: new RequestError("File not found", 10006, 404),
    INVALID_PARAMS: new RequestError("Invalid parameters", 10007, 400),
    VALIDATION_ERROR: new RequestError("Validation failed", 10008, 422),
    RESOURCE_NOT_FOUND: new RequestError("Resource not found", 10009, 404),
    DUPLICATE_RESOURCE: new RequestError("Resource already exists", 10010, 409),
    RESOURCE_ALREADY_EXISTS: new RequestError("Resource already exists", 10010, 409),
    RESOURCE_IN_USE: new RequestError("Resource is in use and cannot be deleted", 10011, 400),
    
    // Authentication & Authorization Errors (2xxxx)
    NO_TOKEN_PROVIDED: new RequestError("No authentication token provided", 20001, 401),
    INVALID_AUTH_TOKEN: new RequestError("Invalid authentication token", 20002, 401),
    TOKEN_EXPIRED: new RequestError("Authentication token has expired", 20003, 401),
    INVALID_CREDENTIALS: new RequestError("Invalid credentials", 20004, 401),
    UNAUTHORIZED_ACCESS: new RequestError("Unauthorized access", 20005, 403),
    INVALID_REFRESH_TOKEN: new RequestError("Invalid refresh token", 20006, 401),
    
    // Email Management Errors (3xxxx)
    EMAIL_FETCH_FAILED: new RequestError("Failed to fetch emails from Gmail", 30001, 500),
    EMAIL_PARSE_FAILED: new RequestError("Failed to parse email content", 30002, 500),
    INVALID_EMAIL_LIMIT: new RequestError("Invalid email limit. Must be between 1 and 50", 30003, 400),
    NO_EMAILS_FOUND: new RequestError("No emails found", 30004, 404),
    
    // Gmail API Errors (4xxxx)
    GMAIL_API_ERROR: new RequestError("Gmail API error occurred", 40001, 500),
    GMAIL_AUTHENTICATION_FAILED: new RequestError("Gmail authentication failed", 40002, 401),
    GMAIL_QUOTA_EXCEEDED: new RequestError("Gmail API quota exceeded", 40003, 429),
    INVALID_OAUTH_CODE: new RequestError("Invalid OAuth authorization code", 40004, 400),
    OAUTH_TOKEN_EXCHANGE_FAILED: new RequestError("Failed to exchange OAuth code for tokens", 40005, 500),
    
    // Classification Errors (5xxxx)
    CLASSIFICATION_FAILED: new RequestError("Email classification failed", 50001, 500),
    OPENAI_API_ERROR: new RequestError("OpenAI API error occurred", 50002, 500),
    INVALID_OPENAI_KEY: new RequestError("Invalid or missing OpenAI API key", 50003, 400),
    CLASSIFICATION_TIMEOUT: new RequestError("Classification request timed out", 50004, 504),
    INVALID_EMAIL_DATA: new RequestError("Invalid email data for classification", 50005, 400),
    INVALID_GEMINI_KEY: new RequestError("Invalid or missing Gemini API key", 50006, 400),
    GEMINI_API_ERROR: new RequestError("Gemini API error occurred", 50007, 500),
    OPENAI_RATE_LIMIT: new RequestError("OpenAI rate limit exceeded. Please try again later.", 50008, 429),
    GEMINI_RATE_LIMIT: new RequestError("Gemini rate limit exceeded. Please try again later.", 50009, 429),
    OPENAI_KEY_TYPE_MISMATCH: new RequestError("You're using a Gemini API key with OpenAI. Please use a valid OpenAI API key.", 50010, 400),
    GEMINI_KEY_TYPE_MISMATCH: new RequestError("You're using an OpenAI API key with Gemini. Please use a valid Gemini API key (starts with 'AIzaSy').", 50011, 400),
};
