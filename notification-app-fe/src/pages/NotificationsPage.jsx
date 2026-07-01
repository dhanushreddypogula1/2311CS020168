import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const {
    notifications,
    totalPages,
    loading,
    error,
  } = useNotifications(page, filter);

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const handleFilterChange = (_, newFilter) => {
    if (!newFilter) return;

    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={3}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
        >
          <NotificationsIcon fontSize="large" />
        </Badge>

        <Typography
          variant="h4"
          fontWeight={700}
        >
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <NotificationFilter
        value={filter}
        onChange={handleFilterChange}
      />

      <Box mt={3} />

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          mt={6}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!loading &&
        !error &&
        notifications.length === 0 && (
          <Alert severity="info">
            No notifications found.
          </Alert>
        )}

      {!loading &&
        !error &&
        notifications.length > 0 && (
          <Stack spacing={2}>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </Stack>
        )}

      <Box
        display="flex"
        justifyContent="center"
        mt={4}
      >
        <Pagination
          page={page}
          count={totalPages}
          color="primary"
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}