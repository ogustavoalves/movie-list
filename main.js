import { api_key } from "./key.js";
const moviesWrapper = document.querySelector('.movies-wrapper'); //pega a div que conterá todos os filmes

async function getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`
    const fetchResponse = await fetch(url);
    const {results} = await fetchResponse.json();
    
    return results
    console.log (results);
}

getPopularMovies()

window.onload = async function() {
    const movies = await getPopularMovies();
    movies.forEach(movie => moviesRender(movie))
}

function moviesRender(movie) {
    const {title, poster_path, vote_average, release_date, overview} = movie; //deestrutura o objeto movie que vem da api
    const isFavorited = false;

    
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

    //container star & heart
    statsWrapper.classList.add('stats-wrapper');
    movieInformations.appendChild(statsWrapper); //stats-wrapper dentro do info-wrapper
    //rating (star)
    const starContainer =  document.createElement('span');
    starContainer.classList.add('star-container');
    

    const starImage =  document.createElement('img');
    starImage.src = 'imgs/Star.svg';
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
    heartImage.src = isFavorited ? 'imgs/heart-filled.svg' : 'imgs/heart-not-filled.svg';
    heartImage.alt = 'Heart';
    const favText = document.createElement('p');
    favText.innerHTML = 'Favoritar';
    heartContainer.appendChild(heartImage)
    heartContainer.appendChild(favText);
    statsWrapper.appendChild(heartContainer)

    //descrição
    const descriptionElement =  document.createElement('div');
    descriptionElement.classList.add('description-wrapper');
    descriptionElement.textContent = overview;
    movieInformations.appendChild(descriptionElement); //description-wrapper dentro do movie-element;

}
