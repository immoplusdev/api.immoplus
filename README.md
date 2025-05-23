# Immoplus API

A backend API for real estate management, built with Node.js, NestJS, and MySQL. This project supports local development with nvm and production deployment via Docker.

---

## Table of Contents
- [Config](#config)
- [Directory Structure](#directory-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Database](#database)
- [Contributing](#contributing)

---

## Config

- **NPM Registry (China):**
  ```shell
  npm config set registry http://r.cnpmjs.org
  ```
- **Node Version Management:** Uses [nvm](https://github.com/nvm-sh/nvm) for local development.
- **Production:** Uses Docker. See `docker-compose.yml` for details.

---

## Database

- **MySQL** is used as the database.
- To run the database locally with Docker Compose:
  ```shell
  docker-compose -f docker-compose.db.yml up
  ```

---

## Directory Structure

- `uploads/` — Uploaded files
- `src/core/` — Core logic (domain, application)
- `src/infrastructure/` — Infrastructure logic (DB, HTTP, gRPC, etc.)
- `e2e/` — End-to-end tests
- `stress-tests/` — Load and stress test scripts
- `scripts/` — Utility scripts
- `sql/` — SQL scripts

---

## Development Workflow

1. **Checkout the dev branch and pull latest changes:**
   ```bash
   git checkout dev
   git pull
   ```
2. **Create a new branch** for your feature or fix. Use the following prefixes:
   - `feat/` for new features
   - `fix/` for bug fixes
   - `refactor/` for refactoring
   - `chore/` for chores
   - `docs/` for documentation
   - `test/` for tests
   
   Example: `feat/reservations`

3. **Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.**

---

## Testing

- **E2E Testing:** Use [Bruno](https://www.usebruno.com/) for end-to-end API tests. See the `bruno.json` and `e2e/` directory.
- **Stress Testing:** Use [k6](https://k6.io/) for load and stress tests. See the `stress-tests/` directory.

---

## Contributing

- Please open issues or pull requests for any improvements or bug fixes.
- Make sure to follow the development workflow and commit message guidelines.

---

## License

This project is licensed under the MIT License.
