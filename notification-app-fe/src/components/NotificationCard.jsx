import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export function NotificationCard({ notification }) {
  return (
    <Card
      sx={{
        borderLeft:
          notification.priority === "High"
            ? "6px solid #f44336"
            : notification.priority === "Medium"
            ? "6px solid #ff9800"
            : "6px solid #4caf50",
        bgcolor: notification.isRead ? "#fafafa" : "#e3f2fd",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {notification.title}
          </Typography>

          <Chip
            label={notification.notificationType}
            color="primary"
            size="small"
          />
        </Stack>

        <Typography mt={1}>
          {notification.message}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {notification.createdAt}
        </Typography>
      </CardContent>
    </Card>
  );
}