export default class HTTPResponse {
    constructor({ status, data, headers, timeout }) {
        this.status = status
        this.data = data
        this.headers = headers
        this.timeout = timeout
    }
}