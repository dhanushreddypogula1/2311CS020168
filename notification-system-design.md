# Notification System Design
# Stage 1

## Notification REST APIs

### 1. Get Notifications

GET /notifications

Headers

Authorization: Bearer <token>

Response

```json
[
  {
    "id": "uuid",
    "title": "Microsoft Placement Drive",
    "message": "Interview scheduled tomorrow",
    "type": "Placement",
    "priority": "High",
    "isRead": false,
    "createdAt": "2026-07-01T10:00:00Z"
  }
]
```

---

### 2. Get Notification by ID

GET /notifications/{id}

Response

```json
{
  "id":"uuid",
  "title":"Microsoft Placement Drive",
  "message":"Interview scheduled tomorrow",
  "type":"Placement",
  "priority":"High",
  "isRead":false,
  "createdAt":"2026-07-01T10:00:00Z"
}
```

---

### 3. Create Notification

POST /notifications

Request

```json
{
  "title":"Microsoft Drive",
  "message":"Interview tomorrow",
  "type":"Placement",
  "priority":"High"
}
```

Response

```json
{
  "message":"Notification Created Successfully"
}
```

---

### 4. Mark Notification Read

PATCH /notifications/{id}/read

Response

```json
{
  "message":"Notification marked as read"
}
```

---

### 5. Delete Notification

DELETE /notifications/{id}

Response

```json
{
  "message":"Notification deleted"
}
```

---

## Notification Schema

```json
{
    "id":"UUID",
    "userId":"UUID",
    "title":"String",
    "message":"String",
    "type":"Placement | Result | Event",
    "priority":"High | Medium | Low",
    "isRead":false,
    "createdAt":"Timestamp"
}
```

---

## Authentication

All endpoints require

```

Authorization: Bearer <token>

```

---

## Real Time Notifications

Use **WebSocket** for bidirectional communication.

Flow

```

Notification Service
↓
WebSocket Server
↓
Connected Client
↓
Notification appears instantly

```

Advantages

- Real-time delivery
- Low latency
- No repeated polling
- Better user experience
# Stage 2

## Database Choice

I recommend **PostgreSQL** because it provides ACID compliance, indexing support, scalability, strong querying capabilities, and reliable transactional behavior. Notifications have a well-defined relational structure, making PostgreSQL a suitable choice.

---

## Database Schema

### Users

| Column | Type |
|---------|------|
| id | UUID (PK) |
| name | VARCHAR |
| email | VARCHAR |

---

### Notifications

| Column | Type |
|---------|------|
| id | UUID (PK) |
| userId | UUID (FK Users.id) |
| title | VARCHAR |
| message | TEXT |
| notificationType | ENUM('Placement','Result','Event') |
| priority | ENUM('High','Medium','Low') |
| isRead | BOOLEAN |
| createdAt | TIMESTAMP |

---

## Relationships

```
Users
   |
   | 1:N
   |
Notifications
```

---

## Problems as Data Grows

- Millions of notification records increase query latency.
- Full table scans become expensive.
- Sorting by timestamp becomes slower.
- Higher storage requirements.
- Increased write contention.

---

## Solutions

- Index frequently queried columns.
- Partition notifications by creation date.
- Archive old notifications.
- Use Redis for caching unread notification counts.
- Use pagination for fetching notifications.
- Add read replicas for heavy read traffic.

---

## SQL Queries

### Create Notification

```sql
INSERT INTO notifications
(id, userId, title, message, notificationType, priority, isRead, createdAt)
VALUES
(uuid_generate_v4(), ?, ?, ?, ?, ?, false, NOW());
```

---

### Fetch Notifications

```sql
SELECT *
FROM notifications
WHERE userId = ?
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;
```

---

### Mark Read

```sql
UPDATE notifications
SET isRead = true
WHERE id = ?;
```

---

### Delete Notification

```sql
DELETE FROM notifications
WHERE id = ?;
```

---

## NoSQL Alternative

MongoDB can also be used because notifications are append-heavy and flexible, but PostgreSQL provides stronger consistency and simpler relational querying for this use case.

# Stage 3

## Query Analysis

Original Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Problems

- Uses `SELECT *`, retrieving unnecessary columns.
- No LIMIT clause, so all unread notifications are returned.
- Sorting millions of rows is expensive.
- Performance depends heavily on indexes.
- `ORDER BY createdAt ASC` returns the oldest notifications first, whereas users generally expect the newest unread notifications.

---

## Optimized Query

```sql
SELECT id,
       title,
       message,
       notificationType,
       priority,
       createdAt
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

---

## Recommended Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

This composite index allows filtering by student ID and read status while efficiently returning notifications in descending creation order.

---

## Complexity

Without Index

```
Filter : O(n)
Sorting : O(n log n)
```

Overall

```
O(n log n)
```

---

With Composite Index

```
Lookup : O(log n)
Fetch : O(k)
```

Overall

```
O(log n + k)
```

where **k** is the number of notifications returned.

---

## Should We Index Every Column?

**No.**

Creating indexes on every column is not effective because:

- It increases storage usage.
- INSERT and UPDATE operations become slower.
- Many indexes are never used.
- Database maintenance becomes more expensive.

Indexes should only be created on frequently filtered, joined, or sorted columns.

---

## Students Who Received Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```