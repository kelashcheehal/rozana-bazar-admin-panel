"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";

export default function AllUsers() {
  const { user, isLoaded } = useUser(); // Clerk user
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1️⃣ Sync current user to Supabase
  useEffect(() => {
    if (!isLoaded || !user) return;

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    const syncUser = async () => {
      try {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("user_email", email)
          .single();

        if (!existingUser) {
          // Insert new user
          const { error: insertError } = await supabase.from("users").insert([
            {
              user_firstname: user.firstName || "",
              user_lastname: user.lastName || "",
              user_email: email,
              user_role: "user",
              total_orders: 0,
              total_spent: 0,
            },
          ]);

          if (insertError) {
            console.error("Error inserting user:", insertError.message);
          }
        }
      } catch (err) {
        console.error("Error syncing user:", err);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  // 2️⃣ Fetch all users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 3️⃣ Render
  if (!isLoaded) return <p>Loading user...</p>;
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">
                {u.user_firstname} {u.user_lastname}
              </td>
              <td className="border px-4 py-2">{u.user_email}</td>
              <td className="border px-4 py-2">{u.user_role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
