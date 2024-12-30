import { AppDataSource } from "@repo/db";
import { User } from "@repo/db";

export class UserRepository {
  async findByEmail(email: string) {
    try{
      return AppDataSource.getRepository(User).findOneBy({ email: email });
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
    // try {
      return AppDataSource.getRepository(User).save(user); 
    // }
    // catch(error) {
    //   console.log("Error: ", error);
    // }
  }
}
