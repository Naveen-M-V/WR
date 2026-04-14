// Session Manager for tracking connected users and their sessions

class SessionManager {
  constructor() {
    this.sessions = new Map(); // Map of userId -> Set of socketIds
    this.userSockets = new Map(); // Map of socketId -> { userId, email, username, role }
    this.connectedClients = new Map(); // Map of socketId -> client info
  }

  // Register a new session
  registerSession(socketId, user) {
    if (user?.userId) {
      if (!this.sessions.has(user.userId)) {
        this.sessions.set(user.userId, new Set());
      }
      this.sessions.get(user.userId).add(socketId);
    }
    this.userSockets.set(socketId, user || { socketId });
    this.connectedClients.set(socketId, {
      socketId,
      user,
      connectedAt: new Date(),
    });
  }

  // Remove a session
  removeSession(socketId) {
    const user = this.userSockets.get(socketId);
    if (user?.userId) {
      const userSet = this.sessions.get(user.userId);
      if (userSet) {
        userSet.delete(socketId);
        if (userSet.size === 0) {
          this.sessions.delete(user.userId);
        }
      }
    }
    this.userSockets.delete(socketId);
    this.connectedClients.delete(socketId);
  }

  // Get all sockets for a user
  getUserSockets(userId) {
    return Array.from(this.sessions.get(userId) || new Set());
  }

  // Get all connected clients
  getAllConnectedClients() {
    return Array.from(this.connectedClients.values());
  }

  // Get user info from socket
  getUserInfo(socketId) {
    return this.userSockets.get(socketId);
  }

  // Check if user is an admin
  isUserAdmin(socketId) {
    const user = this.userSockets.get(socketId);
    return user?.role === 'admin';
  }

  // Get connection count
  getConnectionCount() {
    return this.userSockets.size;
  }

  // Get admin count
  getAdminCount() {
    return Array.from(this.userSockets.values()).filter(u => u?.role === 'admin').length;
  }

  // Log session info
  logSessionInfo() {
    console.log('[SessionManager]', {
      totalConnections: this.userSockets.size,
      uniqueUsers: this.sessions.size,
      adminCount: this.getAdminCount(),
    });
  }
}

export default new SessionManager();
