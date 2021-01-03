/**
 * @description The raw dinosaur data, put in function to avoid global variable
 * @returns An array of dinosaur objects (plus a pigeon)
 */
function rawDinoData() {
  const url =
    "https://raw.githubusercontent.com/YassineSIDKI/JavaScript-dinos/main/dino.json";
  const dataJSON = readTextFile(url);
  const dinos = JSON.parse(dataJSON);
  return dinos;
}

/**
 * @description Represents a dinosaur object
 * @constructor
 * @param {Object} dinoData A single dinosaur object containing facts
 * @param {string} units 'metric' or 'imperial' for height and weight
 */
function DinoConstructor(dinoData, units) {
  this.species = dinoData.species;
  this.diet = dinoData.diet;
  this.where = dinoData.where;
  this.when = dinoData.when;
  this.fact = dinoData.fact;

  if (units === "metric") {
    this.weight = Math.round(dinoData.weight / 2.21);
    this.height = Math.round(dinoData.height * 2.54);
  } else {
    this.weight = dinoData.weight;
    this.height = dinoData.height;
  }
}

const protoDino = {
  compareWeight: function (humanWeight) {
    const weightRatio = (this.weight / humanWeight).toFixed(1);
    if (weightRatio > 1) {
      return `${this.species} weighed ${(this.weight / humanWeight).toFixed(
        1
      )} times more than you!`;
    }
    if (weightRatio < 1) {
      return `You weigh ${(humanWeight / this.weight).toFixed(
        1
      )} times more than ${this.species}!`;
    }
    return `You weigh the same as ${this.species}!`;
  },
  compareHeight: function (humanHeight) {
    const heightRatio = (this.height / humanHeight).toFixed(1);
    if (heightRatio > 1) {
      return `${this.species} was ${(this.height / humanHeight).toFixed(
        1
      )} times taller than you!`;
    }
    if (heightRatio < 1) {
      return `You are ${(humanHeight / this.height).toFixed(
        1
      )} times taller than ${this.species}!`;
    }
    return `You are the same height as ${this.species}!`;
  },
  compareDiet: function (humanDiet) {
    const article = humanDiet === "omnivore" ? "an" : "a";

    if (humanDiet === this.diet) {
      return `You are ${article} ${humanDiet} and ${this.species} was too!`;
    } else {
      return `You are ${article} ${humanDiet}, but ${this.species} was a ${this.diet}.`;
    }
  },
};

DinoConstructor.prototype = protoDino;

/**
 * @description Creates the dinosaur object array by calling constructor, inserts a human placeholder for proper iteration later
 * @param {string} units 'metric' or 'imperial' for height and weight
 * @returns {Array} Array of dinosaur objects from constructor
 */
function createDinoArray(units) {
  const dinos = rawDinoData();
  let dinoArray = [];

  for (var i = 0, len = Object.keys(dinos.Dinos).length; i < len; i++) {
    dinoArray.push(new DinoConstructor(dinos.Dinos[i], units));
  }

  dinoArray.splice(4, 0, "human placeholder");

  return dinoArray;
}

/**
 * @description Creates a grid element for a dinosaur object
 * @param {Object} dinoData An object representing a single dinosaur
 * @param {Object} humanData Data grabbed from the user's input form
 * @returns {Element} An element to be added to the grid in the UI
 */
function createDinoElement(dinoData, humanData) {
  let fact;
  const randomNumber =
    dinoData.species === "Pigeon" ? 2 : Math.round(Math.random() * 5);

  switch (randomNumber) {
    case 0:
      fact = `The ${dinoData.species} lived in ${dinoData.where}.`;
      break;
    case 1:
      fact = `The ${dinoData.species} lived in the ${dinoData.when} period.`;
      break;
    case 2:
      fact = dinoData.fact;
      break;
    case 3:
      fact = dinoData.compareWeight(humanData.weight);
      break;
    case 4:
      fact = dinoData.compareHeight(humanData.height);
      break;
    case 5:
      fact = dinoData.compareDiet(humanData.diet);
      break;
    default:
      fact = "Dinosaurs are cool!";
  }

  const newDiv = document.createElement("div");
  newDiv.className = "grid-item";
  newDiv.innerHTML = `<h3>${
    dinoData.species
  }</h3><img src="images/${dinoData.species.toLowerCase()}.png" alt="image of ${
    dinoData.species
  }"><p>${fact}</p>`;

  return newDiv;
}

/**
 * @description Get the user's data from the contact form
 * @returns An object containing the user's data
 */
function getHumanData() {
  let height, weight, units;

  if (document.getElementById("metric").checked) {
    height = document.getElementById("height-metric").value;
    weight = document.getElementById("weight-metric").value;
    units = "metric";
  } else {
    height =
      document.getElementById("feet").value * 12 +
      Number(document.getElementById("inches").value);
    weight = document.getElementById("weight-imperial").value;
    units = "imperial";
  }

  const humanData = {
    name: document.getElementById("name").value,
    height: height,
    weight: weight,
    diet: document.getElementById("diet").value,
    units: units,
  };

  return humanData;
}

/**
 * @description Creates a grid element for the human object
 * @param {Object} humanData Data grabbed from the user's input form
 * @returns {Element} An element to be added to the grid in the UI
 */
function createHumanElement(humanData) {
  const newDiv = document.createElement("div");
  newDiv.className = "grid-item";
  newDiv.innerHTML = `<h3>${humanData.name}</h3><img src="images/human.png" alt="image of human">`;

  return newDiv;
}

/**
 * @description Resets the UI elements if the user wants to try again
 */
function repeat() {
  document.getElementById("error").innerHTML = "";
  document.getElementById("grid").innerHTML = "";
  document.getElementById("repeat-btn").style.display = "none";
  document.querySelector("form").style.display = "block";
}

/**
 * @description Creates the grid for the UI result
 * @param {Array} dinoArray Array of dinosaur objects
 * @param {Object} humanData The user's data object
 */
function updateUI(dinoArray, humanData) {
  document.querySelector("form").style.display = "none";

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < Object.keys(dinoArray).length; i++) {
    let gridSquare =
      i === 4
        ? createHumanElement(humanData)
        : createDinoElement(dinoArray[i], humanData);

    fragment.appendChild(gridSquare);
  }

  document.getElementById("grid").appendChild(fragment);
  document.getElementById("repeat-btn").style.display = "block";
}

/**
 * @description Called when the user clicks the submit button, main function of the program which calls the other parts of the sequence
 * @param {event} e The click event on the form's submit button
 */
function clicked(e) {
  e.preventDefault();

  const humanData = getHumanData();

  const errorMessage = document.getElementById("error");
  if (humanData.name === "") {
    errorMessage.innerHTML = "<p>Enter a name please</p>";
    return;
  } else if (humanData.height < 1) {
    errorMessage.innerHTML = "<p>Enter a height greater than 0</p>";
    return;
  } else if (humanData.weight < 1) {
    errorMessage.innerHTML = "<p>Enter a weight greater than 0</p>";
    return;
  }

  const dinoArray = createDinoArray(humanData.units);

  updateUI(dinoArray, humanData);
}

/**
 * @description Called when the user changes units in the form, sets or hides the metric and imperial height and weight input elements
 */
function changeUnits() {
  if (document.getElementById("metric").checked) {
    document.getElementById("metric-form").style.display = "block";
    document.getElementById("imperial-form").style.display = "none";
  } else {
    document.getElementById("metric-form").style.display = "none";
    document.getElementById("imperial-form").style.display = "block";
  }
}

/**
 * @description IIFE to attach the event listeners on the buttons
 */
(function () {
  document.getElementById("btn").addEventListener("click", clicked);
  document.getElementById("repeat-btn").addEventListener("click", repeat);
})();

/**
 * description Called in the begining to load the dinos json file
 * @param {string} file The url of the json file containing dinos objects
 */
function readTextFile(file) {
  let rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
      }
    }
  };

  rawFile.send(null);

  return allText;
}
