# Contributing to SentientCities

We're excited that you're interested in contributing to SentientCities! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Create a clear, descriptive title
3. Provide steps to reproduce
4. Include system information
5. Add relevant logs or screenshots

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Update documentation
6. Commit with clear messages (`git commit -m 'Add amazing feature'`)
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Process

#### Rust (Simulation Engine)
- Follow Rust naming conventions
- Run `cargo fmt` before committing
- Run `cargo clippy` and address warnings
- Add tests for new functionality

#### Python (AI Orchestrator)
- Follow PEP 8 style guide
- Use `black` for formatting
- Add type hints
- Write docstrings for functions

#### TypeScript (Visualization)
- Use TypeScript strict mode
- Follow React best practices
- Write unit tests for components
- Use semantic HTML

## Architecture Guidelines

### Agent Behavior
- Maintain blank slate principle
- No hardcoded behaviors
- All learning through experience

### Memory Systems
- Preserve memory integrity
- Efficient storage/retrieval
- Clear separation of memory types

### Performance
- Consider scalability
- Optimize LLM calls
- Profile before optimizing

## Testing

- Unit tests for core logic
- Integration tests for systems
- Performance benchmarks
- Memory leak detection

## Documentation

- Update README for features
- Add inline code comments
- Update API documentation
- Include examples

## Questions?

Reach out on our Discord or open a discussion on GitHub!