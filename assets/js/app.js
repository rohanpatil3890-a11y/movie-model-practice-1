
const cl = console.log;

const movieModelBtn = document.getElementById("movieModelBtn");
const backDrop = document.getElementById("backDrop");
const closeBtn = [...document.querySelectorAll(".closeBtn")];
const movieModel = document.getElementById("movieModel");
const formId = document.getElementById("formId");
const movieNameC = document.getElementById("movieName");
const movieImgC = document.getElementById("movieImg");
const moviedecC = document.getElementById("moviedec");
const movieRating = document.getElementById("movieRating");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const rowContainer = document.getElementById("rowContainer");
const loder = document.getElementById("loder");


const onMovieModelEvent = () => {
    backDrop.classList.toggle("active");
    movieModel.classList.toggle("active");
    formId.reset();
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
}

function loader(flag) {
    if (flag) {
        loder.classList.remove("d-none");
    } else {
        loder.classList.add("d-none");
    }
}

function snackbar(title, icon) {
    Swal.fire({
        title,
        icon,
        timer: 2000
    })
}

function blogObjToArr(obj) {

    let arr = [];
    for (const key in obj) {
        obj[key].id = key
        arr.push(obj[key])
    }
    return arr
}


let BASE_URL = "https://movie-model-data-default-rtdb.firebaseio.com";

let MOVIE_BLOG_URL = `${BASE_URL}/movies.json`;


function fetchAllMovie() {

    loader(true);

    fetch(MOVIE_BLOG_URL, {
        method: "GET",
        body: null,
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })

        .then(res => {
            return res.json()
        })
        .then(data => {
            let movieArr = blogObjToArr(data).reverse()
            cl(movieArr)
            creatCol(movieArr);

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            loader(false)
        })
}

fetchAllMovie()


const badgeRating = (rating) => {
    if (rating > 7) {
        return "badge-success"
    } else if (rating > 5 && rating <= 7) {
        return "badge-warning"
    } else {
        return "badge-danger"
    }
}

const creatCol = (arr) => {
    let result = "";
    cl(arr)
    arr.forEach(movie => {
        result += `
                 <div class="col-lg-3 col-md-3 col-sm-6 mb-4" id="${movie.id}">
                <div class="card movie-card text-white">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h2>${movie.title}</h2>
                            </div>
                            <div class="col-2">
                                <h4><span class="badge ${badgeRating(movie.rating)}">${movie.rating}</span></h4>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src="${movie.path}" alt="${movie.title}" title="${movie.title}">
                            <figcaption>
                                <h5>${movie.title}</h5>
                                <p>
                                ${movie.content}
                                    </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm nfx-sec-btn" onclick = "onEdit(this)">Edit</button>
                         <button class="btn btn-sm nfx-pri-btn" onclick="onRemove(this)">Remove</button>
                    </div>
                </div>
            </div>
        `
    })
    rowContainer.innerHTML = result;

}

function onsubmitEvent(eve) {

    eve.preventDefault();

    let MovieObj = {
        title: movieNameC.value,
        path: movieImgC.value,
        content: moviedecC.value,
        rating: movieRating.value
    }

    loader(true)


    fetch(MOVIE_BLOG_URL, {
        method: "POST",
        body: JSON.stringify(MovieObj),
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })

        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.json()
            }
        })
        .then(data => {
            cl(data);
            formId.reset();
            snackbar("New Movie is Created Successfully!!!", "success");

            let Divs = document.createElement("div");
            Divs.id = data.name;
            Divs.className = "col-lg-3 col-md-3 col-sm-6 mb-4";
            Divs.innerHTML = `
                     <div class="card movie-card text-white">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h2>${MovieObj.title}</h2>
                            </div>
                            <div class="col-2">
                                <h4><span class="badge ${badgeRating(MovieObj.rating)}">${MovieObj.rating}</span></h4>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src="${MovieObj.path}" alt="${MovieObj.title}" title="${MovieObj.title}">
                            <figcaption>
                                <h5>${MovieObj.title}</h5>
                                <p>
                                ${MovieObj.content}
                                    </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm nfx-sec-btn" onclick = "onEdit(this)">Edit</button>
                         <button class="btn btn-sm nfx-pri-btn" onclick="onRemove(this)">Remove</button>
                    </div>
                </div>
     `;
            rowContainer.prepend(Divs)
            onMovieModelEvent();

        })
        .catch(err => {
            cl(err);
        })
        .finally(() => {
            loader(false)
        })
}


function onRemove(ele) {
          loader(true)
    Swal.fire({
        title: "Do you want to remove the Movie?",
        showCancelButton: true,
        confirmButtonText: "Remove",
        denyButtonText: `Remove`,
        confirmButtonColor: "#e03131"
    }).then((result) => {
        if (result.isConfirmed) {


            
            let REMOVE_ID = ele.closest(".col-md-3").id;
            let REMOVE_URL = `${BASE_URL}/movies/${REMOVE_ID}.json`;

            fetch(REMOVE_URL, {
                method: "DELETE",
                body: null,
                headers: {
                    "auth": "Token for Ls",
                    "Content-type": "application/json"
                }
            })

                .then(res => res.json())
                .then(data => {
                    ele.closest(".col-md-3").remove();
                    snackbar(`The id with id ${REMOVE_ID} remove successfully`)
                })
                .catch(err => {
                    snackbar(err, "error")
                })
                .finally(() => {
                    loader(false)
                })


        }

        loader(false)

    });


}


function onEdit(ele) {

    loader(true)
    let EDIT_ID = ele.closest(".col-md-3").id;

    onMovieModelEvent()

    localStorage.setItem("EDIT_ID", EDIT_ID);

    let EDIT_URL = `${BASE_URL}/movies/${EDIT_ID}.json`;

    fetch(EDIT_URL, {
        method: "GET",
        body: null,
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            cl(data)
            movieNameC.value = data.title
            movieImgC.value = data.path;;
            moviedecC.value = data.content;
            movieRating.value = data.rating;

            submitBtn.classList.add("d-none");
            updateBtn.classList.remove("d-none");

        })
        .catch(err => {
            snackbar(err, "error")
        })
        .finally(() => {
            loader(false)
        })


}


function onupdateEvent() {

    loader(true);

    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let UPDATE_URL = `${BASE_URL}/movies/${UPDATE_ID}.json`;

    let UPDATE_OBJ = {
        title: movieNameC.value,
        path: movieImgC.value,
        content: moviedecC.value,
        rating: movieRating.value,
        id: UPDATE_ID
    }

    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(UPDATE_OBJ),
        headers: {
            "auth": "Token for Ls",
            "Content-type": "application/json"
        }
    })

        .then(res => res.json())
        .then(data => {

            let GetId = document.getElementById(UPDATE_ID);
            GetId.innerHTML = `
                          <div class="card movie-card text-white">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h2>${UPDATE_OBJ.title}</h2>
                            </div>
                            <div class="col-2">
                                <h4><span class="badge ${badgeRating(UPDATE_OBJ.rating)}">${UPDATE_OBJ.rating}</span></h4>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src="${UPDATE_OBJ.path}" alt="${UPDATE_OBJ.title}" title="${UPDATE_OBJ.title}">
                            <figcaption>
                                <h5>${UPDATE_OBJ.title}</h5>
                                <p>
                                ${UPDATE_OBJ.content}
                                    </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm nfx-sec-btn" onclick = "onEdit(this)">Edit</button>
                         <button class="btn btn-sm nfx-pri-btn" onclick="onRemove(this)">Remove</button>
                    </div>
                </div>
        `;
              onMovieModelEvent()
            formId.reset()
            submitBtn.classList.remove("d-none");
            updateBtn.classList.add("d-none");
            snackbar("Movie is Updated Successfully!!!", "success");
                 
        })
        .catch(err => {
            snackbar(err, "error")
        })
        .finally(() => {
            loader(false)
        })
}




closeBtn.forEach(p => {
    p.addEventListener("click", onMovieModelEvent)
})
movieModelBtn.addEventListener("click", onMovieModelEvent)
formId.addEventListener("submit", onsubmitEvent);
updateBtn.addEventListener("click", onupdateEvent);