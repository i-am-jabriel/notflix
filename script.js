var body = document.querySelector('body');
var container = document.createElement('div');
var search = document.querySelector('#search');
var modal = document.querySelector('#modal');
var modalWindow = document.querySelector('#modal-window');
var apiKey = '465bc048ae9b7c45031771aae2b7ea0c';
var api =  'https://api.themoviedb.org/3';
var apiImage = 'https://image.tmdb.org/t/p/w500';
var page = 0;
var view = 'multi-card';

console.log('v 0.001b');  

var lastState;
document.querySelector('#modal-background').addEventListener('click', ()=>closeModal());
window.addEventListener('keyup',e=>{
    if(e.key == 'Escape')closeModal()
})

container.className = 'container';
body.appendChild(container);

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
function loadModalData(type, id){
    if(!type){
        var url = state.page.split('/');
        type = url[2];
        id = url[3];
    }
    fetch(`${api}/${type}/${id}?api_key=${apiKey}`)
    .then(r=>r.json()).then(res=>displayModalForObj(res, type));
    
}
function displayModalForObj(obj, type){
    state.lastPage = state.page;
    state.lastRoot = state.root;
    state.root = `/notflix/browse/`;
    navigateToPage(state.root+`${type}/${obj.id}`, false);
    var img =  obj.backdrop_path || obj.poster_path;
    var date = obj.release_date || obj.first_air_date;
    img = img ? `style='background-image:url(${apiImage}/${img})'` : '';
    date = date? `Release Date: ${date}` :'';
    var desc = obj.overview;
    desc = desc ? `<p>${desc}</p>`:'';
    modalWindow.innerHTML = `
<img class='modal-header' ${img}/>
<div class='modal-container'>
    <div class='col'>
        <h3 class='modal-title'>${obj.name || obj.title}</h3>
        <div class='row'>
            <p>Rating: ${obj.vote_average*10}% ${date}</p>
            ${desc}
        </div>
    </div>
</div>`;
    modal.className = 'active';
}
function closeModal(){
    modal.className = '';
    state.root = state.lastRoot;
    navigateToPage(state.lastPage, false);
}
function createCardForObjects(arr, title='Trending', type='movie'){
    var row = document.createElement('div');
    row.className = 'cards row';
    arr.forEach(obj=>{
        //create a div.card
        var card = document.createElement('div');

        var inner = document.createElement('div');
        inner.className='card-container';

        obj.card = card;
        card.className = 'card';
        var img = obj.backdrop_path || obj.poster_path;
        if(img)inner.style['background-image']=`url(${apiImage}/${img})`;

        var title = document.createElement('h3');
        title.className = 'card-title';
        title.innerText = obj.title || obj.original_name;

        //create img in card
        /*
        var img = document.createElement('img');
        img.src = `${apiImage}/${obj.poster_path}`;
        imagesLoadedCount++;
        img.onload = onImageLoad;
        */

        var mini = document.createElement('div');
        mini.className = 'card-mini-modal';
        mini.innerHTML=`
        <div class='row'>
            <i class="fas fa-play active"></i>
            <i class="fas fa-check"></i>
            <i class="fas fa-thumbs-up"></i>
            <i class="fas fa-thumbs-down"></i>
            <i class="fas fa-angle-down end"></i>
        </div>
        <div class='row'>
            Rating: ${obj.vote_average*10}%
        </div>
        <div class='row'>
            <p class='genres'>Genres: ${getGenres(obj.genre_ids)}</p>
        </div>
        `;


        inner.appendChild(title);
        inner.appendChild(mini);
        //card.appendChild(img);
        card.appendChild(inner);
        card.clickEvent = x=> loadModalData(type, obj.id)
        card.addEventListener('click', card.clickEvent);

        //add card into container
        row.appendChild(card); 
    });
    var rowTitle = document.createElement('h2')
    rowTitle.className = 'row-title';
    rowTitle.innerText = title;

    var outer = document.createElement('div');
    outer.className ='slider-row';
    outer.appendChild(row);
    
    container.appendChild(rowTitle);
    container.appendChild(outer);
}
var imagesLoadedCount = 0;
function onImageLoad(){
    if(--imagesLoadedCount <= 1)fetching=false;
}
function getGenres(ids){
    return ids.map((id)=>{
        var genre = genres[genres.findIndex(g=>g.id==id)]
        return genre?genre.name:null;
    }).filter(a=>a).join('<span class=\'gray\'> • </span>');

}
var fetching = false;
/*window.addEventListener('scroll',e=>{
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !fetching && view == 'multi-card'){
        loadTrendingMovies();
        fetching=true;
    }
})*/
var genres, tvGenres, movieGenres;
fetch(`${api}/genre/movie/list?api_key=${apiKey}`).then(res=>res.json())
    .then(r1=>{
        genres = [...r1.genres];
        movieGenres = r1.genres;
        fetch(`${api}/genre/tv/list?api_key=${apiKey}`).then(r=>r.json()).then(r2=>{
            genres.push(...r2.genres);
            tvGenres = r2.genres;
            var page = window.location.hash ? 
                '/notflix/' + window.location.hash.substring(1,window.location.hash.length) : undefined;
            console.log(page);
            navigateToPage(page);
        });
    });

function displayHomePage(){
    state.root = '/notflix/';
    loadTrendingMovies();
    loadPopularMovies();
    loadPopularMovies('vote_average.desc', 'Fan Favorites');
    loadPopularMovies('revenue.desc', 'Critically Acclaimed');
    loadPopularMovies('vote_count.desc', 'Buzzworthy')
}
function displayTvPage(){
    state.root = '/notflix/tv/';
    var url = state.page.split('/',-1);
    displayGenrePicker('TV Shows',url[3]);
    if(url.length<5){
        loadTrendingTV();
        loadPopularTV();
        loadPopularTV('vote_average.desc', 'Classics');
    }else if(url.length==5){
        var params = `&with_genres=${url[3]}`;
        loadPopularTV('vote_average.desc', 'Classics', params);
        loadPopularTV('popularity.desc', 'Popular', params);
    }
}

function displayMoviePage(){
    state.root = '/notflix/movies/';
    var url = state.page.split('/',-1);
    displayGenrePicker('Movies',url[3]);
    if(url.length<5){
        loadTrendingMovies();
        loadPopularMovies();
        loadPopularMovies('vote_average.desc', 'Fan Favorites');
        loadPopularMovies('revenue.desc', 'Critically Acclaimed');
        loadPopularMovies('vote_count.desc', 'Buzzworthy')
    }else if(url.length==5){
        var params = `&with_genres=${url[3]}`;
        loadPopularTV('vote_average.desc', 'Classics', params);
        loadPopularTV('popularity.desc', 'Popular', params);
    }
}

function displayGenrePicker(title, currentId){
    var g = (title=='TV Shows'?tvGenres:movieGenres);
    var div = document.createElement('div');
    div.className='page-header row';
    div.innerHTML=`<h1 class='genre-title'>${title}</h1>
        <select id='genre-selector'>
            ${g.reduce((a,genre)=>a+`<option value='${genre.id}' ${currentId==genre.id?'selected':''}>${genre.name}</option>`,'')}
        </select>`;
    container.appendChild(div);
    document.querySelector('#genre-selector').addEventListener('change',x=>{
        navigateToPage(state.root+x.target.value+'/');
    });
}
function loadTrendingMovies(){
   fetch(`${api}/trending/movies/week?api_key=${apiKey}`)
    .then(res=>res.json())
    .then(res=>createCardForObjects(res.results))
}
function loadTrendingTV(){
    fetch(`${api}/trending/tv/week?api_key=${apiKey}`)
     .then(res=>res.json())
     .then(res=>createCardForObjects(res.results, undefined,'tv'))
 }
function loadPopularMovies(sort = 'popularity.desc', title = 'Popular in US', params = ''){
    // console.log(`${api}/discover/movie?api_key=${apiKey}&sort_by=${sort}&include_adult=false${params}`)
    fetch(`${api}/discover/movie?api_key=${apiKey}&sort_by=${sort}&include_adult=false${params}`)
        .then(res=>res.json())
        .then(res=>{
            // console.log(res);
            createCardForObjects(res.results, title);
        });
}
function loadPopularTV(sort = 'popularity.desc', title = 'Trending TV', params = ''){
    // console.log(`${api}/discover/tv?api_key=${apiKey}&sort_by=${sort}&include_adult=false${params}`)
    fetch(`${api}/discover/tv?api_key=${apiKey}&sort_by=${sort}&include_adult=false${params}`)
        .then(res=>res.json())
        .then(res=>{
            // console.log(res);
            createCardForObjects(res.results, title, 'tv');
        });
}

var lastPage = '/notflix/';
var state = {};
function navigateToPage(page = '/notflix/', andPopulate = true){
    state.page = page;
    if(andPopulate)populatePage();
    history.pushState(state, '', `${window.origin}${page}`);
}

window.addEventListener('popstate',e=>{
    if(e.state)state = e.state;
    if(modal.className)closeModal();
    else populatePage();
});

function populatePage(){
    clearContainer();
    // console.log(state.page);
    if(state.page == '/notflix/')
        displayHomePage();
    else if(state.page.indexOf('/tv/') != -1)
        displayTvPage();
    else if (state.page.indexOf('/movies/') != -1)
        displayMoviePage();
    else if (state.page.indexOf('/browse/') != -1)
        loadModalData();
    document.querySelectorAll('a').forEach(e=>{
        if(e.clickEvent)return;
        e.clickEvent = ()=>navigateToPage(e.getAttribute('url'));
        e.addEventListener('click', e.clickEvent);
    });
}