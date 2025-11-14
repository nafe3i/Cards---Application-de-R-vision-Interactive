let score = 0;
let currentQuestion = 0;
let currentQuiz = null;

const quizpar = document.getElementById("tquizs");
const chaqueq = document.getElementById("affiquiz");

async function liresQuizs() {
  const res = await fetch("../data.json");
  const quizzes = await res.json();

  quizpar.innerHTML = "";

  quizzes.forEach((q) => {
    const affichequ = document.createElement("div");
    affichequ.className =
      "flex justify-around m-5 flex-col flex-wrap border-b rounded hover:scale-105";

    const nomQuiz = document.createElement("h3");
    nomQuiz.className = "font-bold text-white text-center";
    nomQuiz.textContent = q.title;

    const nbrQuest = document.createElement("p");
    nbrQuest.className = "text-center";
    nbrQuest.textContent = q.questions.length + " question(s)";

    const btn = document.createElement("button");
    btn.textContent = "Commencer";
    btn.className =
      "w-[50%] mx-auto mt-3 px-4 py-2 bg-green-600 rounded hover:bg-green-700";

    affichequ.appendChild(nomQuiz);
    affichequ.appendChild(nbrQuest);
    affichequ.appendChild(btn);
    quizpar.appendChild(affichequ);

    btn.addEventListener("click", () => {
      quizpar.style.display = "none";
      chaqueq.classList.remove("hidden");
      currentQuiz = q;
      currentQuestion = 0;
      score = 0;
      afficherCartes();
    });
  });
}

function afficherCartes() {
  chaqueq.innerHTML = "";

  const question = currentQuiz.questions[currentQuestion];

  // Titre
  const titre = document.createElement("h3");
  titre.textContent = question.question;
  titre.className = "text-xl font-bold mb-4";
  chaqueq.appendChild(titre);

  const container = document.createElement("div");
  container.className = "flex flex-col gap-3";

  //le type de la question
  if (question.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Entrez votre réponse";
    input.className = "border p-2 rounded";
    container.appendChild(input);
  } else if (question.type === "true_false") {
    ["true", "false"].forEach((val) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "reponse";
      radio.value = val;
      let text = "";
      if (val === "true") {
        text = "Vrai";
      } else {
        text = "Faux";
      }

      label.appendChild(radio);
      label.appendChild(document.createTextNode(text));
      container.appendChild(label);
    });
  } else if (question.type === "multiple_choice") {
    question.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "border px-3 py-1 rounded hover:bg-gray-200";
      btn.addEventListener("click", () => {
        verifierReponse(option);
      });
      container.appendChild(btn);
    });
  }

  chaqueq.appendChild(container);

  // Bouton suivant
  if (question.type !== "multiple_choice") {
    const btnSuivant = document.createElement("button");
    btnSuivant.textContent = "Suivant";
    btnSuivant.className =
      "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
    btnSuivant.addEventListener("click", () => {
      let reponse = "";
      if (question.type === "text") {
        reponse = container.querySelector("input").value.trim();
      } else if (question.type === "true_false") {
        const checked = container.querySelector("input:checked");
        if (checked) reponse = checked.value === "true";
      }
      verifierReponse(reponse);
    });
    chaqueq.appendChild(btnSuivant);
  }
}

function verifierReponse(reponse) {
  const question = currentQuiz.questions[currentQuestion];
  let correct = false;

  if (question.type === "text") {
    correct = question.acceptedAnswers.some(
      (ans) => ans.toLowerCase() === reponse.toLowerCase()
    );
  } else if (
    question.type === "true_false" ||
    question.type === "multiple_choice"
  ) {
    correct = question.correct === reponse;
  }

  if (correct) score++;

  currentQuestion++;
  if (currentQuestion < currentQuiz.questions.length) {
    afficherCartes();
  } else {
    chaqueq.innerHTML = `
      <h3 class="text-xl font-bold">Quiz terminé !</h3>
      <p>Votre score : ${score} / ${currentQuiz.questions.length}</p>
      <button class="mt-3 px-4 py-2 bg-green-600 text-white rounded" onclick="retourQuizs()">Retour aux quiz</button>
    `;
  }
}

function retourQuizs() {
  chaqueq.classList.add("hidden");
  quizpar.style.display = "grid";
}

liresQuizs();
