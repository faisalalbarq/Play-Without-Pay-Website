const allLinks = document.querySelectorAll('.nav-link');
const rowBox = document.querySelector('.row');
const games = document.querySelector('.games');
const boxDetails = document.getElementById('layerContainer');
const innerBox = document.getElementById('innerbox');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const loding = document.getElementById('loding');
let counterIndex = 0;

let fullData = new Array();
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'e24ee579ddmshd31c21eb3b6b0aap15bdfejsnfd70a35feebe',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
  },
};
// Toggle Class Active
(function () {
  // Add Class Active
  allLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      let category = e.target.innerHTML;
      //  Send New Category
      getAll(category);
      // Remove Prev Active
      document.querySelector('.nav-link.active').classList.remove('active');
      // Add Class Active
      this.classList.add('active');
    });
  });
})();

// Get All Data Api
async function getAll(category = 'mmorpg') {
  loding.classList.remove('d-none');
  const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
  const respons = await (await fetch(url, options)).json();
  console.log(respons);
  fullData = respons;
  displayAll(fullData);
  ToggleAllData();
  loding.classList.add('d-none');
}
getAll();

// Get getDetails Data Api
async function getDetails(index) {
  loding.classList.remove('d-none');
  const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${fullData[index].id}`;
  const details = await fetch(url, options);
  const respons = await details.json();
  displayDetails(respons);
  loding.classList.add('d-none');
}

// Display All Data
function displayAll(Games) {
  let cartonaBox = ``;
  Games.forEach((game, index) => {
    // Distract
    let {
      genre: uname,
      short_description: desc,
      thumbnail: img,
      title,
      platform,
    } = game;
    let videoPath = img.replace('thumbnail.jpg', 'videoplayback.webm');
    cartonaBox += `
     <div  onmouseenter="startVideo(event)"onmouseleave="stopVideo(event)"  class="col-md-6 col-lg-3">
              <div class="card h-100" role="button" onclick="getDetails(${index})">
                <figure class="p-3 mb-0 position-relative">
                  <img
                    src=${img}
                    class="card-img-top"
                    alt="${title}"
                    
                  />
                      <video muted="true"  preload="none" loop   class="w-100 d-none h-100 position-absolute top-0 start-0 z-3">
              <source src="${videoPath}">
              </video>
                </figure>
                <div class="card-body p-3 text-center">
                  <div
                    class="card-title text-white d-flex justify-content-between align-items-center"
                  >
                    <h3>${title}</h3>
                    <span class="p-2 rounded-2 free">free</span>
                  </div>
                  <p class="card-text">
                    ${desc.split('').splice(0, 40).join('')}...
                  </p>
                </div>
                <div class="card-footer d-flex text-white justify-content-between align-items-center">
                  <span class="p-2 rounded-2">${uname}</span>
                  <span class="p-2 rounded-2"> ${platform}</span>
                </div>
              </div>
            </div>
   `;
  });
  // render data From APi
  rowBox.innerHTML = cartonaBox;
}
// display Details Data
function displayDetails(respons) {
  // Distract
  let {
    status,
    thumbnail: img,
    title,
    platform,
    genre,
    description,
    freetogame_profile_url: siteGame,
  } = respons;
  let ditalisGame = `
  <div class="row gy-3 align-items-start py-4">
          <div class="col-lg-6 text-center">
            <h2 class="text-white">Details Game</h2>
            <img class="w-100" src="${img}" alt="" />
          </div>
          <div class="col-lg-6">
            <h4 class="text-white">Title: ${title}</h4>
            <ul class="list text-white d-flex flex-column gap-2 ">
              <li>Category: <span class="btn btn-outline-warning p-1 "> ${genre}</span></li>
              <li>platform: <span class="btn btn-outline-warning p-1"> ${platform}</span></li>
              <li>status: <span class="btn btn-outline-warning p-1"> ${status}</span></li>
            </ul>
            <div class="desc text-white py-4">${description}</div>
            <a class="btn btn-outline-warning" href=${siteGame}>show game</a>
          </div>
        </div>
        <i onclick="closeCard()" class="close p-2 fa-solid fa-circle-xmark position-absolute"> </i>

        `;

  innerBox.innerHTML = ditalisGame;
  let bgImage = img.replace('thumbnail', 'background');
  boxDetails.style.cssText = `
  background-image: url(${bgImage});
  background-size:cover;
  background-position:center
  `;
}
function ToggleAllData() {
  const allCard = document.querySelectorAll('.card');
  allCard.forEach((card) => {
    card.addEventListener('click', function () {
      games.classList.toggle('d-none');
      startLoading();
      boxDetails.classList.toggle('d-none');
    });
  });
}

function closeCard() {
  startLoading();
  boxDetails.classList.toggle('d-none');
  games.classList.toggle('d-none');
}

function startLoading() {
  loding.classList.remove('d-none');

  setTimeout(() => {
    loding.classList.add('d-none');
  }, 500);
}

next.addEventListener('click', function () {
  startLoading();
  counterIndex++;
  if (counterIndex > fullData.length - 1) {
    counterIndex = 0;
  }
  getDetails(counterIndex);
});

prev.addEventListener('click', function () {
  startLoading();

  counterIndex--;
  if (counterIndex < 0) {
    counterIndex = fullData.length - 1;
  }

  getDetails(counterIndex);
});

function startVideo(event) {
  const videoEl = event.target.querySelector('video');
  if (videoEl) {
    videoEl.classList.remove('d-none');
    videoEl.muted = true;
    videoEl.play();
  } else console.log('not vedio to show');
}

function stopVideo(event) {
  const videoEl = event.target.querySelector('video');
  if (videoEl) {
    videoEl.classList.add('d-none');
    videoEl.muted = true;
    videoEl.pause();
  } else console.log('not vedio to show');
}