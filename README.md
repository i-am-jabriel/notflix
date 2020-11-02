The idea is to make a mock version of netflix's front end by using https://www.themoviedb.org/ 's api

I wanted to see how far I could push javascript + html5 to provide a fully reactive front end service programmed in complete vanilla javascript.


Everything is created in javascript
* [✓] Render Data from the api
    * [✓] Generate Key Credientials
    * [✓] Resolve and Parse Objects
    * [✓] Display the results in cards
    * [✓] Make the cards Expand and have a mini-modal on hover
    * [✓] Make the cards have a full sized modal that pops up on clicking a card
    * [✓] Have the cards in a slider row that allows you to scroll many different catagories on one page

* [] TV / Movie Pages
    * [✓] Urls in navbar links to TV/Movie Page
    * [✓] Page has a variaty of shows rendered
    * [✓] User can pick a genre of tv/movie to search through
    * [] User can provide other filters to enhance searching ability

* [] My List
    * [✓] User can add any show or movie to their list by clicking on the card
    * [✓] User will be able to remove any show from their list
    * [✓] List will not contain duplicates
    * [✓] User can view a page with all of their favorites
    * [] List will be saved locally with cookies

* [✓] HTML5 Magic 
    * [✓] Every page has its own url
    * [✓] Every page pushes its own url to the navigational bar and history
    * [✓] 404 page redirects what would be a non-existant link to a page inside the app
    * [✓] Back button clears modals and correctly navigates to the correct page in app.