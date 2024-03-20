

const home_shortcut = document.querySelector('.title-h1');
const moviesWrapper = document.querySelector('.movies-wrapper'); //pega a div que conterá todos os filmes
const search_btn = document.querySelector('.search-wrapper img');
const input_field = document.querySelector('.search-wrapper input');
const checkbox_input = document.querySelector('.checkbox-wrapper .checkbox-input')

search_btn.addEventListener('click', searchMovie)
home_shortcut.addEventListener('click', homeMovies)


//waits for changes on the checkbox
checkbox_input.addEventListener('change', function(event) {
    if(event.target.checked) {
        getsOnlyFavoritedMovies();

    } else {
        homeMovies()
    }
});

//gets the event on the Enter key
input_field.addEventListener('keyup', function(event) {
    // console.log(event.key)
    if (event.keyCode == 13) {
        searchMovie()
        return
    }
})

//it's go back to the home page when ESC it's pressed
input_field.addEventListener('keyup', function(event) {
    
    if (event.keyCode == 27) {
        homeMovies()
        return
    }
})

//do the searching, clears the movie wrapper, calls the func that searches the movies 
//and passes the results to the render function
async function searchMovie() {
    const search_string = input_field.value
    if (search_string != '') {
        clearAllMovies()
        const movies = await getSearchedMovies(search_string)
        movies.forEach(movie => moviesRender(movie))
    } else {
        alert('Query error')
    }
}

const apiKey = process.env.API_KEY;
console.log(apiKey);

//this its actioned when the user clicks on the h1
async function homeMovies() {
    clearAllMovies()

    
    

    const movies = await getPopularMovies()
    movies.forEach(movie => moviesRender(movie))

    
}

//effectively does the searching with the 'search_string' from the input
async function getSearchedMovies(search_string) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${search_string}&api_key=${process.env.API_KEY}&language=en-US&page=1`
    const fetchResponse = await fetch(url);
    const {results} = await fetchResponse.json();
    
    
    return results
}

//cleans the movie wrapper
function clearAllMovies() {
    moviesWrapper.innerHTML = ''
}

//shows the most popular movies. its what the user sees when the page loads
async function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&include_adult=false&language=en-US&page=1`
    
    const fetchResponse = await fetch(url);
    const {results} = await fetchResponse.json();

    // console.log(results)
    return results
    
}

function getsOnlyFavoritedMovies () {
    clearAllMovies();
    
    const movies = getFavoritedMovies();
    movies.forEach(movie => moviesRender(movie))
}

function heartButtonPressed (event, movie){
    const heartContainer = event.target.closest('.heart-container');
    const favoriteTxt = heartContainer.querySelector('p');

    const favoritedState = {
        favorited: 'Static/imgs/heart-filled.svg',
        notFavorited: 'Static/imgs/heart-not-filled.svg'
    }

    if (event.target.src.includes(favoritedState.notFavorited)) {
        event.target.src = favoritedState.favorited;
        favoriteTxt.textContent = 'Desfavoritar'
        saveToLocalStorage(movie);
    } else {
        event.target.src = favoritedState.notFavorited;
        favoriteTxt.textContent = 'Favoritar'
        removeFromLocalStorage(movie.id);
    }
}

function getFavoritedMovies() {
    // console.log(JSON.parse(localStorage.getItem('favoriteMovies')))
    return JSON.parse(localStorage.getItem('favoriteMovies'))
}

function checkMovieIsFavorited(id) {
    const movies = getFavoritedMovies() || [];
    return movies.find(movie => movie.id == id)
}

function saveToLocalStorage(movie) {
    const movies = getFavoritedMovies() || [];
    movies.push(movie);
    const moviesJSON = JSON.stringify(movies)
    localStorage.setItem('favoriteMovies', moviesJSON)
}

function removeFromLocalStorage(id){
    const movies = getFavoritedMovies() || []
    const findMovie = movies.find(movie => movie.id == id)
    const newMovies = movies.filter(movie => movie.id != findMovie.id)
    localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
}

getFavoritedMovies()

//secures that getPopularMovies is called exactly when the page loads
window.onload = async function() {
    const movies = await getPopularMovies();
    
    movies.forEach(movie => moviesRender(movie))
}

//renders the movies with the results of the APIs
function moviesRender(movie) {
    const {id, title, poster_path, vote_average, release_date, overview} = movie; //deestrutura o objeto movie que vem da api
    const isFavorited = checkMovieIsFavorited(id);

    
    const date = new Date(release_date)
    const year = date.getFullYear();
    const image = `https://image.tmdb.org/t/p/w500${poster_path}`;

    //criação dos elementos
    //div container para o filme
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-container');
    moviesWrapper.appendChild(movieElement);

    //div container para a imagem do filme
    const movieImageConteiner = document.createElement('div');
    const movieImage = document.createElement('img');
    movieImage.classList.add('img-container');
    movieImage.src = image;
    movieImage.alt = `${title} Poster`;
    movieImageConteiner.appendChild(movieImage); //imagem dentro da div img-container
    movieElement.appendChild(movieImageConteiner); //img-container dentro do movie-container

    //container para as informações sobre o filme (título, nota e favoritar)
    const movieInformations =  document.createElement('div');
    movieInformations.classList.add('info-wrapper');
    movieElement.appendChild(movieInformations); //info-wrapper dentro do movie-container

    //container de informações
    //titulo
    const titleParagraph =  document.createElement('h1');
    titleParagraph.classList.add('movie-title');
    titleParagraph.textContent = `${title} (${year})` 
    movieInformations.appendChild(titleParagraph); //movie-title dentro do info-wrapper
    
    const statsWrapper =  document.createElement('div');

    //container star icon & heart button
    statsWrapper.classList.add('stats-wrapper');
    movieInformations.appendChild(statsWrapper); //stats-wrapper dentro do info-wrapper
    //rating (star)
    const starContainer =  document.createElement('span');
    starContainer.classList.add('star-container');
    

    const starImage =  document.createElement('img');
    starImage.src = 'Static/imgs/Star.svg';
    starImage.alt = 'Star';
    starContainer.appendChild(starImage); //Star image dentro do star-container

    const movieRate =  document.createElement('p');
    movieRate.textContent = vote_average.toFixed(1);
    starContainer.appendChild(movieRate) //rating paragraph dentro do star-container
    statsWrapper.appendChild(starContainer); //star-container dentro do stats-wrapper

    //favorito(heart)
    const heartContainer =  document.createElement('span');
    heartContainer.classList.add('heart-container');
    const heartImage =  document.createElement('img');
    heartImage.src = isFavorited ? 'Static/imgs/heart-filled.svg' : 'Static/imgs/heart-not-filled.svg';
    heartImage.alt = 'Heart';
    heartImage.classList.add('heartImage');
    heartImage.addEventListener('click', (event) => heartButtonPressed(event, movie));
    const favText = document.createElement('p');
    favText.textContent = isFavorited ? 'Desfavoritar' : 'Favoritar';
    heartContainer.appendChild(heartImage)
    heartContainer.appendChild(favText);
    statsWrapper.appendChild(heartContainer)

    //descrição
    const descriptionElement =  document.createElement('div');
    descriptionElement.classList.add('description-wrapper');
    descriptionElement.textContent = overview;
    movieInformations.appendChild(descriptionElement); //description-wrapper dentro do movie-element;

}


