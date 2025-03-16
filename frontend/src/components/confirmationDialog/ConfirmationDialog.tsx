import { useDarkMode } from "@/contexts/DarkModeContext";
import { Button } from "@/components/ui/TableButton";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full mx-4 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-slate-900"
        }`}
      >
        {/* Dialog Title */}
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Dialog Message */}
        <p className="mb-6">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className={isDarkMode ? "border-slate-700" : "border-slate-200"}
          >
            {cancelText}
          </Button>

          {/* Confirm Button */}
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
