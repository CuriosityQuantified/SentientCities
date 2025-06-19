# SentientCities API Reference

## gRPC API (Simulation Engine)

### SimulationService

The main service for interacting with the simulation engine.

#### GetWorldState

Retrieve the current state of the world.

**Request:**
```protobuf
message WorldStateRequest {}
```

**Response:**
```protobuf
message WorldStateResponse {
  WorldState state = 1;
}

message WorldState {
  TimeInfo time = 1;
  map<string, Agent> agents = 2;
  map<string, House> houses = 3;
  map<string, Resource> resources = 4;
}
```

#### ExecuteAction

Execute an agent action in the world.

**Request:**
```protobuf
message AgentActionRequest {
  AgentAction action = 1;
}

message AgentAction {
  string agent_id = 1;
  oneof action {
    MoveAction move = 2;
    InteractAction interact = 3;
    SpeakAction speak = 4;
    WaitAction wait = 5;
  }
}
```

**Response:**
```protobuf
message AgentActionResponse {
  ActionOutcome outcome = 1;
}

message ActionOutcome {
  bool success = 1;
  string description = 2;
  map<string, float> need_changes = 3;
  string discovery = 4;
  map<string, int32> inventory_changes = 5;
}
```

## WebSocket API (AI Orchestrator)

### Connection

```javascript
const ws = new WebSocket('ws://localhost:8080');
```

### Message Types

#### Agent Update

Sent when an agent's state changes.

```json
{
  "type": "agent_update",
  "data": {
    "agent_id": "agent_001",
    "thoughts": "I wonder what that blue circle is...",
    "action": {
      "action": "approach",
      "target_appearance": "large blue circle",
      "reason": "I'm thirsty and it might help"
    },
    "needs": {
      "hunger": 75.0,
      "thirst": 45.0,
      "energy": 85.0
    }
  }
}
```

#### World Update

Sent periodically with world state.

```json
{
  "type": "world_update",
  "data": {
    "time": {
      "hour": 14,
      "minute": 30,
      "day_cycle": 0.604
    },
    "agents": {
      "agent_001": {
        "position": [5.2, 0, 3.1],
        "activity": "exploring"
      }
    }
  }
}
```

### Client Commands

#### Subscribe to Agent

```json
{
  "type": "subscribe",
  "agent_id": "agent_001"
}
```

#### Request World State

```json
{
  "type": "get_world_state"
}
```

## REST API Endpoints (Future)

### Simulation Control

#### POST /api/simulation/pause
Pause the simulation.

#### POST /api/simulation/resume
Resume the simulation.

#### POST /api/simulation/speed
Set simulation speed.

```json
{
  "speed": 2.0
}
```

### Agent Management

#### GET /api/agents
List all agents.

#### GET /api/agents/{agent_id}
Get detailed agent information.

#### GET /api/agents/{agent_id}/memories
Retrieve agent memories.

```json
{
  "type": "recent",
  "count": 10
}
```

### World Management

#### POST /api/world/objects
Add new objects to the world.

```json
{
  "type": "resource",
  "subtype": "plant",
  "position": [10, 0, 15],
  "properties": {
    "nutrition": 25.0,
    "quantity": 3
  }
}
```

## Error Handling

### gRPC Errors

| Code | Description |
|------|-------------|
| INVALID_ARGUMENT | Invalid request parameters |
| NOT_FOUND | Agent or object not found |
| RESOURCE_EXHAUSTED | Too many requests |
| INTERNAL | Server error |

### WebSocket Errors

```json
{
  "type": "error",
  "code": "AGENT_NOT_FOUND",
  "message": "Agent with ID agent_003 does not exist"
}
```

## Rate Limits

- Agent actions: 1 per second per agent
- World state requests: 10 per second
- Memory queries: 5 per second per agent

## Data Types

### Vector3
```protobuf
message Vector3 {
  float x = 1;
  float y = 2;
  float z = 3;
}
```

### PhysiologicalNeeds
```protobuf
message PhysiologicalNeeds {
  float hunger = 1;      // 0-100
  float thirst = 2;      // 0-100
  float energy = 3;      // 0-100
  float bladder = 4;     // 0-100
  float hygiene = 5;     // 0-100
  bool shelter = 6;
}
```

### TimeInfo
```protobuf
message TimeInfo {
  double timestamp = 1;  // Unix timestamp
  float day_cycle = 2;   // 0.0-1.0 (0=midnight, 0.5=noon)
  int32 hour = 3;        // 0-23
  int32 minute = 4;      // 0-59
}
```