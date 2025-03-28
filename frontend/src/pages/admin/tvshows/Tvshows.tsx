//@ts-nocheck
import { useState, useEffect } from "react";
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
import {
  MoreHorizontal,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Trash,
  Pen,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getTvShows, deleteTvShow } from "@/services/TvshowService";
import { Link } from "react-router-dom";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";
import { FaTv } from "react-icons/fa";
import toast from "react-hot-toast";

const TVShows = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [tvShowsPerPage, setTvShowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tvShowToDelete, setTvShowToDelete] = useState(null);

  // Fetch TV shows from API with pagination
  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        setLoading(true);
        const response = await getTvShows({
          page: currentPage,
          limit: tvShowsPerPage,
        });

        // Extract data from the response
        const tvShowData = response.results || [];
        setTvShows(tvShowData);
        setTotalPages(response.total_pages || 1);
        setTotalResults(response.total_results || 0);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch TV shows");
        toast.error(err.message || "Failed to fetch TV shows");
      } finally {
        setLoading(false);
      }
    };

    fetchTvShows();
  }, [currentPage, tvShowsPerPage]);

  // When search query changes, reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter TV shows based on search query
  const filteredTvShows = Array.isArray(tvShows)
    ? tvShows.filter(
        (tvShow) =>
          tvShow.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tvShow.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle delete TV show
  const handleDeleteTvShow = async () => {
    if (!tvShowToDelete) return;

    try {
      await deleteTvShow(tvShowToDelete.id);
      toast.success("TV show deleted successfully!");
      // Refresh the TV shows list
      const response = await getTvShows({
        page: currentPage,
        limit: tvShowsPerPage,
      });
      setTvShows(response.results || []);
      setTotalPages(response.total_pages || 1);
      setTotalResults(response.total_results || 0);
    } catch (err) {
      toast.error(err.message || "Failed to delete TV show");
    } finally {
      setIsDeleteDialogOpen(false);
      setTvShowToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (tvShow) => {
    setTvShowToDelete(tvShow);
    setIsDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get rating badge style based on vote average
  const getRatingBadgeStyle = (rating) => {
    if (isDarkMode) {
      if (rating >= 8) {
        return "bg-green-900 text-green-200 font-medium";
      } else if (rating >= 6) {
        return "bg-yellow-900 text-yellow-200 font-medium";
      } else {
        return "bg-red-900 text-red-200 font-medium";
      }
    } else {
      if (rating >= 8) {
        return "bg-green-100 text-green-800 font-medium";
      } else if (rating >= 6) {
        return "bg-yellow-100 text-yellow-800 font-medium";
      } else {
        return "bg-red-100 text-red-800 font-medium";
      }
    }
  };

  // Truncate overview text to prevent long descriptions
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const pageNumbers = [];

    // Determine the range of page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Ensure we always show 5 page numbers if possible
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    // First page
    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          variant="ghost"
          size="sm"
          className={`w-8 h-8 rounded-md ${
            isDarkMode
              ? "text-slate-400 hover:bg-slate-800"
              : "text-slate-600 hover:bg-slate-100"
          } ${
            currentPage === 1
              ? isDarkMode
                ? "bg-slate-800"
                : "bg-slate-100"
              : ""
          }`}
          onClick={() => paginate(1)}
        >
          1
        </Button>
      );

      // Ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="start-ellipsis"
            className={`px-2 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant="ghost"
          size="sm"
          className={`w-8 h-8 rounded-md ${
            isDarkMode
              ? "text-slate-400 hover:bg-slate-800"
              : "text-slate-600 hover:bg-slate-100"
          } ${
            currentPage === i
              ? isDarkMode
                ? "bg-slate-800"
                : "bg-slate-100"
              : ""
          }`}
          onClick={() => paginate(i)}
        >
          {i}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      // Ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span
            key="end-ellipsis"
            className={`px-2 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            ...
          </span>
        );
      }

      pageNumbers.push(
        <Button
          key={totalPages}
          variant="ghost"
          size="sm"
          className={`w-8 h-8 rounded-md ${
            isDarkMode
              ? "text-slate-400 hover:bg-slate-800"
              : "text-slate-600 hover:bg-slate-100"
          } ${
            currentPage === totalPages
              ? isDarkMode
                ? "bg-slate-800"
                : "bg-slate-100"
              : ""
          }`}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div
      className={`space-y-6 p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTvShow}
        title="Delete TV Show"
        message={`Are you sure you want to delete the TV show "${tvShowToDelete?.name}"?`}
      />

      {/* Rest of the component */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            TV Show Collection
          </h2>
          <p
            className={`mt-1 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Browse and search through your TV show library.
          </p>
        </div>
        <Link to="/admin/tvshows/create">
          <Button
            className={`${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white cursor-pointer rounded-full`}
          >
            <FaTv className="h-4 w-4 mr-2" />
            Add TV Show
          </Button>
        </Link>
      </div>

      {/* Search and Pagination Controls */}
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
            placeholder="Search TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Per page:
          </label>
          <select
            className={`rounded-md border px-2 py-1 text-sm ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
            value={tvShowsPerPage}
            onChange={(e) => {
              setTvShowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* TV Shows Table */}
      <div
        className={`rounded-lg border overflow-hidden shadow-sm ${
          isDarkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <Table>
          <TableHeader className={isDarkMode ? "bg-gray-800" : "bg-slate-50"}>
            <TableRow
              className={isDarkMode ? "border-slate-900" : "border-slate-200"}
            >
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Overview</TableHead>
              <TableHead className="font-semibold">First Air Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Rating</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className={`text-center py-12 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div
                      className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p>Loading TV shows...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className={`text-center py-12 ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>Error: {error}</p>
                    <Button
                      variant="link"
                      className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                      onClick={() => window.location.reload()}
                    >
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTvShows.length > 0 ? (
              filteredTvShows.map((tvShow) => (
                <TableRow
                  key={tvShow.id}
                  className={`${
                    isDarkMode
                      ? "border-slate-800 hover:bg-slate-800/50"
                      : "border-slate-100 hover:bg-slate-50"
                  } transition-colors`}
                >
                  <TableCell className="font-medium">{tvShow.name}</TableCell>
                  <TableCell
                    className={`${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    } max-w-md`}
                  >
                    {truncateText(tvShow.overview)}
                  </TableCell>
                  <TableCell
                    className={isDarkMode ? "text-slate-300" : "text-slate-600"}
                  >
                    {formatDate(tvShow.first_air_date)}
                  </TableCell>
                  <TableCell className="font-medium">{tvShow.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge
                        className={`px-2 py-1 rounded-md text-xs ${getRatingBadgeStyle(
                          tvShow.vote_average
                        )}`}
                      >
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />{" "}
                          {tvShow.vote_average.toFixed(1)}
                        </span>
                      </Badge>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        ({tvShow.vote_count})
                      </span>
                    </div>
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
                          <MoreHorizontal
                            className={`h-4 w-4 ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={
                          isDarkMode
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-slate-200"
                        }
                      >
                        <DropdownMenuLabel
                          className={
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }
                        >
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator
                          className={
                            isDarkMode ? "bg-slate-800" : "bg-slate-100"
                          }
                        />
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 focus:bg-slate-800"
                              : "text-slate-700 focus:bg-slate-50"
                          }
                        >
                          <Link
                            to={`/admin/tvshows/details/${tvShow.id}`}
                            className="flex"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 focus:bg-slate-800"
                              : "text-slate-700 focus:bg-slate-50"
                          }
                        >
                          <Link
                            to={`/admin/tvshows/edit/${tvShow.id}`}
                            className="flex"
                          >
                            <Pen className="mr-2 h-4 w-4" />
                            Update tvshow
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 focus:bg-slate-800"
                              : "text-slate-700 focus:bg-slate-50"
                          }
                          onClick={() => openDeleteDialog(tvShow)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete tvshow
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className={`text-center py-12 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search
                      size={24}
                      className={
                        isDarkMode ? "text-slate-600" : "text-slate-400"
                      }
                    />
                    <p>No TV shows found matching your search criteria</p>
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

      {/* Pagination Controls */}
      {!loading && !error && totalResults > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Showing {(currentPage - 1) * tvShowsPerPage + 1} to{" "}
            {Math.min(currentPage * tvShowsPerPage, totalResults)} of{" "}
            {totalResults} TV shows
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 rounded-md ${
                isDarkMode
                  ? "text-slate-400 hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              } ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPaginationItems()}

            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 rounded-md ${
                isDarkMode
                  ? "text-slate-400 hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              } ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVShows;
