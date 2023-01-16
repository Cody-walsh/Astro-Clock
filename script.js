function success(position) { 
 let latitude = position.coords.latitude
 let longitude = position.coords.longitude
 getData(latitude, longitude)
 if (longitude < 0) {
  longitude = longitude + 360
 }
 setInterval(() => {
  getData(latitude, longitude);
  }, 60000);
 }
 const error = () => alert('Your coordinates are unavailable')

navigator.geolocation.getCurrentPosition(success, error)

let planetData = []
let planetDataPre = []
let aries
let sunImg = new Image()
let moonImg = new Image()
let mercuryImg = new Image()
let venusImg = new Image()
let marsImg = new Image()
let jupiterImg = new Image()
let saturnImg = new Image()
let uranusImg = new Image()
let neptuneImg = new Image()
let plutoImg = new Image()
sunImg.src = './images/sun.png'
moonImg.src = './images/moon.png'
mercuryImg.src = './images/mercury.jpg'
venusImg.src = './images/venus.png'
marsImg.src = './images/mars.jpg'
jupiterImg.src = './images/jupiter.png'
saturnImg.src = './images/saturn.jpg'
uranusImg.src = './images/uranus.jpg'
neptuneImg.src = './images/neptune.png'
plutoImg.src = './images/pluto.jpg'

async function getData(latitude, longitude) {
  let planetData = []
  let planetDataPre = []
  let currentTime = new Date()
  let year = currentTime.getFullYear();
  let month = String(currentTime.getMonth() + 1).padStart(2, '0');
  let day = String(currentTime.getDate()).padStart(2, '0');
  let hours = currentTime.getUTCHours();
  let minutes = currentTime.getUTCMinutes();
  let timezone = (Number(currentTime.getTimezoneOffset()) / 60)
  if (timezone > 0){
    timezone = `-${timezone}`
  }

  let currentTime2 = new Date()
  currentTime2.setDate(currentTime.getDate() + 1);
  let year2 = currentTime2.getFullYear();
  let month2 = String(currentTime2.getMonth() + 1).padStart(2, '0');
  let day2 = String(currentTime2.getDate()).padStart(2, '0');
  let hours2 = currentTime2.getUTCHours();
  let minutes2 = currentTime2.getUTCMinutes();
  let timezone2 = (Number(currentTime2.getTimezoneOffset()) / 60)
  if (timezone2 > 0){
    timezone2 = `-${timezone2}`
  }

  let currentTimeStr = `${year}-${month}-${day}%20${hours}:${minutes}`;

  let currentTimeStr2 = `${year2}-${month2}-${day2}%20${hours2}:${minutes2}`;

  const endpoint = 'https://ssd.jpl.nasa.gov/api/horizons.api';
  const queryString = `?format=text&COMMAND='199'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='c@399'&SITE_COORD='${longitude},${latitude},0'&START_TIME='${currentTimeStr}'&STOP_TIME='${currentTimeStr2}'&STEP_SIZE='1%20d'&QUANTITIES='1,34'`;
  const planets = [
    { name: 'Sun', id: '10', color: 'yellow', img: sunImg },
    { name: 'Moon', id: '301', color: 'grey', img: moonImg },
    { name: 'Mercury', id: '199', color: 'orange', img: mercuryImg },
    { name: 'Venus', id: '299', color: 'green', img: venusImg },
    { name: 'Mars', id: '499', color: 'red', img: marsImg },
    { name: 'Jupiter', id: '599', color: 'blue', img: jupiterImg },
    { name: 'Saturn', id: '699', color: 'purple', img: saturnImg },
    { name: 'Uranus', id: '799', color: 'silver', img: uranusImg },
    { name: 'Neptune', id: '899', color: 'pink', img: neptuneImg },
    { name: 'Pluto', id: '999', color: 'black', img: plutoImg },
  ];
  for (const planet of planets) {
    const planetQueryString = queryString.replace("'199'", `'${planet.id}'`);
  try {
    const response = await fetch(endpoint + planetQueryString, {
      method: 'GET',
    });
    const data = await response.text();
    displayData(planetData, planet.name, data, planet.color, planet.img);
  } catch (error) {
    console.error(error);
  }
}

function displayData(planetData, planetName, data, planetColor, planetImg) {
  const lines = data.split('$$SOE');

  const rightAscensionLine = lines[1].slice(24, 35);
  const astLine = lines[1].slice(49, 54)

  const rightAscension = rightAscensionLine.split(' ');
  const RA_hh = Number(rightAscension[0]);
  const RA_mm = Number(rightAscension[1]);
  const degrees = 360 - (RA_hh * 60 + RA_mm) / 4

  const apparentSolarTime = astLine.split(' ')
  const ast_hh = Number(apparentSolarTime[0])
  const ast_mm = Number(apparentSolarTime[1])
  const astdegrees = (ast_hh * 60 + ast_mm) / 4
  const vernalEquinox = 0


  planetDataPre.push({
    bodyName: planetName,
    skyPos: degrees})
  

  let newdegrees
  let newequinox

  function convert(x, y, z) {
    if (planetDataPre[0].skyPos > astdegrees) {
    newdegrees = degrees - (planetData[0].skyPos - astdegrees) 
    newequinox = vernalEquinox - (planetData[0].skyPos - astdegrees)
      if (newdegrees < 0) {
        newdegrees = newdegrees + 360
      }
      if (newequinox < 0) {
        newequinox = newequinox + 360
      }
  } else {
    newdegrees = degrees + (astdegrees - planetDataPre[0].skyPos)
    newequinox = vernalEquinox + (astdegrees - planetDataPre[0].skyPos)
    if (newdegrees > 360) {
      newdegrees = newdegrees - 360
    }
    if (newequinox > 360) {
      newequinox = newequinox - 360
    }
  }
  }
  convert(degrees, astdegrees, vernalEquinox)

  
  planetData.push({
    bodyName: planetName,
    skyPos: newdegrees,
    color: planetColor,
    img: planetImg
  })


aries = newequinox



  console.log(aries)
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height)



var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var radius = 200;
var zodiacSymbols = ["Pisces", "Aquarius", "Capricorn", "Sagittarius", "Scorpio", "Libra", "Virgo", "Leo", "Cancer", "Gemini", "Taurus", "Aries"];
var zodiacColors = ["#6b8e23", "#556b2f", "#8b4513", "#8b0000", "#a52a2a", "#ee82ee", "#4b0082", "#0000ff", "#00ff00", "#ffff00", "#ffa500", "#ff0000"];

    
    ctx.translate(centerX, centerY)
    ctx.rotate(aries * Math.PI / 180)

    // Draw the outer circle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw the inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius - 20, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw the lines dividing the charinto 12 equal parts
    for (var i = 0; i < 12; i++) {
        ctx.save();
        //ctx.translate(centerX, centerY);
        ctx.rotate((i * 30) * Math.PI / 180);
        console.log(planetData, aries)
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -radius + 20);
        ctx.stroke();
        //ctx.rotate(aries * Math.PI / 180);
        //console.log(aries)
        ctx.restore();
    }

    // Draw the zodiac symbols
    for (var i = 0; i < 12; i++) {
        ctx.save();
        //ctx.translate(centerX, centerY);
        ctx.rotate((i * 30 + 15 + 180) * Math.PI / 180);
        ctx.fillStyle = zodiacColors[i];
        ctx.fillText(zodiacSymbols[i], 0, -radius + 12);
        ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);









ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI, false);


for (const planet of planetData) {
  ctx.save();
  const radians = (90 + planet.skyPos) * Math.PI / 180;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.fillStyle = planet.color;
  ctx.fillRect(150, -10, 20, 20);
  ctx.drawImage(planet.img, 150, -15, 30, 30)
  ctx.fillText(planet.bodyName, 100, 0)
  ctx.restore();
  //console.log(planetDataPre)
}

//console.log(planetData, aries)

}
getData()
