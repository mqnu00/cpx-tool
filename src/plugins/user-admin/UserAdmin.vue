<template>
  <div class="user-admin-plugin">
    <div class="section-header">
      <h3>User Management</h3>
      <p>Manage user permissions and access levels</p>
    </div>

    <div class="users-section">
      <h4>Current User</h4>
      <div class="user-card">
        <div class="user-info">
          <div class="user-name">{{ currentUser.name }}</div>
          <div class="user-role">Role: <span class="role-badge" :class="currentUser.role">{{ currentUser.role }}</span></div>
        </div>
        <div class="user-actions">
          <button @click="switchRole" class="btn-switch-role">
            {{ isAdmin ? 'Switch to User' : 'Switch to Admin' }}
          </button>
        </div>
      </div>
    </div>

    <div class="roles-section">
      <h4>Available Roles</h4>
      <div class="role-list">
        <div class="role-item">
          <div class="role-name">Admin</div>
          <ul>
            <li>Manage plugins</li>
            <li>Manage users</li>
            <li>View system logs</li>
            <li>Configure settings</li>
          </ul>
        </div>
        <div class="role-item">
          <div class="role-name">User</div>
          <ul>
            <li>Use enabled tools</li>
            <li>View personal settings</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const currentUser = computed(() => userStore.currentUser!)
const isAdmin = computed(() => userStore.isAdmin)

const switchRole = () => {
  if (isAdmin.value) {
    userStore.logout()
  } else {
    userStore.login({
      id: '1',
      name: 'Admin',
      role: 'admin'
    })
  }
}
</script>

<style scoped>
.user-admin-plugin {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
}

.section-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.users-section h4,
.roles-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 14px;
  color: #666;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
}

.role-badge.admin {
  background-color: #667eea;
  color: white;
}

.role-badge.user {
  background-color: #48bb78;
  color: white;
}

.user-actions {
  display: flex;
  gap: 12px;
}

.btn-switch-role {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-switch-role:hover {
  background-color: #764ba2;
}

.role-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.role-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.role-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.role-item ul {
  margin: 0;
  padding-left: 20px;
  list-style: disc;
}

.role-item li {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}
</style>
