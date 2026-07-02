import bcrypt from "bcrypt";

const encrypt = async (text) => await bcrypt.hash(text, await bcrypt.genSalt(10))

export {
    encrypt,
}