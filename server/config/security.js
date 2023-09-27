import bcrypt from "bcrypt"
const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

export async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }
}
