import { config } from "dotenv";

export default class ConfigService {
    constructor() {
        const { parsed, error } = config();

        if (error) {
            throw new Error('File .env not found');
        }

        if (!parsed) {
            throw new Error('File .env is empty');
        }

        this.config = parsed;
    }

    get(key) {
        const value = this.config[key];

        if (!value) {
            throw new Error(`Key "${key}" not found`);
        }

        return value;
    }
}