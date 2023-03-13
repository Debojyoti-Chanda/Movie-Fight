// console.log('Hi there!');
// const fetchData = async (searchTerm)=>{
//     const response = await axios.get("http://www.omdbapi.com/",{
//         params : {
//             apikey : "46be4e27" ,
//             s : searchTerm     //By Search    
//             // i : "tt0848228"
//         }
//     });
//     if(response.data.Error){
//         return [];
//     }
//     // console.log(response.data);
//     return response.data.Search ;
// };
// const root = document.querySelector(".autocomplete");
// root.innerHTML =`
// <lable><b>Search for a Movie</b></lable>
// <input class="input"></input>
// <div class="dropdown">
//     <div class="dropdown-menu">
//         <div class="dropdown-content results"></div>
//     </div>
// </div>
// `;
// const dropdown = document.querySelector(".dropdown");
// const resultsRapper = document.querySelector(".results");
// const input = document.querySelector("input");
// // let timeOutId;
// // const onInput = (event) =>{
// //     if(timeOutId){             //when it moves to next keypress event we disable the previous setTimeout , hence fetchData is not called
// //         clearTimeout(timeOutId);
// //     };
// //     timeOutId = setTimeout(()=>{    
// //         fetchData(event.target.value);   // Function will be called after 2sec of keypress event
// //     },2000);
// // };


// const onInput = async (event)=>{
//     const movies  = await fetchData(event.target.value);
//     if(!movies.length){
//         dropdown.classList.remove("is-active");
//         return;
//     };
//     console.log(movies);
//     resultsRapper.innerHTML="";
//     dropdown.classList.add("is-active");
//     for(let movie of movies){
//         const option = document.createElement("a");
//         const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;
//         option.classList.add("dropdown-item");
//         option.innerHTML = `
//         <img src="${imgSrc}">
//         ${movie.Title}
//         `;
//         option.addEventListener("click",(event)=>{
//             dropdown.classList.remove("is-active");
//             input.value = movie.Title;
//             onMovieSelect(movie);
//         })
//         // document.querySelector("#target").appendChild(div);
//         resultsRapper.appendChild(option);
//     }
// };

// input.addEventListener("input",debounce(onInput,2000));
// document.addEventListener("click", (event)=>{
//     if(!root.contains(event.target)){
//         dropdown.classList.remove("is-active");
//     }
// });
const autoCompleteConfig ={
    renderOptions(movie){
        const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;
        return `
        <img src="${imgSrc}">
        ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTerm){
        const response = await axios.get("http://www.omdbapi.com/",{
            params : {
                apikey : "46be4e27" ,
                s : searchTerm 
            }
        });
        if(response.data.Error){
            return [];
        };
        return response.data.Search ;
    }
};
createAutocomplete({
    ...autoCompleteConfig,
    root : document.querySelector("#left-autocomplete"),
    onOptionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie , document.querySelector("#left-summary"),"left");
    },
    
});
createAutocomplete({
    ...autoCompleteConfig,
    root : document.querySelector("#right-autocomplete"),
    onOptionSelect(movie){
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie , document.querySelector("#right-summary"),"right");
    },
});
let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement , side)=>{
    const response = await axios.get("http://www.omdbapi.com/",{
        params : {
            apikey : "46be4e27" ,   
            i : movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if(side==="left"){
        leftMovie = response.data;
    }else{
        rightMovie = response.data;
    }
    if(leftMovie && rightMovie){
        runComparison();
    }
};
const runComparison = ()=>{
    console.log("Time for comparison");
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat,index)=>{
        const rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        if(leftSideValue>rightSideValue){
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        }else{
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    });
};

const movieTemplate = (movieDetail)=>{
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,"").replace(/,/g,""));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,""));
    const awards = movieDetail.Awards.split(" ").reduce((prev,word)=>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
    },0);

    return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" >
      </p>
    </figure>
    <div class="media-content">
        <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
        </div>
    </div>
  </article>
  <article data-value="${awards}" class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value="${dollars}" class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value="${metascore}" class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value="${imdbRating}" class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">imdbRating</p>
  </article>
  <article data-value="${imdbVotes}" class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">imdb Votes</p>
  </article>
    `
};