var audio = new Audio();
let songs;
let folder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
  const secondsString = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds.toString();

  return `${minutesString}:${secondsString}`;
}
async function getMusic(folder) {
  let song = await fetch(`/songs/${folder}/`);
  let data = await song.text();
  // console.log(data);
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");
  songs = [];
  songs.length = 0;
  for (let index = 0; index < as.length; index++) {
    let element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let ul = document.querySelector(".songs-lists").getElementsByTagName("ul")[0];
  ul.innerHTML ="";
  for (const song of songs) {
    ul.innerHTML = ul.innerHTML + `<li>
    <img class="invert" src="music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
    </div>
        <img src="play.svg" alt="" class="invert">
</li>`;
  }
  Array.from(ul.getElementsByTagName("li")).forEach((element) => {
    element.addEventListener("click", (dets) => {
      document.querySelector("#pillay").src = "pause.svg";
     
      audio.src = `/songs/${folder}/` +  element.querySelector(".info").firstElementChild.innerHTML;
      audio.play();
      document.querySelector(".song-info").innerHTML =  element.querySelector(".info").firstElementChild.innerHTML;
      document.querySelector(".song-time").innerHTML = "00/00";
      pillay.src = "pause.svg";
    })
  })
}
async function displayfolder(){
     let allF = await fetch("/songs/");
     let readableF = await allF.text();
     let div = document.createElement("div");
     div.innerHTML = readableF;
    let as = div.getElementsByTagName("a");
    // console.log(as);
  let array =  Array.from(as)
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
     if(element.href.includes("/songs/")){
      let folder = element.href.split("/songs/")[1];
      // console.log(folder);
      let data = await fetch(`/songs/${folder}/info.json`);
      let information = await data.json();
      document.querySelector(".card-container").innerHTML = document.querySelector(".card-container").innerHTML + `<div data-folder=${folder} class="card rounded">
      <div class="play"><i class="fa-solid fa-play"></i></div>
      <img 
          src="/songs/${folder}/cover.webp"
          alt="">
      <h3>${information.title}</h3>
      <p style="font-weight: 500; font-size: 13px; color: #8f8f8f;">${information.description}</p>
  </div>`
     }
    }

    Array.from(document.getElementsByClassName("card")).forEach(element => {
      element.addEventListener("click",async ()=>{
       folder= element.dataset.folder;
       console.log("hello");
        await getMusic(folder);            
      })
 });
    
}

async function main() {

  displayfolder();
  // pILLAY BUTTON STOPED AND START 
  pillay.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      pillay.src = "pause.svg";
    }
    else {
      audio.pause();
      pillay.src = "play.svg";
    }
  })
  //  SETTING TIME AND DURATION OF AUDIO
  audio.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(Math.floor(audio.currentTime))}/${secondsToMinutesSeconds(Math.floor(audio.duration))}`;
    document.querySelector(".circle1").style.left = (audio.currentTime / audio.duration) * 100 + "%";
  })

  // attaching eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (dets) => {
    let percent = (dets.offsetX/document.querySelector(".seekbar").getBoundingClientRect().width)*100;
    document.querySelector(".circle1").style.left = percent + "%";
    audio.currentTime = ((audio.duration) * percent)/100;
  })

  //attaching eventlistener to hamburger
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0%";
  })

  //attaching eventlistener to cross sign
  document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-136%";
  })

  //attaching eventListener to previous button
  prev.addEventListener("click",()=>{
    let index = songs.indexOf(audio.src.split(`/songs/${folder}/`)[1])
    if((index-1)>=0){
    playmusic(songs[index-1].replaceAll("%20"," "),folder);
    }
  })

  next.addEventListener("click",()=>{

    let index = songs.indexOf(audio.src.split(`/songs/${folder}/`)[1])
    if((index+1)<songs.length){
    playmusic(songs[index+1].replaceAll("%20"," "),folder);
    }
  })

//Attaching eventlistener to volume
form.getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        audio.volume = parseInt(e.target.value)/100;
})

//Dynamic cards

}
function playmusic(music,folder) {
  audio.src = `http://127.0.0.1:5501/songs/${folder}/` + music;
  audio.play();
  document.querySelector(".song-info").innerHTML = music;
  document.querySelector(".song-time").innerHTML = "00/00";
  pillay.src = "pause.svg";
}

main();
