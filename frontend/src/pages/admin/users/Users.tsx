import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { Button } from "@/components/ui/TableButton";
import { Input } from "@/components/ui/Input";
import { MoreHorizontal, Search, UserPlus, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useDarkMode } from "@/contexts/DarkModeContext";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode } = useDarkMode();

  // Static user data - this will be replaced with API calls later
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2025-03-08T15:30:45",
      subscriptionPlan: "Premium",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Editor",
      status: "Active",
      lastLogin: "2025-03-07T10:15:22",
      subscriptionPlan: "Basic",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Viewer",
      status: "Inactive",
      lastLogin: "2025-02-28T09:45:11",
      subscriptionPlan: "Free",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Editor",
      status: "Active",
      lastLogin: "2025-03-09T08:20:33",
      subscriptionPlan: "Premium",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      role: "Viewer",
      status: "Pending",
      lastLogin: null,
      subscriptionPlan: "Basic",
    },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get styling for user roles
  const getRoleBadgeStyle = (role) => {
    if (isDarkMode) {
      switch (role) {
        case "Admin":
          return "bg-blue-900 text-blue-200 font-medium";
        case "Editor":
          return "bg-indigo-900 text-indigo-200 font-medium";
        case "Viewer":
          return "bg-sky-900 text-sky-200 font-medium";
        default:
          return "bg-slate-800 text-slate-200 font-medium";
      }
    } else {
      switch (role) {
        case "Admin":
          return "bg-blue-100 text-blue-800 font-medium";
        case "Editor":
          return "bg-indigo-100 text-indigo-800 font-medium";
        case "Viewer":
          return "bg-sky-100 text-sky-800 font-medium";
        default:
          return "bg-slate-100 text-slate-800 font-medium";
      }
    }
  };

  // Status badge color mapper
  const getStatusColor = (status) => {
    if (isDarkMode) {
      switch (status) {
        case "Active":
          return "bg-green-900 text-green-300";
        case "Inactive":
          return "bg-red-900 text-red-300";
        case "Pending":
          return "bg-yellow-900 text-yellow-300";
        default:
          return "bg-gray-800 text-gray-300";
      }
    } else {
      switch (status) {
        case "Active":
          return "bg-green-100 text-green-800";
        case "Inactive":
          return "bg-red-100 text-red-800";
        case "Pending":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  // Get plan badge style
  const getPlanBadgeStyle = (plan) => {
    if (isDarkMode) {
      switch (plan) {
        case "Premium":
          return "bg-blue-900/50 text-blue-200 font-medium border border-blue-700";
        case "Basic":
          return "bg-slate-800/40 text-slate-300 font-medium border border-slate-700";
        case "Free":
          return "bg-slate-800/30 text-slate-400 font-medium border border-slate-700";
        default:
          return "bg-slate-800 text-slate-300 font-medium border border-slate-700";
      }
    } else {
      switch (plan) {
        case "Premium":
          return "bg-blue-50 text-blue-800 font-medium border border-blue-200";
        case "Basic":
          return "bg-slate-50 text-slate-700 font-medium border border-slate-200";
        case "Free":
          return "bg-slate-50 text-slate-600 font-medium border border-slate-200";
        default:
          return "bg-slate-50 text-slate-800 font-medium border border-slate-200";
      }
    }
  };

  return (
    <div className={`space-y-6 p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-slate-900"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className={`mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Manage your team members and their account permissions.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search
            className={`absolute left-3 top-3 h-4 w-4 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <Input
            className={`pl-10 w-full rounded-md border ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 focus:border-blue-700 text-white placeholder-slate-400" 
                : "bg-white border-slate-200 focus:border-blue-500 text-slate-900 placeholder-slate-400"
            }`}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        className={`rounded-lg border overflow-hidden shadow-sm ${
          isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        }`}
      >
        <Table>
          <TableHeader className={isDarkMode ? "bg-gray-800" : "bg-slate-50"}>
            <TableRow className={isDarkMode ? "border-slate-900" : "border-slate-200"}>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Login</TableHead>
              <TableHead className="font-semibold">Plan</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className={`${
                    isDarkMode 
                      ? "border-slate-800 hover:bg-slate-800/50" 
                      : "border-slate-100 hover:bg-slate-50"
                  } transition-colors`}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className={isDarkMode ? "text-slate-300" : "text-slate-600"}>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={`px-2 py-1 rounded-md text-xs ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
                    {formatDate(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`px-2 py-1 rounded-md text-xs ${getPlanBadgeStyle(user.subscriptionPlan)}`}>
                      {user.subscriptionPlan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className={`h-8 w-8 p-0 rounded-full ${
                            isDarkMode 
                              ? "hover:bg-slate-800" 
                              : "hover:bg-slate-100"
                          }`}
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className={`h-4 w-4 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end"
                        className={isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}
                      >
                        <DropdownMenuLabel className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className={isDarkMode ? "bg-slate-800" : "bg-slate-100"} />
                        <DropdownMenuItem className={isDarkMode ? "text-slate-300 focus:bg-slate-800" : "text-slate-700 focus:bg-slate-50"}>
                          Edit user
                        </DropdownMenuItem>
                        <DropdownMenuItem className={isDarkMode ? "text-slate-300 focus:bg-slate-800" : "text-slate-700 focus:bg-slate-50"}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem className={isDarkMode ? "text-slate-300 focus:bg-slate-800" : "text-slate-700 focus:bg-slate-50"}>
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className={isDarkMode ? "bg-slate-800" : "bg-slate-100"} />
                        <DropdownMenuItem className={`${isDarkMode ? "text-red-400 focus:bg-slate-800" : "text-red-600 focus:bg-slate-50"}`}>
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className={`text-center py-12 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search size={24} className={isDarkMode ? "text-slate-600" : "text-slate-400"} />
                    <p>No users found matching your search criteria</p>
                    <Button 
                      variant="link" 
                      className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"} text-center`}>
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default Users;