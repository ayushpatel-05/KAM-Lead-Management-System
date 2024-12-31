import { AppDataSource } from "@repo/db";
import { User } from "@repo/db";

export class UserRepository {
  async findByEmailLogin(email: string) {
    try{
      return AppDataSource.getRepository(User).createQueryBuilder('user')
      .addSelect('user.password') // Include the password field
      .where('user.email = :email', { email })
      .getOne();
    }
    catch(error) {
      console.log("Error: ", error);
    }
  }

  async findById(id: string) {
    return AppDataSource.getRepository(User).findOneBy({id: id});
  }

  async create(userData: Partial<User>) {
    return AppDataSource.getRepository(User).create(userData);
  }

  async save(user: User): Promise<User> {
      return AppDataSource.getRepository(User).save(user); 
  }
}
