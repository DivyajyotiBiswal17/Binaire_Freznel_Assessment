# Freznel — a Steam-style web store

A single-page storefront modelled on the Steam Store (home, top sellers search, category hub), built for the **Binaire Private Limited** JavaScript assessment. All content comes from the **TMDB API**: movies stand in for games, and prices, discounts and platform icons are generated locally because TMDB has no commerce data.

The app works offline, authenticates with Firebase, and implements pagination and lazy loading from scratch.


---

## Tech stack and why

| Technology | Role | Why this choice |
|---|---|---|
| **Vite** + **TypeScript** (strict) | Build tool and language | Fast dev server, native ES modules, and a pure client-side build, which is exactly what "no server-side rendering" asks for. TypeScript catches data-shape bugs between TMDB, the models and the UI. |
| **React** | UI | Component model fits the many repeated card, row and carousel variants. Used only for rendering; business logic lives in plain classes. |
| **React Router** | Routing | Gives shareable URLs, back and forward behaviour, and `useSearchParams` for URL-driven search state. |
| **Tailwind CSS v4** | Styling | CSS-first config with `@theme` design tokens (the Steam palette is defined once). Variants (`hover:`, `active:`, `focus-visible:`, `has-[...]`, `group-focus-within:`) cover the required interaction states directly in markup. |
| **ShadCN** (React Aria preset) | Component scaffolding | The only component library the brief allows. It is initialised (`cn` helper, `Button`), but most UI is hand-built because the Steam look departs heavily from shadcn defaults. The generated `Button` depends on `react-aria-components`, which is part of shadcn's React Aria preset. |
| **GSAP** | Orchestrated motion | Page transitions, carousel sliding, hero entrance and the falling-leaves layer need sequencing, staggering and timeline control that CSS alone does awkwardly. `gsap.matchMedia()` also makes `prefers-reduced-motion` handling clean. |
| **CSS keyframes** | Micro-interactions | Skeleton shimmer, fade-up, error shake and the `:target` flash are simple, GPU-friendly and need no JS. |
| **Firebase Auth** | Authentication | Required by the brief. Handles credential storage, hashing, tokens and session persistence so none of that is hand-rolled. |
| **Cloud Firestore** | Cart and wishlist storage | One document per user. Its offline persistence queues writes while disconnected, matching the offline requirement. |
| **TMDB API** | Content | Required by the brief. Rich images (posters, backdrops, textless stills) and metadata. |
| **IndexedDB** (via `CacheManager`) | API response cache | Async, large quota, structured data. `localStorage` is synchronous and about 5 MB. |
| **Hand-written Service Worker** | App shell and image cache | No Workbox or plugin dependency, and the caching strategy is explicit and easy to explain. |
| **Fontsource (Figtree)** | Typography | Bundled with the app, so the font also works offline. Figtree is a close open-licence match for Steam's Motiva Sans. |

---

## Architecture


### Folder structure

```
src/
├── api/            ApiClient, MovieService, CategoryService
├── auth/           firebase.ts, AuthService, AuthValidator, AuthErrors
├── components/
│   ├── Auth/       AuthPage, AuthForm, TextField
│   ├── Filters/    SearchSidebar
│   ├── Layout/     Layout, Header, NavMenu, StoreMenu, LanguageMenu, Footer,
│   │               ConnectionBanner, PageTransition, LazyImage
│   ├── Models/     Item-display components: BigCapsule, HoverCapsule, StoreRow,
│   │               SearchResultRow, PriceTag, PagedCarousel, DealsPanel,
│   │               HomeTabs, RowSection, CategoryHero, FallingLeaves, SaleHero,
│   │               AddedToCartDialog, WishlistButton, ...
│   ├── Search/     SearchBar, SearchInfoBar, PaginationNav
│   └── ui/         ShadCN components
├── hooks/          useAsync, useAuth, useConnectivity, useLists,
│                   useLazyMount, useAltImage, useImageLoads
├── models/         StoreItem, genres, navigation
├── offline/        CacheManager, ConnectivityMonitor
├── pages/          Home, SearchPage, CategoryPage, Login, Signup, Cart, Wishlist
├── search/         SearchQuery, ResultFilter
├── sorting/        SortOptions
├── store/          ListsStore
├── styles/         index.css (Tailwind, theme tokens, keyframes)
├── types/          tmdb.ts
└── utils/          LazyLoader, Pagination, LanguageStore, money, dates
public/             sw.js, heartbeat.txt
```

### Core classes

| Class | Responsibility |
|---|---|
| `ApiClient` | Single entry point to TMDB. Network first, falls back to the IndexedDB cache. Adds the active language to every request and cache key. |
| `CacheManager` | Promise-based IndexedDB wrapper (`get` and `set`). |
| `ConnectivityMonitor` | Tracks online or offline status and notifies subscribers. |
| `MovieService` / `CategoryService` | Turn TMDB endpoints into `StoreItem` pages (popular, trending, discover, search, per-category sections). |
| `StoreItem` | Domain model wrapping a TMDB movie: deterministic price and discount, tags, review label, image URL helpers. |
| `SearchQuery` | Parses and serialises the URL into a typed query, and builds the TMDB `discover` request. Immutable: `patch()` returns a new query. |
| `ResultFilter` | Page-level filters TMDB cannot do (price slider, discounts only, hide free, hide no artwork). |
| `SortOptions` | The allowed sort orders, with validation of URL input. |
| `Pagination` | Page-window maths (`1 … 4 5 6 … 50`), next and previous state. |
| `LazyLoader` | IntersectionObserver wrapper for deferred images and sections. |
| `AuthService` | Wraps Firebase Auth (sign up, sign in, sign out, auth-state subscription). |
| `AuthValidator` / `AuthErrors` | Client-side form validation and translation of Firebase error codes into readable messages. |
| `ListsStore` | Cart and wishlist state with local persistence and Firestore sync. |
| `LanguageStore` | Persists the chosen TMDB language. |

---

## How the main features work

### Data layer (TMDB)

```
Component → hook (useAsync) → MovieService → ApiClient → fetch(TMDB)
                                                │              │
                                                │  success     └→ CacheManager.set(key, data)
                                                └─ failure → CacheManager.get(key)  (offline fallback)
```

### Authentication with Firebase

**Step by step**

1. **Validate on the client.** `AuthValidator` checks name length, email shape, password length (at least 6, Firebase's minimum) and that the confirmation matches. Errors are shown per field, linked with `aria-describedby`, and focus jumps to the first invalid field. This is a convenience that saves a round trip, not a security boundary.
2. **Create the account.** `createUserWithEmailAndPassword` sends the credentials over HTTPS to Firebase. Firebase hashes and stores the password server-side; the app never stores or sees it again. The browser receives a short-lived **ID token** (a signed JWT, about one hour) and a long-lived **refresh token**.
3. **Set the display name.** `updateProfile` stores the name on the Firebase user.
4. **Persist the session.** The SDK saves the session in IndexedDB and refreshes the ID token automatically. Reloading the page does not sign the user out.
5. **React to auth state.** `onAuthStateChanged` is the single source of truth. On startup it fires once the SDK has restored the saved session, which is why `useAuth` exposes a `ready` flag: it prevents a flash of the signed-out header before Firebase answers.
6. **Authorise data access.** The SDK attaches the ID token to Firestore requests automatically. Firestore security rules then check `request.auth.uid` (see below).
7. **Handle failures.** `AuthErrors` maps Firebase codes (`auth/invalid-credential`, `auth/email-already-in-use`, `auth/too-many-requests`, `auth/network-request-failed`, and so on) to plain-language messages. Form-level errors use `role="alert"` so screen readers announce them. The sign-in message is intentionally the same for "wrong password" and "no such user", so it does not reveal which emails are registered.

**Security model**

- The Firebase `apiKey` in the client bundle is **not a secret**. It only identifies the project. Access control is enforced by **Authentication** (who you are) and **Firestore rules** (what you may read and write).
- Firestore rules in this project allow a signed-in user to read and write only their own document:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

**Offline behaviour:** an already signed-in user stays signed in offline because the session is persisted locally. Creating an account or signing in genuinely needs the network, so the form disables its submit button and says why.

### Cart and wishlist

`ListsStore` keeps the cart and wishlist in memory, in `localStorage`, and in Firestore when signed in.

| Situation | Behaviour |
|---|---|
| Signed out | Lists live in `localStorage` under a guest key. |
| Signing in | Guest items are **merged** (union by movie id) into the account's lists, then the guest key is cleared, so nothing added before logging in is lost. |
| Signed in | An `onSnapshot` listener keeps the store in step with `users/{uid}`. Local changes are written back with `setDoc`; remote changes (another tab or device) replace local state. |
| Offline | Firestore is initialised with `persistentLocalCache` and the multi-tab manager, so writes are queued and sent on reconnect. |
| Signing out | The store reverts to the guest lists. |

### Offline support

Three layers, each covering a different kind of resource:

| Layer | Covers | Strategy |
|---|---|---|
| **Service worker** (`public/sw.js`) | App shell (HTML, JS, CSS) | Network first, falls back to cache, and `index.html` as the SPA fallback. |
| **Service worker** | TMDB images | Cache first. Posters and backdrops are immutable. |
| **IndexedDB** (`CacheManager`) | TMDB JSON responses | Network first, with the last good response as the fallback. |
| **Firestore persistent cache** | Cart and wishlist | Built-in offline queue. |

**Connection status.** `ConnectivityMonitor` combines the browser `online` and `offline` events with a **heartbeat**: a `HEAD /heartbeat.txt` request every 8 seconds with caching disabled. `navigator.onLine` only reports whether a network interface exists, so it says "online" on captive portals or dead Wi-Fi. The heartbeat confirms real reachability. Status changes are pushed to subscribers, and `ConnectionBanner` shows "You're offline. Showing saved data." and then "Back online." in an `aria-live="polite"` region.

Because the app is expected to flip between online and offline at random, a first load must happen online. Each view works offline once it has been loaded once.

### Lazy loading

Implemented from scratch with the browser's `IntersectionObserver`. There is no `React.lazy`, no `Suspense` and no library.

- `LazyLoader` observes elements with a 200px margin and runs a callback once each becomes visible, then stops observing it.
- **Images:** `LazyImage` renders `<img data-src>`; the loader swaps in `src` as the image nears the viewport. A shimmer skeleton shows until the image loads, then fades in.
- **Sections:** `useLazyMount` uses the same class so whole rows on the home and category pages fetch only when they approach the viewport. The tab lists on Home behave the same way.

### Pagination and search state

Also from scratch, with no pagination library.

- `Pagination` computes the visible window (`1 … 4 5 6 … 50`) and the next and previous state from the current page and TMDB's `total_pages`. TMDB caps results at 500 pages, and the app respects that.
- **The URL is the state.** `SearchQuery` serialises everything (`term`, `filter`, `sort`, `genres`, `exclude`, `rating`, `page`) into query parameters, for example `/search?filter=topsellers&genres=12,14&sort=vote_average.desc&page=3`. This makes searches shareable and bookmarkable and gives working back and forward buttons, with no separate state to keep in sync.
- Changing any filter resets to page 1. Changing the page scrolls to the heading and **moves keyboard focus there**, so keyboard and screen reader users are not left stranded at the bottom of the list.
- TMDB cannot filter by the generated prices, so the price slider, "Discounts & Events" and "Hide free" filters apply to the page of results currently loaded, and the info bar reports how many titles were excluded, echoing Steam's wording.

### Accessibility

> *How is accessibility managed?* It is treated as a build constraint rather than a final pass. Native elements are preferred over custom widgets, and where a custom widget is unavoidable it follows the matching ARIA pattern.

**Structure and navigation**
- A **skip link** is the first focusable element and jumps to `<main id="main" tabindex="-1">`.
- Landmarks are used throughout (`header`, labelled `nav`s, `main`, `aside`, `footer`, `role="search"`), and every section has a heading hierarchy.
- Route changes move through real URLs, and after a pagination change focus moves to the results heading.

**Keyboard**
- Every control works with the keyboard. Dropdown menus open on focus, close on **Escape** (returning focus to their trigger) and close when focus leaves.
- Carousel arrows and dots are real buttons; off-screen slides use `inert`, so they are not tabbable.
- Hover-only content (the Add to Cart panel, tooltips) also appears on focus, so it is never mouse-only.
- Visible `focus-visible` outlines on all interactive elements.
---

## Getting started

### Prerequisites

- Node.js 20 or newer
- A [TMDB](https://www.themoviedb.org) account (free) for the API Read Access Token
- A [Firebase](https://console.firebase.google.com) project

### 1. Install

```bash
git clone https://github.com/<your-username>/Binaire-FreznelAI-Assessment.git
cd Binaire-FreznelAI-Assessment
npm install
```

### 2. Configure environment variables

```
VITE_TMDB_TOKEN=            # TMDB → Settings → API → "API Read Access Token" 
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=       # Firebase → Project settings → Your apps → web app config
```

Vite reads `.env` at startup, so restart the dev server after editing it.

### 3. Set up Firebase

1. **Authentication:** Build → Authentication → Get started → Sign-in method → enable **Email/Password**.
2. **Firestore:** Build → Firestore Database → Create database (Standard edition, production mode, a region near you).
3. **Rules:** open the Rules tab, paste the rules from [Authentication with Firebase](#authentication-with-firebase), and Publish.
4. **Authorised domains:** Authentication → Settings. `localhost` is allowed by default; add your deployed domain before going live.

### 4. Run

```bash
npm run dev       # http://localhost:5173
npm run build     # type-check and production build
npm run preview   # serve the production build
```
