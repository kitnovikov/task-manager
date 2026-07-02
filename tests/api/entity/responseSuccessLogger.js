export default class ResponseSuccessLogger {
    constructor(data) {
        this.type = 'RESPONSE'
        this.status = `${data.status} ${data.statusText}`
        this.url = `${data.config.baseURL}${data.config.url}`
        this.duration = data.config.metadata.duration
        this.headers = data.headers
        this.data = data.data
    }
}