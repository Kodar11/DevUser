'use client';

import { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/lib/redux/features/users/usersApiSlice";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const UsersCrud = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    if (users) {
      setFetchedUsers(users); // Redux-sourced users
    }
  }, [users]);

  const handleCreateUser = async () => {
    if (!name || !email || !password) return;
    try {
      await createUser({ name, email, password }).unwrap();
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      console.log("User deleted successfully.");
    } catch (error) {
      if(error instanceof Error){
        console.error("Error deleting user:", error.message);
      }
    }
  };
  

  const handleUpdateUser = async () => {
    if (!editUser || !editUser.name || !editUser.email || !editUser.password) return;
    try {
      await updateUser(editUser).unwrap();
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading users.</p>}
      {fetchedUsers.length > 0 ? (
        <div className="space-y-2 mb-6">
          {fetchedUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded-md bg-gray-50 shadow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <button
                onClick={() => setEditUser(user)}
                className="mt-2 px-4 py-1 bg-yellow-400 text-white rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="mt-2 ml-2 px-4 py-1 bg-red-600 text-white rounded-md"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create User"}
        </button>

        {editUser && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded-md"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded-md"
              value={editUser.password}
              onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
            />
            <button
              onClick={handleUpdateUser}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update User"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
