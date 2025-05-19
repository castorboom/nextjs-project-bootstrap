# YNet Agent API Documentation

## Authentication

| Method | Endpoint         | Description                     | Payload / Query                      |
|--------|------------------|---------------------------------|------------------------------------|
| POST   | /auth/login      | Authentication and JWT token issuance | { "username": "...", "password": "..." } |
| POST   | /auth/refresh    | Refresh JWT token               | { "refreshToken": "..." }           |

## Devices

| Method | Endpoint                     | Description                   | Payload / Query                   |
|--------|------------------------------|-------------------------------|---------------------------------|
| POST   | /devices/register            | Register or update an agent   | { "hwid": "...", "hostname": "...", "osVersion": "..." } |
| GET    | /devices                    | List all devices              | —                               |
| GET    | /devices/{deviceId}         | Get device details            | —                               |

## Heartbeat & Metrics

| Method | Endpoint                             | Description                   | Payload / Query                   |
|--------|------------------------------------|-------------------------------|---------------------------------|
| POST   | /devices/{deviceId}/heartbeat       | Receive heartbeat (ping)      | { "timestamp": "...", "status": "online" } |
| GET    | /devices/{deviceId}/metrics          | Get historical metrics        | ?from=ISO8601&to=ISO8601         |
| POST   | /devices/{deviceId}/metrics          | Send bulk metrics             | [ { "type": "uptime", "value": 12345, "timestamp": "..." }, ... ] |

## IP Address

| Method | Endpoint                             | Description                   | Payload / Query                   |
|--------|------------------------------------|-------------------------------|---------------------------------|
| GET    | /devices/{deviceId}/ip/public       | Get current public IP         | —                               |

## Commands

| Method | Endpoint                             | Description                   | Payload / Query                   |
|--------|------------------------------------|-------------------------------|---------------------------------|
| POST   | /devices/{deviceId}/commands        | Send remote command           | { "command": "reboot" }          |
| GET    | /devices/{deviceId}/commands/{cmdId} | Get command execution status  | —                               |

## Errors & Disconnects

| Method | Endpoint                             | Description                   | Payload / Query                   |
|--------|------------------------------------|-------------------------------|---------------------------------|
| GET    | /devices/{deviceId}/errors          | List recent critical errors   | ?since=ISO8601                   |
| POST   | /devices/{deviceId}/disconnects     | Log network disconnects       | { "timestamp": "...", "interface": "eth0" } |

---

**Note:** All endpoints require the header `Authorization: Bearer <token>`.  
Responses have the schema:  
```json
{ "code": 0|1, "message": "...", "data": {...} }
