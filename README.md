# SceneStream

Movies/tvshows rating web app using React.js, Express.js and TMDB api.

## Project structure:

### Backend:
```
└─ .
   ├─ .dockerignore
   ├─ .env
   ├─ .env.example
   ├─ dist
   │  ├─ src
   │  │  ├─ app.js
   │  │  ├─ config
   │  │  │  ├─ config.js
   │  │  │  └─ database.js
   │  │  ├─ controllers
   │  │  │  ├─ bookmarkController.js
   │  │  │  ├─ genreController.js
   │  │  │  ├─ movieController.js
   │  │  │  ├─ statisticsController.js
   │  │  │  ├─ tmdbController.js
   │  │  │  ├─ tvShowController.js
   │  │  │  └─ userController.js
   │  │  ├─ interfaces
   │  │  │  ├─ bookmark.interface.js
   │  │  │  ├─ discoverParams.interface.js
   │  │  │  ├─ genre.interface.js
   │  │  │  ├─ index.js
   │  │  │  ├─ movie.interface.js
   │  │  │  ├─ paginatedResponse.interface.js
   │  │  │  ├─ tmdb.interface.js
   │  │  │  ├─ tvShow.interface.js
   │  │  │  ├─ tvshowDetails.interface.js
   │  │  │  ├─ user.interface.js
   │  │  │  └─ video.interface.js
   │  │  ├─ middlewares
   │  │  │  ├─ authMiddleware.js
   │  │  │  └─ fileUpload.js
   │  │  ├─ models
   │  │  │  ├─ genre.model.js
   │  │  │  ├─ movie.model.js
   │  │  │  ├─ movieBookmark.model.js
   │  │  │  ├─ tvShow.model.js
   │  │  │  ├─ tvShowBookmark.model.js
   │  │  │  └─ user.model.js
   │  │  ├─ routes
   │  │  │  ├─ bookmarkRoutes.js
   │  │  │  ├─ genreRoutes.js
   │  │  │  ├─ index.js
   │  │  │  ├─ movieRoutes.js
   │  │  │  ├─ statisticsRoutes.js
   │  │  │  ├─ tmdbRoutes.js
   │  │  │  ├─ tvShowRoutes.js
   │  │  │  └─ userRoutes.js
   │  │  ├─ scripts
   │  │  │  └─ seedDatabase.js
   │  │  ├─ server.js
   │  │  ├─ services
   │  │  │  ├─ bookmarkService.js
   │  │  │  ├─ genreService.js
   │  │  │  ├─ movieService.js
   │  │  │  ├─ statisticsService.js
   │  │  │  ├─ tmdbService.js
   │  │  │  ├─ tvShowService.js
   │  │  │  └─ userService.js
   │  │  └─ utils
   │  │     ├─ catchAsync.js
   │  │     ├─ errors.js
   │  │     ├─ logger.js
   │  │     └─ verifyCognitoToken.js
   │  └─ tests
   │     └─ unit
   │        ├─ genreController.test.js
   │        ├─ genreService.test.js
   │        ├─ movieController.test.js
   │        ├─ movieService.test.js
   │        ├─ tvShowController.test.js
   │        ├─ tvShowService.test.js
   │        ├─ userController.test.js
   │        └─ userService.test.js
   ├─ Dockerfile
   ├─ jest.config.js
   ├─ nodemon.json
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ app.ts
   │  ├─ config
   │  │  ├─ config.ts
   │  │  └─ database.ts
   │  ├─ controllers
   │  │  ├─ bookmarkController.ts
   │  │  ├─ genreController.ts
   │  │  ├─ movieController.ts
   │  │  ├─ statisticsController.ts
   │  │  ├─ tmdbController.ts
   │  │  ├─ tvShowController.ts
   │  │  └─ userController.ts
   │  ├─ interfaces
   │  │  ├─ bookmark.interface.ts
   │  │  ├─ discoverParams.interface.ts
   │  │  ├─ genre.interface.ts
   │  │  ├─ index.ts
   │  │  ├─ movie.interface.ts
   │  │  ├─ paginatedResponse.interface.ts
   │  │  ├─ tmdb.interface.ts
   │  │  ├─ tvShow.interface.ts
   │  │  ├─ tvshowDetails.interface.ts
   │  │  ├─ user.interface.ts
   │  │  └─ video.interface.ts
   │  ├─ middlewares
   │  │  ├─ authMiddleware.ts
   │  │  └─ fileUpload.ts
   │  ├─ models
   │  │  ├─ genre.model.ts
   │  │  ├─ movie.model.ts
   │  │  ├─ movieBookmark.model.ts
   │  │  ├─ tvShow.model.ts
   │  │  ├─ tvShowBookmark.model.ts
   │  │  └─ user.model.ts
   │  ├─ routes
   │  │  ├─ bookmarkRoutes.ts
   │  │  ├─ genreRoutes.ts
   │  │  ├─ index.ts
   │  │  ├─ movieRoutes.ts
   │  │  ├─ statisticsRoutes.ts
   │  │  ├─ tmdbRoutes.ts
   │  │  ├─ tvShowRoutes.ts
   │  │  └─ userRoutes.ts
   │  ├─ scripts
   │  │  └─ seedDatabase.ts
   │  ├─ server.ts
   │  ├─ services
   │  │  ├─ bookmarkService.ts
   │  │  ├─ genreService.ts
   │  │  ├─ movieService.ts
   │  │  ├─ statisticsService.ts
   │  │  ├─ tmdbService.ts
   │  │  ├─ tvShowService.ts
   │  │  └─ userService.ts
   │  ├─ types
   │  │  └─ express.d.ts
   │  └─ utils
   │     ├─ catchAsync.ts
   │     ├─ errors.ts
   │     ├─ logger.ts
   │     └─ verifyCognitoToken.ts
   ├─ tests
   │  └─ unit
   │     ├─ genreController.test.ts
   │     ├─ genreService.test.ts
   │     ├─ movieController.test.ts
   │     ├─ movieService.test.ts
   │     ├─ tvShowController.test.ts
   │     ├─ tvShowService.test.ts
   │     ├─ userController.test.ts
   │     └─ userService.test.ts
   └─ tsconfig.json

```

### Frontend structure:
```
└─ .
   ├─ .env
   ├─ .env.example
   ├─ dist
   │  ├─ assets
   │  │  ├─ index-CAmc35Bt.js
   │  │  └─ index-nzoZGbPV.css
   │  ├─ images
   │  │  └─ devices-mockup.jpg
   │  ├─ index.html
   │  ├─ movie.svg
   │  └─ vite.svg
   ├─ Dockerfile
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.js
   ├─ public
   │  ├─ images
   │  │  └─ devices-mockup.jpg
   │  └─ movie.svg
   ├─ src
   │  ├─ App.tsx
   │  ├─ components
   │  │  ├─ admin
   │  │  │  ├─ AdminHeader.tsx
   │  │  │  └─ AdminSidebar.tsx
   │  │  ├─ cards
   │  │  │  └─ FeatureCard.tsx
   │  │  ├─ common
   │  │  │  ├─ Loading.tsx
   │  │  │  └─ TrailerModal.tsx
   │  │  ├─ confirmationDialog
   │  │  │  └─ ConfirmationDialog.tsx
   │  │  ├─ debug
   │  │  │  └─ TokenDebugger.tsx
   │  │  ├─ features
   │  │  │  └─ Features.tsx
   │  │  ├─ footer
   │  │  │  └─ Footer.tsx
   │  │  ├─ header
   │  │  │  └─ Header.tsx
   │  │  ├─ home
   │  │  │  ├─ DeviceSection.tsx
   │  │  │  ├─ FeaturesGrid.tsx
   │  │  │  ├─ HeroSection.tsx
   │  │  │  └─ PopularTitles.tsx
   │  │  ├─ layout
   │  │  │  ├─ AdminLayout.tsx
   │  │  │  └─ Layout.tsx
   │  │  ├─ movie
   │  │  │  ├─ Cast.tsx
   │  │  │  ├─ MovieCard.tsx
   │  │  │  └─ SimilarMovies.tsx
   │  │  ├─ tv
   │  │  │  ├─ Cast.tsx
   │  │  │  ├─ SimilarShows.tsx
   │  │  │  └─ TvShowCard.tsx
   │  │  ├─ ui
   │  │  │  ├─ Badge.tsx
   │  │  │  ├─ Button.tsx
   │  │  │  ├─ Checkbox.tsx
   │  │  │  ├─ Dropdown-menu.tsx
   │  │  │  ├─ Input.tsx
   │  │  │  ├─ Table.tsx
   │  │  │  ├─ TableButton.tsx
   │  │  │  └─ TextInput.tsx
   │  │  └─ unauthorized
   │  │     └─ Unauthorized.tsx
   │  ├─ config
   │  │  └─ amplify.ts
   │  ├─ contexts
   │  │  ├─ AuthContext.tsx
   │  │  └─ DarkModeContext.tsx
   │  ├─ guards
   │  │  ├─ AdminGuard.tsx
   │  │  ├─ AuthGuard.tsx
   │  │  └─ UnauthGuard.tsx
   │  ├─ hooks
   │  │  └─ useBookmarks.ts
   │  ├─ index.css
   │  ├─ interfaces
   │  │  ├─ api-response.interface.ts
   │  │  ├─ bookmarkedMovie.ts
   │  │  ├─ browse.interface.ts
   │  │  ├─ credit.interface.ts
   │  │  ├─ genre.interface.ts
   │  │  ├─ index.ts
   │  │  ├─ movie-details.interface.ts
   │  │  ├─ movie.interface.ts
   │  │  ├─ movies-section.interface.ts
   │  │  ├─ tv.interface.ts
   │  │  ├─ tvshow-details.interface.ts
   │  │  ├─ utility.interface.ts
   │  │  └─ video.interface.ts
   │  ├─ lib
   │  │  └─ utils.ts
   │  ├─ main.tsx
   │  ├─ pages
   │  │  ├─ admin
   │  │  │  ├─ Dashboard.tsx
   │  │  │  ├─ genres
   │  │  │  │  ├─ CreateGenre.tsx
   │  │  │  │  ├─ GenreDetails.tsx
   │  │  │  │  ├─ Genres.tsx
   │  │  │  │  └─ UpdateGenre.tsx
   │  │  │  ├─ movies
   │  │  │  │  ├─ CreateMovie.tsx
   │  │  │  │  ├─ MovieDetails.tsx
   │  │  │  │  ├─ Movies.tsx
   │  │  │  │  └─ UpdateMovie.tsx
   │  │  │  ├─ tvshows
   │  │  │  │  ├─ CreateTvShow.tsx
   │  │  │  │  ├─ TvshowDetails.tsx
   │  │  │  │  ├─ Tvshows.tsx
   │  │  │  │  └─ UpdateTvshow.tsx
   │  │  │  └─ users
   │  │  │     └─ Users.tsx
   │  │  ├─ auth
   │  │  │  ├─ ConfirmEmail.tsx
   │  │  │  ├─ ForgotPassword.tsx
   │  │  │  ├─ Login.tsx
   │  │  │  ├─ Register.tsx
   │  │  │  └─ ResetPassword.tsx
   │  │  ├─ bookmark
   │  │  │  └─ Bookmarks.tsx
   │  │  ├─ browse
   │  │  │  └─ Browse.tsx
   │  │  ├─ error
   │  │  │  └─ NotFound.tsx
   │  │  ├─ home
   │  │  │  └─ Home.tsx
   │  │  ├─ movie
   │  │  │  ├─ MovieDetails.tsx
   │  │  │  └─ Movies.tsx
   │  │  ├─ pricing
   │  │  │  └─ Pricing.tsx
   │  │  ├─ profile
   │  │  │  └─ Profile.tsx
   │  │  └─ tv
   │  │     ├─ TvShowDetails.tsx
   │  │     └─ TvShows.tsx
   │  ├─ routes
   │  │  ├─ adminRoutes.tsx
   │  │  ├─ index.tsx
   │  │  ├─ privateRoutes.tsx
   │  │  └─ publicRoutes.tsx
   │  ├─ services
   │  │  ├─ api.ts
   │  │  ├─ BookmarkService.ts
   │  │  ├─ GenreService.ts
   │  │  ├─ MovieService.ts
   │  │  ├─ StatisticsService.ts
   │  │  ├─ TvshowService.ts
   │  │  └─ UserService.ts
   │  ├─ utils
   │  │  └─ authUtils.ts
   │  └─ vite-env.d.ts
   ├─ tailwind.config.js
   ├─ tsconfig.app.json
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   ├─ vercel.json
   └─ vite.config.ts

```

## Jira:

[click here](https://lafhielismailcontact.atlassian.net/jira/software/projects/SCEN/boards/203/timeline)

## Presentation Link:

[click here]([https://lafhielismailcontact.atlassian.net/jira/software/projects/SCEN/boards/203/timeline](https://www.canva.com/design/DAGiXkBxTgA/c33cvCu7PbwZfVXuIiJWrw/edit?utm_content=DAGiXkBxTgA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton))

🛑🛑🛑 BEFORE EVEYTHING 🛑🛑🛑

Make sure Node.js is installed and configured

## How to run the application:

- First, clone the repository

```
git clone https://github.com/Ismail-Lafhiel/SceneStream.git
```
- Then, use `cd` to access to the `back_end` folder like this:
```
cd back_end
```
- First create .env file based on .env.example:

- After it, run:
```
npm install
```
- And to run the project, use:
 ```
npm run dev
```

✔✔ Repeat the file process for the frontend ✔✔
