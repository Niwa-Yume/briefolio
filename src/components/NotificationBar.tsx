import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearNotification } from "@/store/notificationSlice";
import { Alert, Button } from "@heroui/react";

function mapTypeToColor(type: "success" | "error" | "info") {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "danger";
    case "info":
      return "primary";
    default:
      return "default";
  }
}

export function NotificationBar() {
  const notification = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
      <Alert
        variant="solid"
        color={mapTypeToColor(notification.type)}
        className="flex justify-between items-center"
      >
        <span>{notification.message}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => dispatch(clearNotification())}
        >
          Fermer
        </Button>
      </Alert>
    </div>
  );
}