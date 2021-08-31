class ErrorRoute {
    constructor(error) {
        console.log(error);
        this.message = error.message;
    }

    async go(response) {
        response.statusCode = 500;
        response.setHeader('content-type', 'text/plain');
        response.write(`Error 500: ${this.message}`);
        response.end()
    }
}

module.exports = ErrorRoute;