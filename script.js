
const movieModel = document.querySelector(".movies-wrapper .movie-container")

function moviesRender(moviesArr) {
    const movieContainer = document.querySelector(".movies-wrapper");
    movieContainer.innerHTML = ""

    for (const movie of moviesArr) {
        const element = movieModel.cloneNode(true);

        element.querySelector(".img-container img").src = movie.imagem;
        element.querySelector(".info-wrapper #movie-title").textContent = `${movie.title} (${movie.year})`;
        element.querySelector(".stats-wrapper .star-container p").textContent = movie.rating;
        element.querySelector(".description-wrapper p").textContent = movie.description;
        
        movieContainer.appendChild(element);
    }
}

const moviesArr = [
    {
        imagem: 'imgs/batman.png',
        title: 'Batman',
        year: '2022',
        rating: 11.2,
        description: 'Movie description bla bla bla...',
    },
    {
        imagem: 'imgs/avengers.png',
        title: 'Avengers',
        year: '2019',
        rating: 5.0,
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`,
    },
    {
        imagem: 'imgs/doctor-strange.png',
        title: 'Doctor Strange',
        year: '2022',
        rating: 9.2,
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`,
    },
]

moviesRender(moviesArr)
