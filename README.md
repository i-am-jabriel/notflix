Live Site: https://i-am-jabriel.github.io/notflix/

The idea is to make a mock version of netflix's front end by using https://www.themoviedb.org/ 's api

I wanted to see how far I could push javascript + html5 to provide a fully reactive front end service programmed in complete vanilla javascript.


Everything is created in javascript
* [✓] Fetch & Render Data From The API
    * [✓] Generate Key Credientials
    * [✓] Resolve and Parse Objects
    * [✓] Display the results in cards
    * [✓] Make the cards Expand and have a mini-modal on hover
    * [✓] Make the cards have a full sized modal that pops up on clicking a card
    * [✓] Have the cards in a .slider-row that allows you to scroll many different catagories on one page

* [] TV / Movie Pages
    * [✓] Urls in navbar links to TV/Movie Page
    * [✓] Page has a variaty of shows rendered
    * [✓] User can pick a genre of tv/movie to search through
    * [] User can provide other filters to enhance searching ability
    * [] Pages choose from a vararity of content filters to keep options fresh

* [] My List
    * [✓] User can add any show or movie to their list by clicking on the card
    * [✓] User will be able to remove any show from their list
    * [✓] List will not contain duplicates
    * [✓] User can view a page with all of their favorites
    * [] List will be saved locally with cookies
    * [] User will be able to search/filter through their list

* [✓] Searching
    * [✓] Clicking the search button expands the search field
    * [✓] Can close the search field
    * [✓] Can search a specific query through the database
    * [✓] Search updates browser url
    * [✓] Displays results in a .flex.wrap
    * [✓] Filters any data that isn't a movie or tv show

* [✓] HTML5 Magic 
    * [✓] Every page has its own url
    * [✓] Every page pushes its own url to the navigational bar and history
    * [✓] 404 page redirects what would be a non-existant link to a page inside the app
    * [✓] Back button clears modals and correctly navigates to the correct page in app.

* [] Stretch Goals
    * [] Containers of cards can be infinitely scrolled
        * [] In .slider-rows loop through all avaliable content in both directions
        * [✓] In .row.wrap once scrolled to the bottom automatically load next page until all options are exhausted

    * [] Expanded Movie/Tv Cards
        * [] Add ability to rate movie/show
        * [] Show related movies/shows (with infinite scroll)

    * [] Ability to hotlink your list so you can share with friends
    * [] Main home pages have a video playing with the a transparent navbar that changes colors upon scrolling
    * [] Collect data on things favorited / movie ratings to suggest better videos / shows