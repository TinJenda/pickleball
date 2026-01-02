import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { comparePassword } from '@/utils/passwordHash';

export interface AuthService {
  login(username: string, password: string): Promise<boolean>;
}

class FirestoreAuthService implements AuthService {
  private collectionName = 'users';

  async login(username: string, password: string): Promise<boolean> {
    try {
      const usersRef = collection(db, this.collectionName);
      const q = query(
        usersRef,
        where('username', '==', username)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const hashedPassword = userData.password;
        
        const isPasswordValid = await comparePassword(password, hashedPassword);
        
        if (isPasswordValid) {
          console.log('Login successful');
          return true;
        }
      }
      
      console.log('Login failed: Invalid credentials');
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }
}

export const authService: AuthService = new FirestoreAuthService();
