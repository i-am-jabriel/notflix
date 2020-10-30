var body = document.querySelector('body');
var container = document.createElement('div');
var query = document.querySelector('#query');
var apiKey = '465bc048ae9b7c45031771aae2b7ea0c';
var api =  'https://api.themoviedb.org/3';
var apiImage = 'https://image.tmdb.org/t/p/w500';
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

function loadTrendingMovies(){
    fetching = true;
    console.log(`${api}/trending/movies/week?api_key=${apiKey}`);
    //Target Dog API URL
    //fetch(`http://www.omdbapi.com/?apikey=8bda2ab&s=${query.value || 'Batman'}&page=${++page}`) - old
    fetch(`${api}/trending/movies/week?api_key=${apiKey}`)
    //Turn the response into a Javascript Object
    .then(res=>res.json())
    .catch(e=>console.warn('error',e))
    //Once  thats done begin to create a card for each object in the message
    .then(res=>{
        console.log(res);
        createCardForMovies(res.results)
    })
    .finally()

}
loadTrendingMovies();

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
    
function createCardForMovies(arr, title='Trending'){
    var row = document.createElement('div');
    row.className = 'cards row';
    arr.forEach(obj=>{
        //create a div.card
        var card = document.createElement('div');

        var inner = document.createElement('div');
        inner.className='card-container';

        obj.card = card;
        card.className = 'card';
        inner.style['background-image']=`url(${apiImage}/${obj.backdrop_path})`;

        var title = document.createElement('h3');
        title.className = 'card-title';
        title.innerText = obj.title || obj.original_name;

        //create img in card
        var img = document.createElement('img');
        img.src = `${apiImage}/${obj.poster_path}`;
        imagesLoadedCount++;
        img.onload = onImageLoad;

        var mini = document.createElement('div');
        mini.className = 'card-mini-modal';


        inner.appendChild(title);
        inner.appendChild(mini);
        //card.appendChild(img);
        card.appendChild(inner);
        card.clickEvent = x=>getInfoOnCurrentMovie(obj.imdbID, obj.card)
        card.addEventListener('click', card.clickEvent);

        //add card into container
        row.appendChild(card); 
    });
    var rowTitle = document.createElement('h2')
    rowTitle.className = 'row-title';
    rowTitle.innerText = title;

    var outer = document.createElement('div');
    outer.className ='slider-row';
    outer.appendChild(rowTitle);
    outer.appendChild(row);

    container.appendChild(outer);
}
var imagesLoadedCount = 0;
function onImageLoad(){
    if(--imagesLoadedCount <= 1)fetching=false;
}
var fetching = false;
/*window.addEventListener('scroll',e=>{
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !fetching && view == 'multi-card'){
        loadTrendingMovies();
        fetching=true;
    }
})*/