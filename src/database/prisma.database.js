import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Pool } from "pg";

export default class PrismaDatabase {
    constructor(config, logger) {
        this.logger = logger // .setModule(this.constructor.name)
        const connectionString = config.get('DATABASE_URL')
        
        this.pool = new Pool({connectionString})
        this.adapter = new PrismaPg(this.pool)
        try {
            this.client = new PrismaClient({
                adapter: this.adapter,
                log: [
                    { emit: "event", level: "query" },
                    { emit: "stdout", level: "error" },
                    { emit: "stdout", level: "info" },
                    { emit: "stdout", level: "warn" },
                ]
            })
        } catch (error) {
            this.logger.fatal('Database error', {
                err: error
            })
        }

        this.client.$on('query', (event) => {
            this.logger.debug('Database query', {
                query: event.query,
                params: event.params,
                duration: event.duration,
                service: 'prisma-database'
            })
        })

        this.client.$on('error', (event) => {
            this.logger.error('Database error', { error: event });
        })

        this.client.$on('warn', (event) => {
            this.logger.warn('Database warning', { error: event });
        })
    }
}