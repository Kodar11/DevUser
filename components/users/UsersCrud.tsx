'use client';

import { useState } from "react";
import { useGetUsersQuery, useCreateUserMutation } from "@/lib/redux/features/users/usersApiSlice";

export const UsersCrud = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleCreateUser = async () => {
    if (!name || !email) return;
    await createUser({ name, email });
    setName("");
    setEmail("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading users.</p>}
      {users && (
        <div className="space-y-2 mb-6">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded-md bg-gray-50 shadow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
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
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
};
