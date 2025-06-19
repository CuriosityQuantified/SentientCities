# SentientCities Architecture Overview

## System Architecture

SentientCities uses a three-tier architecture to separate concerns and enable scalability:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (TypeScript)                     │
│  - Three.js 3D Visualization                                    │
│  - Real-time Agent Monitoring                                   │
│  - WebSocket Client                                             │
└─────────────────────────────────────────────────────────────────┘
                               │
                          WebSocket
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    AI Orchestrator (Python)                      │
│  - LLM Integration (Claude)                                     │
│  - Memory Management                                            │
│  - Decision Making                                              │
│  - Learning System                                              │
└─────────────────────────────────────────────────────────────────┘
                               │
                             gRPC
                               │
┌─────────────────────────────────────────────────────────────────┐
│                  Simulation Engine (Rust)                        │
│  - Physics (Rapier3D)                                          │
│  - World State Management                                       │
│  - Agent Movement                                               │
│  - Resource System                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Simulation Engine (Rust)

**Responsibilities:**
- Maintain authoritative world state
- Handle physics simulation
- Process agent movements
- Manage resources and objects
- Enforce world rules

**Key Technologies:**
- Rapier3D for physics
- Tonic for gRPC server
- DashMap for concurrent data structures
- Tokio for async runtime

### AI Orchestrator (Python)

**Responsibilities:**
- Interface with LLMs for agent cognition
- Manage agent memory systems
- Process perceptions into thoughts
- Convert thoughts into actions
- Handle learning and association formation

**Key Technologies:**
- Anthropic SDK for Claude integration
- ChromaDB for vector memory
- asyncio for concurrent processing
- gRPC client for engine communication

### Visualization (TypeScript/React)

**Responsibilities:**
- Render 3D world view
- Display agent thoughts and states
- Provide debugging interfaces
- Handle user interactions

**Key Technologies:**
- Three.js for 3D graphics
- React for UI components
- Redux for state management
- WebSocket for real-time updates

## Data Flow

### Perception-Decision-Action Loop

1. **Perception Phase**
   ```
   Rust Engine → World State → Python Orchestrator
   ```
   - Engine sends current world state via gRPC
   - Orchestrator processes into agent-specific perceptions

2. **Cognition Phase**
   ```
   Python Orchestrator → LLM → Thoughts → Decision
   ```
   - Agent perceives environment
   - Retrieves relevant memories
   - Generates internal monologue via LLM
   - Decides on action

3. **Action Phase**
   ```
   Python Orchestrator → Action → Rust Engine → Outcome
   ```
   - Orchestrator sends action to engine
   - Engine executes action in physics world
   - Returns outcome to orchestrator

4. **Learning Phase**
   ```
   Outcome → Memory Storage → Association Formation
   ```
   - Agent learns from action outcomes
   - Updates memory systems
   - Forms new associations

## Memory Architecture

### Memory Hierarchy

```
┌─────────────────────┐
│   Working Memory    │ ← Current context (10 items)
├─────────────────────┤
│  Short-term Memory  │ ← Recent events (100 items)
├─────────────────────┤
│  Long-term Memory   │ ← Important experiences (vector DB)
├─────────────────────┤
│  Episodic Memory    │ ← Event sequences
└─────────────────────┘
```

### Memory Flow
- New experiences enter working memory
- Important items promoted to short-term
- Very important items stored in long-term
- Sequences stored as episodes

## Scaling Strategy

### Horizontal Scaling

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Region 1   │ │  Region 2   │ │  Region 3   │
│  Engine     │ │  Engine     │ │  Engine     │
└─────────────┘ └─────────────┘ └─────────────┘
       │               │               │
       └───────────────┴───────────────┘
                       │
              ┌────────────────┐
              │ Load Balancer  │
              └────────────────┘
                       │
              ┌────────────────┐
              │ AI Orchestrator│
              │    Cluster     │
              └────────────────┘
```

### Optimization Techniques

1. **Spatial Partitioning**
   - Divide world into regions
   - Process regions independently
   - Message passing between regions

2. **LOD AI Processing**
   - Full AI for important/nearby agents
   - Simplified behaviors for distant agents
   - Statistical simulation for crowds

3. **Caching Strategy**
   - Cache common decisions
   - Reuse behavior patterns
   - Share context across similar agents

## Communication Protocols

### gRPC (Rust ↔ Python)
- Protocol Buffers for message definition
- Bidirectional streaming for updates
- Efficient binary serialization

### WebSocket (Python ↔ TypeScript)
- JSON message format
- Real-time state updates
- Event-driven architecture

## Security Considerations

- API key management for LLM access
- Rate limiting for expensive operations
- Sandboxed agent actions
- Audit logging for debugging

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Docker Compose              │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌──────────────┐  │
│  │   Rust      │ │   Python     │  │
│  │   Engine    │ │ Orchestrator │  │
│  └─────────────┘ └──────────────┘  │
│  ┌─────────────┐ ┌──────────────┐  │
│  │  TypeScript │ │  PostgreSQL  │  │
│  │     UI      │ │   Database   │  │
│  └─────────────┘ └──────────────┘  │
└─────────────────────────────────────┘
```

## Future Considerations

1. **Multi-region deployment**
2. **Kubernetes orchestration**
3. **Custom LLM fine-tuning**
4. **Distributed memory systems**
5. **Edge computing for agents**