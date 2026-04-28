import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const statsService = {
  async getGlobalStats() {
    try {
      const brandsSnapshot = await getDocs(collection(db, 'brands'));
      const totalBrands = brandsSnapshot.size;
      
      // Calculate active users (unique userIds in brands)
      const userIds = new Set();
      brandsSnapshot.forEach(doc => userIds.add(doc.data().userId));
      const activeUsers = userIds.size;

      // Get recent activity
      const recentQuery = query(collection(db, 'brands'), orderBy('createdAt', 'desc'), limit(5));
      const recentSnapshot = await getDocs(recentQuery);
      const recentActivity = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().identity.name,
        timestamp: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      }));

      return {
        totalBrands,
        activeUsers,
        recentActivity,
        systemStatus: 'Optimal',
        uptime: '99.98%'
      };
    } catch (error) {
      console.error('Stats fetch failed:', error);
      return null;
    }
  }
};
