import localforage from 'localforage';

const CACHE_KEYS = {
    IDENTIFICATION_HISTORY: 'identification_history',
    OBJECT_CACHE: 'object_cache',
    COMMUNITY_TIPS: 'community_tips',
    USER_PREFERENCES: 'user_preferences'
};

localforage.config({
    name: 'ObjectWise',
    version: 1.0,
    storeName: 'objectwise_store',
    description: 'ObjectWise offline data storage'
});

export const cacheService = {
    async saveIdentification(object) {
        try {
            const history = await this.getIdentificationHistory();
            const updatedHistory = [
                { ...object, timestamp: new Date().toISOString() },
                ...history.slice(0, 19)
            ];
            await localforage.setItem(CACHE_KEYS.IDENTIFICATION_HISTORY, updatedHistory);
            return updatedHistory;
        } catch (error) {
            console.error('Failed to save identification:', error);
            throw error;
        }
    },

    async getIdentificationHistory() {
        try {
            const history = await localforage.getItem(CACHE_KEYS.IDENTIFICATION_HISTORY);
            return history || [];
        } catch (error) {
            console.error('Failed to get identification history:', error);
            return [];
        }
    },

    async cacheObjectDetails(objectId, details) {
        try {
            const cache = await localforage.getItem(CACHE_KEYS.OBJECT_CACHE) || {};
            cache[objectId] = {
                ...details,
                cachedAt: new Date().toISOString()
            };
            await localforage.setItem(CACHE_KEYS.OBJECT_CACHE, cache);
        } catch (error) {
            console.error('Failed to cache object details:', error);
        }
    },

    async getCachedObjectDetails(objectId) {
        try {
            const cache = await localforage.getItem(CACHE_KEYS.OBJECT_CACHE) || {};
            const cached = cache[objectId];
            
            if (cached) {
                const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
                const maxAge = 24 * 60 * 60 * 1000;
                
                if (cacheAge < maxAge) {
                    return cached;
                }
            }
            return null;
        } catch (error) {
            console.error('Failed to get cached object details:', error);
            return null;
        }
    },

    async saveCommunityTip(tip) {
        try {
            const tips = await localforage.getItem(CACHE_KEYS.COMMUNITY_TIPS) || [];
            const newTip = {
                ...tip,
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            };
            tips.unshift(newTip);
            await localforage.setItem(CACHE_KEYS.COMMUNITY_TIPS, tips.slice(0, 100));
            return newTip;
        } catch (error) {
            console.error('Failed to save community tip:', error);
            throw error;
        }
    },

    async getCommunityTips() {
        try {
            return await localforage.getItem(CACHE_KEYS.COMMUNITY_TIPS) || [];
        } catch (error) {
            console.error('Failed to get community tips:', error);
            return [];
        }
    },

    async saveUserPreferences(preferences) {
        try {
            await localforage.setItem(CACHE_KEYS.USER_PREFERENCES, preferences);
        } catch (error) {
            console.error('Failed to save user preferences:', error);
        }
    },

    async getUserPreferences() {
        try {
            return await localforage.getItem(CACHE_KEYS.USER_PREFERENCES) || {
                language: 'en',
                units: 'metric',
                safetyLevel: 'standard',
                expertMode: false
            };
        } catch (error) {
            console.error('Failed to get user preferences:', error);
            return {};
        }
    },

    async clearCache() {
        try {
            await localforage.clear();
        } catch (error) {
            console.error('Failed to clear cache:', error);
            throw error;
        }
    }
};