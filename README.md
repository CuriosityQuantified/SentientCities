# SentientCities

A massive multi-agent simulation platform where each avatar is powered by Large Language Models, featuring emergent behaviors, persistent memory, and realistic human needs.

![SentientCities Banner](docs/images/banner.png)

## 🌟 Overview

SentientCities is an ambitious simulation platform that creates virtual worlds populated by AI-driven agents. Each agent:
- Has its own LLM-powered consciousness
- Starts with minimal knowledge and learns through experience
- Maintains persistent memories across different memory systems
- Experiences physiological and psychological needs
- Can communicate and form relationships with other agents
- Discovers the world through exploration and experimentation

## 🚀 Key Features

- **Blank Slate Learning**: Agents start with only basic self-awareness and must discover everything
- **Multi-Memory Systems**: Working, short-term, long-term, and episodic memory
- **Realistic Physics**: Powered by Rapier physics engine
- **Real-time Visualization**: 3D world view with agent thoughts and actions
- **Emergent Behaviors**: Watch societies form naturally without scripted behaviors

## 🏗️ Architecture

```
┌─────────────────┐     gRPC      ┌──────────────────┐     WebSocket    ┌──────────────────┐
│ Rust Simulation ├──────────────►│ Python AI Layer  ├────────────────►│ TypeScript UI    │
│     Engine      │◄──────────────┤  (Claude/LLMs)   │◄────────────────┤  (Three.js)      │
└─────────────────┘               └──────────────────┘                 └──────────────────┘
```

## 📋 Prerequisites

- Rust 1.75+
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Anthropic API Key

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/CuriosityQuantified/SentientCities.git
   cd SentientCities
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your ANTHROPIC_API_KEY to .env
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the visualization**
   ```
   http://localhost:3000
   ```

## 🏃‍♂️ Development Setup

### Rust Simulation Engine
```bash
cd simulation-engine
cargo build --release
cargo run
```

### Python AI Orchestrator
```bash
cd ai-orchestrator
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### TypeScript Visualization
```bash
cd visualization
npm install
npm run dev
```

## 📚 Documentation

- [Product Requirements Document](docs/PRD.md)
- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🎮 First Run Experience

When you first start SentientCities, you'll see:
1. Two agents (Alice and Bob) spawning in random locations
2. Each agent starting to explore their environment
3. Real-time thought bubbles showing their internal monologue
4. Agents discovering basic needs like thirst and hunger
5. Gradual learning as they interact with objects

Watch as they:
- Discover the lake and learn to drink
- Find food sources through trial and error
- Locate their houses and understand ownership
- Eventually meet each other and attempt communication

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Anthropic for Claude API
- Rapier physics engine team
- Three.js community

## 📞 Contact

- Discord: [Join our server](https://discord.gg/sentientcities)
- Twitter: [@SentientCities](https://twitter.com/sentientcities)
- Email: team@sentientcities.com