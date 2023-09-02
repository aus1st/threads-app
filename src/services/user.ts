import { prismaClient } from "../lib/db";

import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
const JWT_SECRET = "$uperM@n@123";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

class UserService {
  public static VerifyJwt(token: string) {
    const user = JWT.verify(token, JWT_SECRET);
    return user;
  }

  private static hashedPassowrd(password: string, salt: string) {
    const hashedPwd = createHmac("sha256", salt).update(password).digest("hex");
    return hashedPwd;
  }

  private static async getUserByEmail(email: string) {
    return await prismaClient.user.findUnique({ where: { email } });
  }
  public static async getUserById(id: string) {
    return await prismaClient.user.findUnique({ where: { id } });
  }

  public static async getUserToken(payload: LoginUserPayload) {
    const { email, password } = payload;

    const user = await this.getUserByEmail(email);

    if (!user) throw new Error("no user found");

    const userSalt = user.salt;
    const hashedPwd = this.hashedPassowrd(password, userSalt);

    if (user.password !== hashedPwd) throw new Error("Inavlid Password");

    //generate token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassowrd = this.hashedPassowrd(password, salt);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassowrd,
      },
    });
  }
}

export default UserService;
