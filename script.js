var body = document.querySelector('body');
var container = document.createElement('div');
var query = document.querySelector('#query');
var page = 0;
var view = 'multi-card';

var lastState;

document.addEventListener('submit',e=>{
    clearContainer();
    searchForMovies();
    e.preventDefault();
});
document.querySelector('#back').addEventListener('click',x=>{
    container.innerHTML = lastState;
    window.scrollTo(0,0);
    view = 'multi-card';
});

container.className = 'container';
body.appendChild(container);

function searchForMovies(){
    fetchng = true;
    //Target Dog API URL
    fetch(`http://www.omdbapi.com/?apikey=8bda2ab&s=${query.value || 'Batman'}&page=${++page}`)
    //Turn the response into a Javascript Object
    .then(res=>res.json())
    //Once  thats done begin to create a card for each object in the message
    .then(res=>{
        console.log(res);
        createCardForObjects(res.Search)
    });
    console.log(`http://www.omdbapi.com/?apikey=8bda2ab&s=${query.value || 'Batman'}&page=${page}`)
}
searchForMovies();

function getInfoOnCurrentMovie(id,card){
    fetch(`http://www.omdbapi.com/?apikey=8bda2ab&i=${id}`)
    //Turn the response into a Javascript Object
    .then(res=>res.json())
    //Once  thats done begin to create a card for each object in the message
    .then(res=>createCardForMovie(res,card));
}

function clearContainer(){
    page = 0;
    window.scrollTo(0,0);
    lastState = container.innerHTML;
    container.innerHTML = '';
}

var omittedKeys = ['Poster', 'imdbID','Ratings', 'Response', 'Type', 'totalSeasons'];
function createCardForMovie(res,card){
    view = 'single-card';
    clearContainer();
    card.removeEventListener('click',card.clickEvent);
    card.className = 'card single-view';
    if(res['Ratings'].length > 0){
        var ratings = document.createElement('div');
        var ratingsHeader = document.createElement('h3');
        ratingsHeader.innerText = 'Ratings:';
        ratingsHeader.className = 'ratings-header';
        ratings.appendChild(ratingsHeader);
        res['Ratings'].forEach(rating=>{
            var p = document.createElement('p');
            p.innerText =`${rating.Source}: ${rating.Value}`;
            p.className = 'ratings-text';
            ratings.appendChild(p);
        });
        card.appendChild(ratings);
    }
    console.log(res);
    
    card.appendChild(ratings);
    for(var x in res){
        if(res[x] == 'N/A' || omittedKeys.indexOf(x) != -1)continue;
        var desc = document.createElement('p');
        desc.className = 'movie-description'
        desc.innerText = `${x}: ${res[x]}`;
        card.appendChild(desc);
    }
    container.appendChild(card);
}
    
function createCardForObjects(arr){
    arr.forEach(obj=>{
        //create a div.card
        var card = document.createElement('div');
        obj.card = card;
        card.className = 'card';

        var title = document.createElement('h1');
        title.className = 'card-title';
        title.innerText = obj.Title;

        //create img in card
        var img = document.createElement('img');
        img.src = obj.Poster;
        imagesLoadedCount++;
        img.onload = onImageLoad;

        var desc = document.createElement('p');
        desc.innerText = obj.Year;

        card.appendChild(title);
        card.appendChild(img);
        card.appendChild(desc);

        card.clickEvent = x=>getInfoOnCurrentMovie(obj.imdbID, obj.card)
        card.addEventListener('click', card.clickEvent);

        //add card into container
        container.appendChild(card); 
    });
}
var imagesLoadedCount = 0;
function onImageLoad(){
    console.log(imagesLoadedCount);
    if(--imagesLoadedCount <= 1)fetching=false;
}

var fetching = false;
window.addEventListener('scroll',e=>{
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !fetching && view == 'multi-card'){
        searchForMovies();
        fetching=true;
    }
})