import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";
import { Login, BackendRegister } from "@repo/schemas";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@repo/db";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: Login) {
    const { email, password } = data;
    // Check if the user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // // Generate JWT token
    // const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    //   expiresIn: "1h",
    // });

    return { user };
  }

  async register(data: BackendRegister) {
    const { email, password, firstName, lastName, phone } = data;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed
    debugger;
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

    // // Generate JWT token
    // const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET!, {
    //   expiresIn: "1h",
    // });

    return { user: newUser };
  }

  async setTokenCookie(res: Response, user: User) {
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    //Change the cookie setting for production
    res.cookie('jwt', token, { 
      httpOnly: false, 
      // secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax' 
    });
  }
}
