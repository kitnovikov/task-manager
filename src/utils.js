import bcrypt from "bcrypt";

const encrypt = async (text) => await bcrypt.hash(text, await bcrypt.genSalt(10))

const removeSpaces = (obj) => {
    const result = {}
    const keys = Object.keys(obj)

    for (const key of keys) {
        const value = obj[key]
        result[key] = typeof value === 'string' ? value.trim() : value
    }

    return result
}

export {
    encrypt,
    removeSpaces,
}