import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(page = 1, filter = "All") {
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchNotifications(
          page,
          10,
          filter === "All" ? "" : filter
        );

        setNotifications(data.notifications || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [page, filter]);

  return {
    notifications,
    total,
    totalPages,
    loading,
    error,
  };
}