import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Pool } from "pg";

export default class PrismaAdapter {
    constructor(config, logger) {
        this.logger = logger
        const connectionString = config.get('DATABASE_URL')
        
        this.pool = new Pool({connectionString})
        this.adapter = new PrismaPg(this.pool)
        this.client = new PrismaClient({ adapter: this.adapter })
    }
}