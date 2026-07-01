import { Container, Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

import { NotificationsPage } from "./pages/NotificationsPage";
import PriorityNotificationsPage from "./pages/PriorityNotificationsPage";

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        centered
      >
        <Tab label="All Notifications" />
        <Tab label="Priority Notifications" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 ? (
          <NotificationsPage />
        ) : (
          <PriorityNotificationsPage notifications={[]} />
        )}
      </Box>
    </Container>
  );
}