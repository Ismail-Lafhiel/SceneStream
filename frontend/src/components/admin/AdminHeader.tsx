import { useAuth } from "@/contexts/AuthContext";

const AdminHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">{user?.name}</span>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
