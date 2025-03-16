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
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getMovies } from "@/services/MovieService";
import { Link } from "react-router-dom";
import { FaFilm } from "react-icons/fa";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch movies from API with pagination
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getMovies({
          page: currentPage,
          limit: moviesPerPage,
        });

        // Extract data from the response
        const movieData = response.results || [];
        setMovies(movieData);
        setTotalPages(response.total_pages || 1);
        setTotalResults(response.total_results || 0);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, moviesPerPage]);

  // When search query changes, reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter movies based on search query
  const filteredMovies = Array.isArray(movies)
    ? movies.filter(
        (movie) =>
          movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.overview?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Movie Collection
          </h2>
          <p
            className={`mt-1 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Browse and search through your movie library.
          </p>
        </div>
        <Link to="/admin/movies/create">
          <button
            className={`p-3 cursor-pointer rounded-full hidden md:flex items-center space-x-2 ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            <FaFilm className="w-4 h-4" />
            <span className="text-sm font-medium">Add Movie</span>
          </button>
        </Link>
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
            placeholder="Search movies..."
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
            value={moviesPerPage}
            onChange={(e) => {
              setMoviesPerPage(Number(e.target.value));
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
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Overview</TableHead>
              <TableHead className="font-semibold">Release Date</TableHead>
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
                    <p>Loading movies...</p>
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
            ) : filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <TableRow
                  key={movie.id}
                  className={`${
                    isDarkMode
                      ? "border-slate-800 hover:bg-slate-800/50"
                      : "border-slate-100 hover:bg-slate-50"
                  } transition-colors`}
                >
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell
                    className={`${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    } max-w-md`}
                  >
                    {truncateText(movie.overview)}
                  </TableCell>
                  <TableCell
                    className={isDarkMode ? "text-slate-300" : "text-slate-600"}
                  >
                    {formatDate(movie.release_date)}
                  </TableCell>
                  <TableCell className="font-medium">{movie.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge
                        className={`px-2 py-1 rounded-md text-xs ${getRatingBadgeStyle(
                          movie.vote_average
                        )}`}
                      >
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />{" "}
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </Badge>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        ({movie.vote_count})
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
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 focus:bg-slate-800"
                              : "text-slate-700 focus:bg-slate-50"
                          }
                        >
                          Update Movie
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 focus:bg-slate-800"
                              : "text-slate-700 focus:bg-slate-50"
                          }
                        >
                          Delete movie
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
                    <p>No movies found matching your search criteria</p>
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
            Showing {(currentPage - 1) * moviesPerPage + 1} to{" "}
            {Math.min(currentPage * moviesPerPage, totalResults)} of{" "}
            {totalResults} movies
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

export default Movies;
