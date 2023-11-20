# Vu Son's Movie Database

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

This project allows users to search for movies by title, view details about each movie, and filter movies by genre. The project should be accessible, well-documented, and hosted online.

### The challenge

2. Filter by Genre:

   - Implement a select/dropdown element to filter movies by genre.
   - Users should be able to choose a genre from the select menu to filter the displayed movies.

3. Accessibility:

   - Ensure that the application is fully accessible, following WCAG guidelines.
   - Use semantic HTML elements, alt text for images, and ARIA attributes for interactive elements.

4. Additional Features (Choose at least 2):
   - Implement Photo carousel in the Hero Section to represent at least 4 popular movies as banners.
   - Implement pagination for search results. (1,2,3,4...last)
   - Include a dark mode or theme switcher.
   - Implement user authentication.

Requirements:

- Use plain HTML, CSS, and JavaScript.
- Use popular libraries for specific features (e.g., Axios for API requests, a carousel library, a modal library, CSS frameworks,...).
- Host the project on a platform like GitHub Pages, Netlify, or Vercel so it's accessible online.
- Write clear and concise documentation on how to install and run the project locally.

Users should be able to:

- View the optimal layout depending on their device's screen size
- See hover states for interactive elements

### Screenshot

![](./screenshot1.png)
![](./screenshot2.png)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

There are 2 main parts for this project:
I. Recently Release
II. Search Movies

I. Recently Release

- In this part, whenever user come to my page, it displays 10 recenlty movies. Everytime the page refresh, it get 10 other recently movies
- When user search for movies, this 'Recently Release' will be disapear and the search result will appear
- The API call return 20 recently movies. i use function `uniqueRandomMovies()` to generate 10 random number from 0 - 19 and call it whenever the page refreshes

II. Search Movies

II.1. Search bar

- I make a search bar so that the 'Enter' button looks like inside the search text. When user input keywords, the placeholder of input text will change to that keyword

II.2. Search result

- This part will appear when user searching for movie, it will replace 'Recently Release' part
- There is some movie with no image, release_date, genre,... So I make empty string for thoese data for some movies

II.3.Sort

- API call return objects in array. I declare global variable `searchResults` to receive the data and sort it. Then use the result to sort movies

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- JavaScript

### What I learned

Use this section to recap over some of your major learnings while working through this project. Writing these out and providing code samples of areas you want to highlight is a great way to reinforce your own knowledge.

To see how you can add code snippets, see below:

```html
<h1>Some HTML code I'm proud of</h1>
```

```css
.proud-of-this-css {
  color: papayawhip;
}
```

```js
// Generate a random-unique number from 0 - 19
const uniqueRandomMovies = () => {
  const movies = new Set();
  while (movies.size < 10) {
    movies.add(Math.floor(Math.random() * 19 + 1));
  }
  return [...movies];
};
```

If you want more help with writing markdown, we'd recommend checking out [The Markdown Guide](https://www.markdownguide.org/) to learn more.

**Note: Delete this note and the content within this section and replace with your own learnings.**

### Continued development

Use this section to outline areas that you want to continue focusing on in future projects. These could be concepts you're still not completely comfortable with or techniques you found useful that you want to refine and perfect.

**Note: Delete this note and the content within this section and replace with your own plans for continued development.**

### Useful resources

- [Movie API](https://developer.themoviedb.org/docs) - I get movie database by calling API from this website

https://developer.themoviedb.org/docs/finding-data -(search/discover/find)

https://www.w3schools.com/css/tryit.asp?filename=trycss_image_modal_js (modal)

https://stackoverflow.com/a/25435422 (Pagination)

- [Example resource 2](https://www.example.com) - This is an amazing article which helped me finally understand XYZ. I'd recommend it to anyone still learning this concept.

**Note: Delete this note and replace the list above with resources that helped you during the challenge. These could come in handy for anyone viewing your solution or for yourself when you look back on this project in the future.**

## Author

- Vu Son

## Acknowledgments

This is where you can give a hat tip to anyone who helped you out on this project. Perhaps you worked in a team or got some inspiration from someone else's solution. This is the perfect place to give them some credit.

**Note: Delete this note and edit this section's content as necessary. If you completed this challenge by yourself, feel free to delete this section entirely.**
