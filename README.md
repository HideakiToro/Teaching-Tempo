# Teaching Tempo

This project aims to relieve the professor of "Tell me when i should slow down or speed up." by providing an easy to use platform to get this data from all students in a session.

---

## RoadMap

- Remove Login requirement for joining sessions
- Limit Session overview to the Users own Sessions
- Remove Redis dependency (and change how Sessions are handled)
- Create an actual Backend for for User credentials (not plain text in a JSON-File)
- Create the ability to join sessions by QR-Code
- On User join, request the host to approve
- Give Host the ability to hide different elements in the session view (e.g. Participants & speed-slider)

---

## Setup

This project uses Nuxt for it's frontend.

### Installation

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

---

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

---

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```