export default class ResponseErrorLogger {
    constructor(data) {
        this.type = 'RESPONSE'
        this.status = `${data.response.status} ${data.response.statusText}`
        this.url = `${data.config.baseURL}${data.config.url}`
        this.duration = data.response.config.metadata.duration
        this.headers = data.response.headers
        this.data = data.response.data
    }
}