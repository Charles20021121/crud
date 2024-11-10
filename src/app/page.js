'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取所有用戶
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      console.error('獲取用戶失敗:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 創建用戶
  const createUser = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setFormData({ name: '', email: '' });
      fetchUsers();
    }
  };

  // 更新用戶
  const updateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/users/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setFormData({ name: '', email: '' });
      setEditingId(null);
      fetchUsers();
    }
  };

  // 刪除用戶
  const deleteUser = async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">用戶管理系統</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          錯誤: {error}
        </div>
      )}
      
      <form onSubmit={editingId ? updateUser : createUser} className="mb-8">
        <input
          type="text"
          placeholder="姓名"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="郵箱"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? '更新' : '創建'}
        </button>
      </form>

      {isLoading ? (
        <div className="text-center">加載中...</div>
      ) : (
        <div className="grid gap-4">
          {users.length === 0 ? (
            <div className="text-center text-gray-500">暫無用戶數據</div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="border p-4 rounded">
                <p>姓名: {user.name}</p>
                <p>郵箱: {user.email}</p>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setEditingId(user._id);
                      setFormData({ name: user.name, email: user.email });
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
