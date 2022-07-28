let ynav = 0;
let clicks = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const weekdaysNames = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const url = "http://localhost:5500/blocked.json";

const LoadData = new Promise((resolve, reject) => {
  let done = true;
  if (done) {
    const data = fetch(url).then(function (result) {
      return result.json();
    });
    const getData = resolve(data);
  } else {
    reject();
  }
});

function load() {
  const dt = new Date();

  if (ynav !== 0) {
    dt.setFullYear(new Date().getFullYear() + ynav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  document.getElementById("calendar").innerHTML = "";
  document.getElementById("yearDisplay").innerText = `${year}`;

  //console.log(monthString);
  //console.log('months count: '+months.length)

  for (let i = 0; i < months.length; i++) {
    const monthSquere = document.createElement("div");
    monthSquere.classList.add("month");
    calendar.appendChild(monthSquere);

    const monthName = document.createElement("div");
    monthName.classList.add("monthname");
    monthName.innerText = months[i];
    monthSquere.appendChild(monthName);

    for (let wd = 0; wd < weekdaysNames.length; wd++) {
      const weekdaysSquere = document.createElement("div");
      weekdaysSquere.classList.add("weekdays");
      weekdaysSquere.innerText = weekdaysNames[wd];
      monthSquere.appendChild(weekdaysSquere);
    }

    const firstDayOfMonth = new Date(year, i, 1);
    const daysInmonth = new Date(year, i + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString("en-ie", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
    const curentdayweek = weekdays.indexOf(dateString.split(", "));

    for (let d = 1; d <= paddingDays + daysInmonth; d++) {
      const daySquare = document.createElement("div");

      if (d > paddingDays) {
        daySquare.classList.add("day");
        daySquare.innerText = d - paddingDays;
        const cDay = d - paddingDays;
        const forunix = new Date(`${year}/${i + 1}/${cDay}`);
        const unixTimestamp = Math.floor(new Date(forunix).getTime() / 1000);

        daySquare.setAttribute("data-day", unixTimestamp);
        const weekdayN = new Date(year, i, cDay).toLocaleString("en-ie", {
          weekday: "long",
        });
        daySquare.classList.add(weekdayN);
      } else {
        daySquare.classList.add("padding");
        daySquare.innerText = " ";
      }

      monthSquere.appendChild(daySquare);
    }
  }

  LoadData.then((value) => {
    for (let i = 0; i < value.length; i++) {
      if (value[i].name == "ARABELLA")
        arabella(timefix(value[i].from), timefix(value[i].to));
    }
  }).catch((reject) => {
    console.log(error);
  });

  // blockDates(1641513600,1642204800);
  //     swapbw(1647388800,1648681200);
  //     swapbw(1660777200,1661727600);
  //     swapbw(1667779200,1669766400);
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    ynav++;
    load();
  });
  document.getElementById("backButton").addEventListener("click", () => {
    ynav--;
    load();
  });
}

function blockDates(bFrom, bTo) {
  var elementsA = (allHiddenElements = document.getElementsByClassName("day"));

  Array.prototype.forEach.call(elementsA, function (el) {
    // Do stuff here
    let nValue = el.getAttribute("data-day");
    if (nValue >= bFrom && nValue <= bTo) {
      //console.log(el.getAttribute('data-day'));
      el.classList.add("blocked");
    }
  });
}
function arabella(bFrom, bTo) {
  var elementsA = (allHiddenElements = document.getElementsByClassName("day"));

  Array.prototype.forEach.call(elementsA, function (el) {
    // Do stuff here
    let nValue = el.getAttribute("data-day");
    if (nValue >= bFrom && nValue <= bTo) {
      //console.log(el.getAttribute('data-day'));
      el.classList.add("swap-both-ways");
      if (nValue == bFrom) {
        el.classList.add("first-block");
      } else if (nValue == bTo) {
        el.classList.add("last-block");
      }
    }
  });
}

function timefix(unixtime) {
  var date = new Date(unixtime * 1000);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const data = Math.floor(new Date(`${year}/${month}/${day}`).getTime() / 1000);
  return data;
}

initButtons();
load();
