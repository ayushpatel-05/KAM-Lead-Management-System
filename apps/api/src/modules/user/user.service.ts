import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";
import { LoginPayload, BackendRegisterPayload, UserSchema } from "@repo/schemas";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@repo/schemas";
import { User as UserDB } from "@repo/db";
import { AccessDeniedError, BadRequestError } from "../../utils/api-errors";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginPayload) {
    const { email, password } = data;
    // Check if the user exists
    const user = await this.userRepository.findByEmailLogin(email);
    if (!user) {
      throw new AccessDeniedError("Invalid email or password");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AccessDeniedError("Invalid email or password");
    }

    // // Generate JWT token
    // const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    //   expiresIn: "1h",
    // });

    return { user };
  }

  async register(data: BackendRegisterPayload) {
    const { email, password, firstName, lastName, phone } = data;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmailLogin(email);//TODO: Change it
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed
    // Create new user
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword, // Assuming 'hash' is the column name for storing hashed password
      firstName,
      lastName,
      phone
    });

    // Save the user
    await this.userRepository.save(newUser);
    const sanatizedUser = UserSchema.parse(newUser);
    // // Generate JWT token
    // const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET!, {
    //   expiresIn: "1h",
    // });

    return { user: sanatizedUser };
  }

  async setTokenCookie(res: Response, user: User) {
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    //Change the cookie setting for production
    res.cookie('token', token, { 
      httpOnly: false, 
      // secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax' 
    });
  }

  async getUser(user: UserDB) {
    const sanatizedUser = UserSchema.parse(user);
    return sanatizedUser;
  }
}
