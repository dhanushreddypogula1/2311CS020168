import { Stack, Typography } from "@mui/material";
import { NotificationCard } from "../components/NotificationCard";

const priorityOrder = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityNotificationsPage({
  notifications,
}) {
  const topNotifications = [...notifications]
    .sort((a, b) => {
      if (
        priorityOrder[b.notificationType] !==
        priorityOrder[a.notificationType]
      ) {
        return (
          priorityOrder[b.notificationType] -
          priorityOrder[a.notificationType]
        );
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    })
    .slice(0, 10);

  return (
    <>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Priority Notifications
      </Typography>

      <Stack spacing={2}>
        {topNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}
      </Stack>
    </>
  );
}