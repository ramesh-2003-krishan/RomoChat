class OnlineUserService {
    constructor() {
        
        this.onlineUsers = new Map();
    }

    addUser(userId, socketId) {
        if (!this.onlineUsers.has(userId)) {
            this.onlineUsers.set(userId, new Set());
        }

        this.onlineUsers.get(userId).add(socketId);
    }

    removeUser(userId, socketId) {
        if (!this.onlineUsers.has(userId)) {
            return;
        }

        const sockets = this.onlineUsers.get(userId);

        sockets.delete(socketId);

        if (sockets.size === 0) {
            this.onlineUsers.delete(userId);
        }
    }

    getUserSockets(userId) {
        return this.onlineUsers.get(userId) || new Set();
    }

    isUserOnline(userId) {
        return this.onlineUsers.has(userId);
    }

    getOnlineUsers() {
        return [...this.onlineUsers.keys()];
    }
}

export default new OnlineUserService();