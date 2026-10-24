import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";

function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      fullName: user?.fullName || "",

      username: user?.username || "",

      email: user?.email || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateProfile({
        fullName: form.fullName.trim(),

        username: form.username.trim().toLowerCase(),

        email: form.email.trim().toLowerCase(),
      });

      toast.success("Profile updated");
    } catch (error) {
      setError(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Profile</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
        </label>

        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <section>
        <p>
          Joined:{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-IN")
            : "Not available"}
        </p>

        <p>
          Last login:{" "}
          {user?.lastLoginAt
            ? new Date(user.lastLoginAt).toLocaleString("en-IN")
            : "Not available"}
        </p>
      </section>
    </div>
  );
}
export default Profile;
