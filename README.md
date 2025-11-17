1. [Overview](#overview)
2. [Server Side vs Client Side React](#server-side-vs-client-side-react)
3. [Next pathName Hook](#next-pathname-hook)
   1. [Initial Implementation](#initial-implementation)
   2. [Alternative Implementation](#alternative-implementation)
4. [Dynamic Content Overview](#dynamic-content-overview)
   1. [MealGrid Component](#mealgrid-component)
   2. [MealItem Component](#mealitem-component)
5. [SQLLite Database Implementation](#sqllite-database-implementation)
   1. [As Installed in the App](#as-installed-in-the-app)
   2. [Server Side Component Notes](#server-side-component-notes)
   3. [Implementing the meals Database](#implementing-the-meals-database)
   4. [The Loading Message](#the-loading-message)
   5. [Using the Suspense Component](#using-the-suspense-component)
6. [Reserved Pages](#reserved-pages)
   1. [Error Handling](#error-handling)
   2. [Not Found Error Page](#not-found-error-page)
   3. [Not Found Next Navigation Function](#not-found-next-navigation-function)
7. [Dynamic Page Routing](#dynamic-page-routing)
   1. [Using the mealSlug Parameter](#using-the-mealslug-parameter)
   2. [Using dangerouslySetInnerHTML](#using-dangerouslysetinnerhtml)

---

# Overview

This is a build of a nextJS Foodies project that will capture post of food recipes. There are pages for favorite meals, and a Foodies community containing the meal shared in the food posts. Below is the Home page output.

![](./docs/95-next-level-food-main-page.png)

The project is structured such that Next pages are separated into the `@/app` folder (of course) for things that Next will route and React components in the `@/components` folder.

In the `app` folder there are two principal folders: `community` and `meals`. Within meals there are sub-folders, one of them with dynamic content. 

![](./docs/96-project-structure.png)

# Server Side vs Client Side React
React components will be rendered (or pre-rendered) by Next but some can only execute in the browser.

![](./docs/108-rsc-and-cs-react-use-client.png)

- React components with `useEffect` or `useState`, for example
- Another case are `event handlers` (e.g. **1. [Overview](#overview)
2. [Server Side vs Client Side React](#server-side-vs-client-side-react)
**) requiring user interaction
- A `'use client';` directive must be added to the client side component to differentiate a client side React component. 

# Next pathName Hook

The `main-header.js` displays various links at the top of the page (*Browse Meals* and *Foodies Community*). They should be highlighted if the user navigates to either of those two pages. It's easy to do with the use of the Next `usePathname` hook. 

## Initial Implementation

The example below sets the CSS `active` class based on the path name returned from the hook. The main-header.js file is defined with the use client directive. **This approach works, but see the alternative implementation.**

```javascript
'use client';
import { usePathname } from "next/navigation";
...
export default function MainHeader() {
  const pathName = usePathname();
  return (
  ...
        <nav className={ styles.nav }>
          <ul>
            <li>
              <Link href="/meals" className={ pathName.startsWith("/meals") ? styles.active : undefined }>Browse Meals</Link>
            </li>
            <li>
              <Link href="/community" className={ pathName === "/community" ? styles.active : undefined }>Foodies Community</Link>
            </li>
          </ul>
  
```

## Alternative Implementation

It's only the links **li elements** that need the `use client` directive. Therefore, a new component called `NavLink` was created to implement the `li` elements that require client side rendering. 

A little refactoring produced the NavLink client side component show below. A separate `nav-link.module.css` file was created to contain the `active` CSS class.

```javascript
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav-link.module.css';

export default function NavLink({ href, children }) {
  const pathName = usePathname();
  return (
    <li>
      <Link
        href={ href }
        className={ pathName.startsWith(href) ? styles.active : undefined }>
        { children }
      </Link>
    </li>

  );
}
```

The updated main-header nav element was simplified to the snippet below. The 'use client' directive was removed.

```javascript
        <nav className={ styles.nav }>
          <ul>
            <NavLink href="/meals">
              Browse Meals
            </NavLink>
            <NavLink href="/community">
              Foodies Community
            </NavLink>
          </ul>
        </nav>
```

# Dynamic Content Overview

A `slug` refers web development term to refer to a human-readable, URL-friendly content, such as a blog post, product, or category page. For example, in the URL `www.myblog.com/blogs/tossed-salad`, `tossed-salad` is the slug.  It's the **part of the URL that specifically identifies a dynamic resource**.  

As shown below, the `[mealSlug]` identifier provides this project with a means to dynamically create instances of meal blog submissions. This section only covers how to render the blogs on a page. 

How to create the `mealSlug` page content itself is described in the [dynamic page routing](#dynamic-page-routing) section further down. 

![](./docs/107-dynamic-routing-slug.png)

## MealGrid Component

The *@/components/meals/meals-grid.js* file contains the `MealsGrid` component that produces a list of meal blogs which are to be retrieved from a database covered in the next section. As shown below, the component get a props parameter containing an array of meals, and each meal is sent to a `MealItem`. 

```javascript
export default function MealsGrid({ meals }) {
  return (
    <ul className={ style.meals }>
      { meals.map((meal) =>
        <li key={ meal.id }>
          <MealItem { ...meal } />
        </li>
      ) }
    </ul>
    ...
  );
```

**Note**: Notice the use of the javascript **spread operator** to cast name/value property pairs to MealItem.

## MealItem Component

The code in the @/components/meals/meal-item.js file simply renders the individual meal blog properties. However, the use of the slug property in the Link references that meal blog dynamically to the user.

```javascript
export default function MealItem({ title, slug, image, summary, creator }) {
  return (
    <article className={ classes.meal }>
      ...
      <div className={ classes.content }>
        <p className={ classes.summary }>{ summary }</p>
        <div className={ classes.actions }>
          <Link href={ `/meals/${ slug }` }>View Blog Details</Link>
        </div>
      </div>
    </article>
  );
}
```

# SQLLite Database Implementation

The Meal images are to be retrieved from a development database (not production quality). Since Next is a fullstack framework, this allows us to implement server side functionality in the app. The `better-sqlite3` package (v12) performs its operations synchronously, avoiding async loop complexity, as is the case with `node-sqlite3`. Overall performance is better with this package as well. When not to use better-sqlite3?

- You have many concurrent writes (e.g., a social media platform).
- You’re serving large read data (e.g., video streams).
- Your database is approaching terabyte size.

## As Installed in the App

- In a terminal ran the `npm install better-sqlite3` command. 
- Added `initdb.js` in the project root directory that contains the database setup.
- In a terminal, ran `node initdb.js` command to create `meals.db` (also in the root directory);

## Server Side Component Notes

In Next when defining a component it can be defined as `async` because the all Next components by default run on the server side (except those with the 'use client' declaration). In the case of better-sqlite3 it's not necessary because the requests run asynchronously. However, given we are retrieving database records, latency could be a factor, so the server side React component could be prefixed with the `async` keyword.

## Implementing the meals Database

1. Create a `@/lib/meals.js` component containing the SQL to select all rows, as shown below.

  ```javascript
    import sql from 'better-sqlite3';
    const db = sql('meals.db');

      export async function getMeals() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return db.prepare('SELECT * FROM meals').all();
  }
  ```
**Note**: The `await` containing the `setTimeout` function were not needed, nor the `async` qualifier on the function but were added to test a page loading message.

2. In the page.js file for the main meals page, the following was added to produce a grid containing the meals from the database.
  ```javascript
  export default async function MealsPage() {
    const meals = await getMeals();
    ...
    return (
        <main className={ styles.main }>
          <MealsGrid meals={ meals } />
        </main>
        ...
    );
  ```

## The Loading Message

Displaying a "loading" mesage is a Next feature (via the **React Suspense component**) that provides a fallback until all of its children have finished loading. In our case, Next will run a `loading.js` file whilst retrieving the meal records from the database. 

1. Next to the page accessing the database add a `loading.js` file.
2. Add some content to the new file, using an optional CSS file for formatting.

    ```javascript
    import styles from './loading.module.css';

      export default function LoadingMealsPage() {
      return (
        <p className={ styles.loading }>Loading meals...</p>
      )};
    ```

3. Although a server component by default, it can be used on the client side through a `use client` directive.

## Using the Suspense Component

Alternatively to the loading.js file, the Suspense component can be added to the page where there may be a need for a loading message and wrap that functionality in the `<Suspense>` component.

Note: It's a little more work but in this case there were parts of the page that were not being shown using the loading.js file approch. Using the Suspense component however, the loading message will be shown below some information that should be shown on the page (e.g. the Share Your Favorite Recipe button).

1. **Rename the loading.js file**, as it is a reserved file name for Next.
2. Create an embedded component (e.g. `GetMeals`) inside page.js and move the database retrieval and return output into it, as shown below.

    ```javascript
    export default function MealsPage() {
      async function GetMeals() {
        const meals = await getMeals();
        return (
          <MealsGrid meals={ meals } />
        );
      }
      ...
    ```

3. Import the React `<Suspense>` component and where the MealsGrid used to be performed, replace it with the Suspense and GetMeals components, as shown below.
  
```javascript
  ...
  <main className={ styles.main }>
    <Suspense fallback={ <p className={ styles.loading }>Loading meals...</p> }>
      <GetMeals />
    </Suspense>
  </main>
  ...
```

4. It was necessary to copy the CSS style info from the `loading.module.css` file into the `page.module.css` file as well.

Now only the content not affected by the loading will be rendered.

![](./docs/111-Loading-with-Suspense.png)

# Reserved Pages

Other than page.js, there are several other pages that have special purposes for error handling and not-found conditions.

## Error Handling

The `error.js` file can be used to provide information when an error occurs, e.g. retrieving meal data. This file be be rendered depending on where it is located in the app project. In our case, in the `@/app/meals` directory. 

  ```javascript
  'use client';
  export default function Error({ error }) {
    return (
      <main>
        <h3>An error has occurred!</h3>
        <p>Unable to retrieve Meals data from the database.</p>
      </main>
    )
  }
  ```

  **Note**: Next assumes the error.js file can be used for both server- and client-side rendering so the `use client` directive must be specified for the error page.

## Not Found Error Page

Like the error page, the not-found.js file can be located anywhere. Generally it is located in the root directory so it is used globally.

```javascript
export default function NotFound() {
  return (
    <main className="notFound">
      <h4>Not Found Error!</h4>
      <p>The request page or resource was not found.</p>
    </main>

  );
}
```
## Not Found Next Navigation Function

Conditional logic can implement the not-found.js page functionality as well. Take this case where not finding a meal blog should render not-found messaging.

```javascript
import { notFound } from 'next/navigation';

export default async function MealDetails({ params }) {
  const { mealSlug } = await params;
  const mealBlog = getMeal(mealSlug);
  if (!mealBlog) {
    notFound();
  }
  ... // remainder of logic is bypassed if no meal blog returned
```

# Dynamic Page Routing

In the project there are meal blogs saved in a database that represent blogs submitted by foodies. 

## Using the mealSlug Parameter

The `app/meals/[mealSlog]` is where such dynamic content can be rendered for the blog submissions. The `mealSlog` in the page URL provides an identifier of a meal blog that can be returned from the database containing the blogs.

```javascript
export default async function MealDetails({ params }) {
  const { mealSlug } = await params;
  const mealBlog = getMeal(mealSlug);
  ...
```

The `@/lib/meals.js` file contains a function that returns the meal blog details. (A parameter is bound in the query to prevent sql injection.)

```javascript
export async function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug=?').get(slug);
}
```

**Notes**: 

- The `mealSlug` parameter represents a human-readable, distinct url parameter that identifies the dynamic meal blog entry in the database.

-  To retrieve `mealSlug` from the `params` property requires a promise (i.e. `await`), which requires the page.js function to be `async`.
-  

## Using dangerouslySetInnerHTML 

The name of the React `dangerouslySetInnerHTML` attribute (extension of HTML element `innerHTML`) is a reminder that use of it could possibly expose javascript vulnerabilities if missused. In the case of this project however, the innerHTML was being used to display meal blog HTML instructions. 

```javascript
...
const brInstructions = mealBlog.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={ styles.header }>
        <div className={ styles.image }>
          <Image src={ mealBlog.image } fill alt={ mealBlog.title } />
        </div>
        <div className={ styles.headerText }>
          <h1>{ mealBlog.title }</h1>
          <p className={ styles.creator }>
            by <a href={ `mailto:${ mealBlog.creatorEmail }` }>{ mealBlog.creator }</a>
          </p>
          <p className={ styles.summary }>{ mealBlog.summary }</p>
        </div>
      </header>
      <main>
        <p className={ styles.instructions } dangerouslySetInnerHTML={ {
          __html: brInstructions,
        } }>

        </p>
      </main>
    </>
  );
}
```
