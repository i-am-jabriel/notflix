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

console.log('v 0.015');  

var lastState;
document.querySelector('#modal-background').addEventListener('click', ()=>closeModal());
window.addEventListener('keyup',e=>{
    if(e.key == 'Escape')closeModal();
});
document.querySelector('#search-button').addEventListener('click',()=>{
    search.parentElement.className='active';
    search.focus();
});
document.querySelector('#close-search-button').addEventListener('click',()=>{
    search.parentElement.className = '';
    if(search.value != '')navigateToPage('/notflix/');
    search.value = '';
})
search.addEventListener('input',()=>{
    navigateToPage(`/notflix/search?q=${search.value}`,true);
});

container.className = 'container';
body.appendChild(container);

function clearContainer(){
    onClear.forEach(a=>a());
    onClear.length = 0;
    page = 0;
    window.scrollTo(0,0);
    lastState = container.innerHTML;
    container.innerHTML = '';
}

function loadModalData(type, id){
    if(!type){
        //: "","notflix","browse","type","111150"
        var url = state.page.split('/');
        // console.log(url);
        type = url[3];
        id = url[4];
    }
    fetch(`${api}/${type}/${id}?api_key=${apiKey}`)
    .then(r=>r.json()).then(res=>displayModalForObj(res, type));
}
function displayModalForObj(obj){
    var title = obj.name || obj.title;
    obj.type = 'type' in obj ? 'tv':'movie';
    state.lastTitle = document.title;
    document.title = `Notflix - ${title}`;
    navigateToPage(`/notflix/browse/${obj.type}/${obj.id}`, false);
    var img =  obj.backdrop_path || obj.poster_path;
    var date = obj.release_date || obj.first_air_date;
    img = img ? `style='background-image:url(${apiImage}/${img})'` : '';
    date = date? `Release Date: ${date}` :'';
    var desc = obj.overview;
    desc = desc ? `<p>${desc}</p>`:'';
    modalWindow.innerHTML = `
<button id='close-modal'>X</button>
<img class='modal-header' ${img}/>
<div class='modal-container'>
    <div class='col'>
        <h3 class='modal-title'>${title}</h3>
        <div class='col'>
            <p>Rating: ${obj.vote_average*10}% ${date}</p>
            ${desc}
        </div>
    </div>
</div>`;
    modalWindow.querySelector('#close-modal').addEventListener('click',()=>closeModal());
    modal.className = 'active';
    modalWindow.scrollTop = 0;
}
function closeModal(){
    if(!modal.className)return;
    modal.className = '';
    var hasRoot = state.lastPage!=state.page;
    document.title = state.lastTitle || 'Notflix - Home';
    navigateToPage(hasRoot?state.lastPage:'/notflix/', !hasRoot);
}
function createCardForObject(obj, type){
    var card = document.createElement('div');

    var inner = document.createElement('div');
    inner.className='card-container';
    obj.type = obj.media_type || type;
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
    var addOrRemove = isInList(obj) ? 'fa-minus' : 'fa-plus';
    mini.className = 'card-mini-modal';
    mini.innerHTML=`
    <div class='row'>
        <i class="fas fa-play active"></i>
        <i class="fas ${addOrRemove}" id='addRemoveListButton'></i>
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
    mini.querySelector('#addRemoveListButton').addEventListener('click',e=>{
        var plus = e.target.className == 'fas fa-plus';
        if(plus)
            addToList(obj)
        else
            removeFromList(obj)
        e.target.className = plus ? 'fas fa-minus' : 'fas fa-plus';
        e.stopPropagation();
    });
    mini.querySelector('.fa-play').addEventListener('click',e=>{
        window.open(`https://www.justwatch.com/us/search?q=${title.innerText}`);
        e.stopPropagation();
    });

    inner.appendChild(title);
    inner.appendChild(mini);
    //card.appendChild(img);
    card.appendChild(inner);
    card.clickEvent = x=> loadModalData(obj.type, obj.id)
    card.addEventListener('click', card.clickEvent);
    return card;
}
function createCardForObjects(arr, title='Trending', type='movie'){
    var row = document.createElement('div');
    row.className = 'cards row';
    arr.forEach(obj=>{
        //create a div.card
        row.appendChild(createCardForObject(obj, type));
    });
    var rowTitle = document.createElement('h2')
    rowTitle.className = 'row-title';
    rowTitle.innerText = title;

    var outer = document.createElement('div');
    outer.className ='slider-row no-scrollbar';
    outer.appendChild(row);
    
    container.appendChild(rowTitle);
    container.appendChild(outer);
}
var imagesLoadedCount = 0;
function onImageLoad(){
    if(--imagesLoadedCount <= 1)fetching=false;
}
function getGenres(ids){
    if(!ids)return '';
    return ids.map((id)=>{
        var genre = genres[genres.findIndex(g=>g.id==id)]
        return genre?genre.name:null;
    }).filter(a=>a).join('<span class=\'gray\'> • </span>');

}
var fetching = false;
function isReadyToScrollY(obj){
    return obj.scrollTop === (obj.scrollHeight - obj.offsetHeight) && !fetching;
}
function atEndOfContentVertically(){
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight && !fetching
}
window.addEventListener('scroll',e=>{
    /*if((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !fetching && view == 'multi-card'){
        loadTrendingMovies();
        fetching=true;
    }*/
    onScroll.forEach(a=>a());
});
var genres, tvGenres, movieGenres;
fetch(`${api}/genre/movie/list?api_key=${apiKey}`).then(res=>res.json())
    .then(r1=>{
        genres = [...r1.genres];
        movieGenres = r1.genres;
        fetch(`${api}/genre/tv/list?api_key=${apiKey}`).then(r=>r.json()).then(r2=>{
            genres.push(...r2.genres);
            tvGenres = r2.genres;
            var page = window.location.hash ? 
                '/notflix/' + window.location.hash.substring(2,window.location.hash.length) : undefined;
            // console.log('page is',page,window.location.hash);
            navigateToPage(page);
        });
    });

function displayHomePage(){
    if(state.page && state.page == state.lastPage)return;
    document.title = 'Notflix - Home';
    clearContainer();
    state.root = '/notflix/';
    loadTrendingMovies();
    loadPopularMovies();
    loadPopularMovies('vote_average.desc', 'Fan Favorites');
    loadPopularMovies('revenue.desc', 'Critically Acclaimed');
    loadPopularMovies('vote_count.desc', 'Buzzworthy')
}
function displayTvPage(){
    if(state.page == state.lastPage)return;
    document.title = 'Notflix - TV';
    clearContainer();
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
    if(state.page && state.page == state.lastPage)return;
    document.title = 'Notflix - Movies';
    clearContainer();
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
        loadPopularMovies('vote_average.desc', 'Classics', params);
        loadPopularMovies('popularity.desc', 'Popular', params);
    }
}
var myList = [];
function displayMyList(){
    if(state.page && state.page == state.lastPage)return;
    document.title = 'Notflix - My List';
    clearContainer();
    state.root = '/notflix/list';
    if(!myList.length){
        container.innerHTML = "<h3 class='gray'>Empty! Add some videos to your list first</h3>";
        return;
    }
    var div = document.createElement('div');
    div.className = 'row wrap';
    myList.forEach(obj=>div.appendChild(createCardForObject(obj,obj.type)));
    container.appendChild(div);
}
var searchQuery;
var onScroll = [];
var onClear = [];
function displaySearchQuery(){
    if(state.page && state.page == state.lastPage)return;
    document.title = 'Notflix - Search';
    search.value = state.page.substring(state.page.indexOf('?q=')+3);
    clearContainer();
    var now = searchQuery = Date.now();
    var div = document.createElement('div');
    var added = false;
    div.page = 0;
    div.className = 'row wrap';
    
    // console.log(`${api}/search/multi?api_key=${apiKey}&language=en-US&include_adult=false&query=${search.value}`);
    var f = () => { 
        fetching = true;
        fetch(`${api}/search/multi?api_key=${apiKey}&language=en-US&page=${++div.page}&include_adult=false&query=${search.value}`)
            .then(r=>r.json())
            .then(res=>{
                var i = res.results.length;
                while(i--)
                    if(now == searchQuery && isTvOrMovie(res.results[i]))
                        div.appendChild(createCardForObject(res.results[i]));
                fetching= false;
                if(now == searchQuery && !added){
                    container.appendChild(div);
                    added = true;
                }
            });
    };
    f();
    var loadMoreContent = ()=>{if(atEndOfContentVertically())f();}
    onScroll.push(loadMoreContent);
    onClear.push(()=>onScroll.splice(onScroll.indexOf(loadMoreContent),1));
}
function isTvOrMovie(obj){
    //obj.title || obj.original_name
    return 'title' in obj || 'original_name' in obj;
}
function addToList(obj){
    // if(myList.findIndex(a=>obj.id==a.id))return;
    myList.push(obj);
}
function removeFromList(obj){
    myList.splice(myList.findIndex(a=>obj.id==a.id),1);
}
function isInList(obj){
    return myList.findIndex(a=>obj.id==a.id) != -1;
}

function displayGenrePicker(title, currentId){
    var g = (title=='TV Shows'?tvGenres:movieGenres);
    var div = document.createElement('div');
    div.className='page-header row';
    div.innerHTML=`<h1 class='genre-title'>${title}</h1>
        <select id='genre-selector'>
            ${currentId ? '' : '<option disabled selected>Choose A Genre</option>'}
            ${g.reduce((a,genre)=>`${a}<option value='${genre.id}' ${currentId==genre.id?'selected':''}>${genre.name}</option>`,'')}
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
var state = {};
var internal = false;
function navigateToPage(page = '/notflix/', andPopulate = true){
    internal = true;
    state.lastRoot = state.root;
    state.lastPage = state.page;
    state.page = page;
    if(andPopulate)populatePage();
    history.pushState(state, '', `${window.origin}${page}`);

}

window.addEventListener('popstate',e=>{
    if(e.state)state = e.state;
    populatePage();
});

function populatePage(){
    console.log('attempting to render ',state.page);
    var modal = false;
    if(state.page == '/notflix/')
        displayHomePage();
    else if (state.page.indexOf('/browse/') != -1){
        loadModalData();
        modal = true;
    }
    else if(state.page.indexOf('/tv/') != -1)
        displayTvPage();
    else if (state.page.indexOf('/movies/') != -1)
        displayMoviePage();
    else if (state.page.indexOf('/list/') != -1)
        displayMyList();
    else if(state.page.indexOf('/search'))
        displaySearchQuery();
    if(!modal)closeModal();
    document.querySelectorAll('a').forEach(e=>{
        if(e.clickEvent)return;
        e.clickEvent = ()=>navigateToPage(e.getAttribute('url'));
        e.addEventListener('click', e.clickEvent);
    });
    internal = false;
}

/* 

My List

*/
