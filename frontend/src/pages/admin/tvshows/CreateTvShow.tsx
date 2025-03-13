import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTvShow } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const CreateTvShow = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    first_air_date: "",
    poster_path: null,
    backdrop_path: null,
    genre_ids: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in.");
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append each field explicitly
    data.append("name", formData.name);
    data.append("overview", formData.overview);
    data.append("first_air_date", formData.first_air_date);

    // Ensure genre_ids is sent as an array of numbers
    if (formData.genre_ids && Array.isArray(formData.genre_ids)) {
      formData.genre_ids.forEach((genreId) => {
        data.append("genre_ids", genreId);
      });
    }

    if (formData.poster_path) {
      data.append("poster_path", formData.poster_path);
    }

    if (formData.backdrop_path) {
      data.append("backdrop_path", formData.backdrop_path);
    }

    try {
      const response = await createTvShow(data);
      navigate(`/tvshows/${response.id}`);
    } catch (err) {
      setError(err.message || "Failed to create TV show");
    }
  };

  const handleLogin = () => {
    navigate("/login", { state: { returnUrl: "/create-tvshow" } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New TV Show</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="mb-4">
          <p className="mb-4">You need to be logged in to create a TV show.</p>
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Overview
            </label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded h-32"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Air Date
            </label>
            <input
              type="date"
              name="first_air_date"
              value={formData.first_air_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Poster Image
            </label>
            <input
              type="file"
              name="poster_path"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Backdrop Image
            </label>
            <input
              type="file"
              name="backdrop_path"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Creating..." : "Create TV Show"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateTvShow;