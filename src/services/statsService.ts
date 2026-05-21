import { collection, getDocs, query, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const statsService = {
  async getGlobalStats() {
    try {
      const [countSnapshot, recentSnapshot] = await Promise.all([
        getCountFromServer(collection(db, 'brands')),
        getDocs(query(collection(db, 'brands'), orderBy('createdAt', 'desc'), limit(5))),
      ]);

      const totalBrands = countSnapshot.data().count;
      const recentActivity = recentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.identity?.name || 'Untitled',
          timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        };
      });

      const userIds = new Set<string>();
      recentSnapshot.docs.forEach(doc => {
        const uid = doc.data().userId;
        if (uid) userIds.add(uid);
      });

      return {
        totalBrands,
        activeUsers: userIds.size,
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
