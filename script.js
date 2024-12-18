let activeplayer = 0;
let player = [];
let score = [0, 0];
let question = [];
let questionIndex = 0;

function start(){
    const player1 = document.getElementById("player-1").value;
    const player2 = document.getElementById("player-2").value;
    player = [player1, player2];

    document.getElementById("container").style.display = "none";
    document.getElementById("container-2").style.display = "block";
    loadingCategories();
}

function loadingCategories(){
    fetch('https://the-trivia-api.com/v2/categories')
        .then(response => response.json())
        .then(data => {
            const selectCategory = document.getElementById('category');
            Object.keys(data).forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                selectCategory.appendChild(option);
            });
    });
}
function fetchquestions(){
    const selectedCategory = document.getElementById('category').value;
    fetch(`https://the-trivia-api.com/api/questions?categories=${selectedCategory}&limit=6`)
        .then(response => response.json())
        .then(data => {
            question = data;
            document.getElementById("container-2").style.display="none";
            document.getElementById("container-3").style.display = "block";
            displayquestion();
        });
}
function displayquestion(){
    const questionData = question[questionIndex];
    document.getElementById('question').textContent = questionData.question;
    document.querySelector('.activePlayer').textContent = `Now ${player[activeplayer]} is Playing`;

    const right_ans = questionData.correctAnswer; 
    const wrong_ans = questionData.incorrectAnswers; 

    const all_ans = wrong_ans.concat([right_ans]).sort(() => {
        Math.random() - 0.5;
    });

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    all_ans.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('option-button');
        button.onclick = () => submitAnswer(answer);
        optionsDiv.appendChild(button);
    });
}

function submitAnswer (selectedAnswer) {
    const right_ans = question[questionIndex].right_ans;
    if (selectedAnswer === right_ans) {
        const difficulty = question[questionIndex].difficulty;
        let points;
        if(difficulty === "easy"){
            points = 10;
        }else if(difficulty === "medium"){
            points = 15;
        }else{
            points = 20;
        }
        score[activeplayer] += points;
    }

    activeplayer = (activeplayer + 1) % 2;
    questionIndex++;
    if(questionIndex < question.length) {
        displayquestion();
    }else{
        finishgame();
    }
}

function finishgame() {
    document.getElementById("container-3").style.display = "none";
    document.getElementById("container-4").style.display = "block";
    let winner;
    if(score[0] > score[1]){
        winner = player[0];
    }else{
        winner = player[1];
    }
    document.getElementById('winner').textContent = `${winner} Wins With ${Math.max(score[0], score[1])} Points!🥳🥳`;
}

function playAgain(){
    activeplayer = 0;
    score = [0,0];
    question = [];
    questionIndex = 0;
    document.getElementById("container-4").style.display = "none";
    document.getElementById("container").style.display = "block";
    loadingCategories();
}
