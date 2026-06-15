import { describe, beforeEach, expect, test, jest } from '@jest/globals';

jest.unstable_mockModule('dotenv', () => ({
    config: jest.fn(),
}))

const { config } = await import('dotenv');
const { default: ConfigService } = await import("../../../src/config/config.service.js");

describe('Config service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('load env should throw an error when .env file is not found', () => {
        config.mockReturnValue({
            parsed: undefined,
            error: new Error('not found'),
        });

        expect(() => new ConfigService()).toThrow('File .env not found')
    })

    test('load env should return an empty configuration when .env file is empty', () => {
        config.mockReturnValue({
            parsed: undefined,
            error: undefined,
        });

        expect(() => new ConfigService()).toThrow('File .env is empty')
    })

    test('get value should return undefined when the key is not found', () => {
        config.mockReturnValue({
            parsed: { },
            error: undefined,
        });

        const key = 'test_key'
        const service = new ConfigService()

        expect(() => service.get(key)).toThrow(`Key "${key}" not found`)
    })

    test('load env should create ConfigService instance when .env file is found', () => {
        config.mockReturnValue({
            parsed: { PORT: '3000' },
            error: undefined,
        });

        const service = new ConfigService()

        expect(service).toBeInstanceOf(ConfigService);
        expect(service.config).toEqual({ PORT: '3000' });
    })

    test('get value should return the value when the key exists', () => {
        config.mockReturnValue({
            parsed: { PORT: '3000' },
            error: undefined,
        });

        const service = new ConfigService();

        expect(service.get('PORT')).toBe('3000');
    })

    test('get should return the last value when duplicate keys exist in the .env file', () => {
        config.mockReturnValue({
            parsed: { PORT: '3000', PORT: '4000' },
            error: undefined,
        });

        const service = new ConfigService();

        expect(service.get('PORT')).toBe('4000');
    })
})
