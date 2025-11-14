// Éléments DOM
const collection_input = document.getElementById("collection");
const collection_submit = document.getElementById("getcoll");
const collection_list = document.getElementById("infocol");
const card_question = document.getElementById("question");
const card_answer = document.getElementById("reponse");
const add_card = document.getElementById("inforep");
const div_coll = document.getElementById("affichage");
const messageBox = document.getElementById("ecrire");
const affichage_cards = document.getElementById("affichage_cards");

// Charger les collections
let collections = JSON.parse(localStorage.getItem("collections_local") || "[]");

// Affichage message
function showMessage(text, type = "info") {
  messageBox.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = text;
  p.className = `p-2 rounded text-center font-semibold ${
    type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
  }`;
  messageBox.appendChild(p);
  setTimeout(() => (messageBox.innerHTML = ""), 2000);
}

// Mettre à jour l'affichage des collections
function majCollections() {
  div_coll.innerHTML = "";
  collection_list.innerHTML =
    '<option value="">Choisir une collection</option>';

  collections.forEach((col, index) => {
    // Option dans le select
    const opt = document.createElement("option");
    opt.value = col.title;
    opt.textContent = col.title;
    collection_list.appendChild(opt);

    // Bloc collection
    const div_child = document.createElement("div");
    div_child.className =
      "bg-gray-700 p-2 rounded-md font-bold border hover:bg-gray-900 cursor-pointer flex flex-col items-center transition";

    const h3Title = document.createElement("h3");
    h3Title.textContent = col.title;

    const h3Count = document.createElement("h3");
    h3Count.textContent = col.cards.length + " cartes";
    h3Count.className = "text-sm font-normal text-gray-300";

    const supprimer = document.createElement("button");
    supprimer.className =
      "bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm mt-1";
    supprimer.textContent = "Supprimer";

    // Supprimer collection
    supprimer.addEventListener("click", (e) => {
      e.stopPropagation();
      collections.splice(index, 1);
      localStorage.setItem("collections_local", JSON.stringify(collections));
      majCollections();
      showMessage("Collection supprimée avec succès", "success");
      affichage_cards.innerHTML = "";
    });

    // Afficher cartes
    div_child.addEventListener("click", () => {
      afficherCartes(col);
    });

    div_child.appendChild(h3Title);
    div_child.appendChild(h3Count);
    div_child.appendChild(supprimer);
    div_coll.appendChild(div_child);
  });
}

// Ajouter collection
collection_submit.addEventListener("click", () => {
  const titre = collection_input.value.trim();
  if (titre === "")
    return showMessage("Veuillez entrer un nom de collection !", "error");

  if (collections.some((c) => c.title === titre))
    return showMessage("Cette collection existe déjà !", "error");

  collections.push({ title: titre, cards: [] });
  localStorage.setItem("collections_local", JSON.stringify(collections));
  collection_input.value = "";
  majCollections();
  showMessage(`Collection "${titre}" créée avec succès !`, "success");
});

// Ajouter carte
add_card.addEventListener("click", () => {
  const question = card_question.value.trim();
  const answer = card_answer.value.trim();
  const selectedTitle = collection_list.value;

  if (!selectedTitle)
    return showMessage("Veuillez choisir une collection !", "error");
  if (question === "" || answer === "")
    return showMessage("Veuillez remplir question et réponse !", "error");

  const selectedCollection = collections.find((c) => c.title === selectedTitle);
  selectedCollection.cards.push({ question, answer });
  localStorage.setItem("collections_local", JSON.stringify(collections));

  card_question.value = "";
  card_answer.value = "";
  majCollections();
  showMessage("Carte ajoutée avec succès !", "success");
  afficherCartes(selectedCollection);
});

// Afficher cartes avec Flip et bouton fermer
function afficherCartes(collection) {
  affichage_cards.innerHTML = "";

  if (collection.cards.length === 0) {
    affichage_cards.innerHTML =
      '<p class="text-center text-gray-400">Aucune carte dans ' +
      collection.title +
      "</p>";
    return;
  }

  collection.cards.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card w-full h-56 relative cursor-pointer";

    cardDiv.innerHTML = `
  <div class="card-inner rounded-2xl shadow-lg shadow-blue-600/30">
    <div class="card-front flex flex-col justify-center items-center  bg-blue-800">
      <h3 class="text-xl font-semibold mb-3 text-yellow-200">Question</h3>
      <p class="text-gray-100">${card.question}</p>
    </div>
    <div class="card-back flex flex-col justify-center items-center bg-amber-50">
      <h3 class="text-xl font-semibold mb-3 text-green-300">Réponse</h3>
      <p class="text-white">${card.answer}</p>
    </div>
  </div>
  <button class="fermer absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">
    Fermer
  </button>
  
`;
    // Flip
    cardDiv
      .querySelector(".card-inner")
      .addEventListener("click", function (e) {
        // Evite que le clic sur "fermer" flip la carte
        if (e.target.classList.contains("fermer")) return;
        cardDiv.classList.toggle("flipped");
      });

    // Bouton Fermer
    cardDiv.querySelector(".fermer").addEventListener("click", function (e) {
      e.stopPropagation();
      cardDiv.style.display = "none"; // cache seulement cette carte
    });

    affichage_cards.appendChild(cardDiv);
  });
}

// Initialisation
window.addEventListener("DOMContentLoaded", majCollections);
