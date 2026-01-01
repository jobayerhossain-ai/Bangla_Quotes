# Contributing to Bangla Quotes Platform

Thank you for your interest in contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/bangla-quotes-platform.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Setup database
cd apps/api
npx prisma generate
npx prisma migrate dev
npm run prisma:seed

# Start development servers
# Terminal 1 - Backend
cd apps/api
npm run dev

# Terminal 2 - Admin
cd apps/admin
npm run dev

# Terminal 3 - Web
cd apps/web
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use Prettier for formatting (run `npm run format`)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed

## Commit Message Format

We follow the Conventional Commits specification:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(api): add quote search endpoint
fix(admin): resolve pagination bug in quote list
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update documentation** - If you've changed APIs or added features
2. **Add tests** - If applicable, add unit or integration tests
3. **Ensure all tests pass** - Run `npm test` before submitting
4. **Update CHANGELOG.md** - Add your changes under "Unreleased"
5. **Request review** - Tag relevant maintainers

## Code Review Guidelines

- Be respectful and constructive
- Explain your reasoning
- Be open to feedback
- Focus on the code, not the person

## Testing

```bash
# Run all tests
npm test

# Run tests for specific app
cd apps/api
npm test

# Run tests in watch mode
npm test -- --watch
```

## Project Structure

```
bangla-quotes-platform/
├── apps/
│   ├── api/        # Backend API
│   ├── admin/      # Admin panel
│   └── web/        # Public website
├── packages/
│   └── shared-types/  # Shared TypeScript types
└── docs/           # Documentation
```

## Areas for Contribution

### Backend
- API endpoints
- Database optimizations
- Security improvements
- Performance enhancements

### Frontend
- UI components
- Page layouts
- Responsive design
- Accessibility improvements

### Documentation
- API documentation
- User guides
- Code examples
- Tutorials

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

### Enforcement

Violations may be reported to the project maintainers. All complaints will be reviewed and investigated.

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Contact maintainers directly for sensitive matters

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Bangla Quotes Platform! 🙏

Your contributions help make this project better for everyone.
