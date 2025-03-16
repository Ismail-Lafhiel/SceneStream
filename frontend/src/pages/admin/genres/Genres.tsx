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
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getGenres, deleteGenre } from "@/services/GenreService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";

const Genres = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [genresPerPage, setGenresPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);

  // Fetch genres from API with pagination
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await getGenres({
          page: currentPage,
          limit: genresPerPage,
        });

        // Extract data from the response
        const genreData = response.results || [];
        setGenres(genreData);
        setTotalPages(response.total_pages || 1);
        setTotalResults(response.total_results || 0);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch genres");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [currentPage, genresPerPage]);

  // When search query changes, reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter genres based on search query
  const filteredGenres = Array.isArray(genres)
    ? genres.filter((genre) =>
        genre.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle delete genre
  const handleDeleteGenre = async () => {
    if (!genreToDelete) return;

    try {
      await deleteGenre(genreToDelete.id);
      toast.success("Genre deleted successfully!");
      // Refresh the genres list
      const response = await getGenres({
        page: currentPage,
        limit: genresPerPage,
      });
      setGenres(response.results || []);
      setTotalPages(response.total_pages || 1);
      setTotalResults(response.total_results || 0);
    } catch (err) {
      toast.error(err.message || "Failed to delete genre");
    } finally {
      setIsDeleteDialogOpen(false);
      setGenreToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (genre) => {
    setGenreToDelete(genre);
    setIsDeleteDialogOpen(true);
  };

  // Render pagination items (e.g., 1, 2, 3, ...)
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
        onConfirm={handleDeleteGenre}
        title="Delete Genre"
        message={`Are you sure you want to delete the genre "${genreToDelete?.name}"?`}
      />

      {/* Rest of the component */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Genre Management
          </h2>
          <p
            className={`mt-1 ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Manage categories for movies and TV shows.
          </p>
        </div>
        <Link to="/admin/genres/create">
          <Button
            className={`${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white cursor-pointer rounded-full`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Genre
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
            placeholder="Search genres..."
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
            value={genresPerPage}
            onChange={(e) => {
              setGenresPerPage(Number(e.target.value));
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

      {/* Genres Table */}
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
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
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
                    <p>Loading genres...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className={`text-center py-12 ${
                    isDarkMode ? "text-red-400" : "text-red-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>Error: {error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage(1);
                        setError(null);
                      }}
                      className={`mt-2 ${
                        isDarkMode
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredGenres.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className={`text-center py-12 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>No genres found.</p>
                    {searchQuery && (
                      <p className="text-sm">
                        Try adjusting your search query or filters.
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredGenres.map((genre) => (
                <TableRow
                  key={genre.id}
                  className={
                    isDarkMode ? "border-slate-800" : "border-slate-200"
                  }
                >
                  <TableCell className="font-medium">{genre.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={isDarkMode ? "bg-slate-800" : "bg-white"}
                      >
                        <DropdownMenuLabel
                          className={
                            isDarkMode ? "text-slate-200" : "text-slate-800"
                          }
                        >
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 hover:bg-slate-700"
                              : "text-slate-700 hover:bg-slate-100"
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Genre
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            isDarkMode
                              ? "text-slate-300 hover:bg-slate-700"
                              : "text-slate-700 hover:bg-slate-100"
                          }
                          onClick={() => openDeleteDialog(genre)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Genre
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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
            Showing {(currentPage - 1) * genresPerPage + 1} to{" "}
            {Math.min(currentPage * genresPerPage, totalResults)} of{" "}
            {totalResults} genres
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

export default Genres;