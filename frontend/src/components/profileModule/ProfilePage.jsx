"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// ✅ Use environment variable for API
const API = import.meta.env.VITE_API_URL;

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    university: "",
    major: "",
    year: "",
    location: "",
    bio: "",
    website: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const { logout } = useAuth();

  const navigate = useNavigate();

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/api/v1/user/me`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();

      setUser({
        ...data.user,
        eventAttendees: data.user.eventAttendees || [],
        resources: data.user.resources || [],
      });

      setFormData({
        full_name: data.user.full_name || "",
        university: data.user.university || "",
        major: data.user.major || "",
        year: data.user.year || "",
        location: data.user.location || "",
        bio: data.user.bio || "",
        website: data.user.website || "",
        avatar_url: data.user.avatar_url || "",
      });

      setAvatarPreview(data.user.avatar_url || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = formData.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("avatar", avatarFile);

        const uploadRes = await fetch(`${API}/api/v1/user/update`, {
          method: "PUT",
          credentials: "include",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload avatar");

        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.avatarUrl;
      }

      const updateData = { ...formData, avatar_url: avatarUrl };

      const res = await fetch(`${API}/api/v1/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();

      setUser({
        ...data.user,
        eventAttendees: data.user.eventAttendees || [],
        resources: data.user.resources || [],
      });

      setEditing(false);
      setAvatarFile(null);
      alert("Profile updated successfully!");
      navigate("/profilePage");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/dashboard");
  };

  const handleBackToHome = () => navigate("/");

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 group"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatarPreview || user.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-28 h-28 rounded-2xl border-4 border-white shadow-md object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.full_name}</h2>
              <p className="text-gray-600 mb-3">{user.email}</p>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Full Name", name: "full_name", type: "text" },
                  { label: "University", name: "university", type: "text" },
                  { label: "Major", name: "major", type: "text" },
                  { label: "Year", name: "year", type: "text" },
                  { label: "Location", name: "location", type: "text" },
                  { label: "Website", name: "website", type: "url" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                {/* Avatar Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={avatarPreview || user.avatar_url || "/default-avatar.png"}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-lg border-2 border-gray-200 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditing(false);
                    setAvatarFile(null);
                    setAvatarPreview(user.avatar_url || "");
                  }} 
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[ 
                  { label: "University", value: user.university },
                  { label: "Major", value: user.major },
                  { label: "Year", value: user.year },
                  { label: "Location", value: user.location },
                  { label: "Website", value: user.website, isLink: true },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                    <div className="text-gray-900 font-medium">
                      {item.isLink && item.value ? (
                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        item.value || <span className="text-gray-400">Not provided</span>
                      )}
                    </div>
                  </div>
                ))}

                {user.bio && (
                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-2">Bio</div>
                    <div className="text-gray-900 leading-relaxed">{user.bio}</div>
                  </div>
                )}
              </div>

              {/* Participated Events */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Participated Events</h3>
                {(user.eventAttendees || []).length === 0 ? (
                  <p className="text-gray-500">No events participated yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(user.eventAttendees || []).map((ea) => (
                      <div key={ea.event.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{ea.event.title}</h4>
                        <p className="text-gray-500 text-sm">{new Date(ea.event.date).toLocaleDateString()}</p>
                        {ea.event.is_virtual && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-2 inline-block">
                            Virtual
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded Resources */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Uploaded Resources</h3>
                {(user.resources || []).length === 0 ? (
                  <p className="text-gray-500">No resources uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(user.resources || []).map((res) => (
                      <div key={res.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{res.title}</h4>
                        <p className="text-gray-500 text-sm">{res.category}</p>
                        <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-sm mt-2 inline-block">
                          View / Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
