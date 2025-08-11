//DOM SELECTION 
const categoryInput = document.querySelector("#categoryMenu");
const difficultyInput = document.querySelector("#difficultyOptions");
const numbersInput = document.querySelector("#questionsNumber");
const startQuiz = document.querySelector("#startQuiz");
const form = document.querySelector("#quizOptions");
const rowData = document.querySelector("#rowData");
//Variables
let questionsArray = [];
let myQuiz = {};
//Expression Functions
const initiateQuiz = async () => {
    const values = {
        category: categoryInput.value,
        difficulty: difficultyInput.value,
        numbers: numbersInput.value
    };
    myQuiz = new Quiz(values); //Instantiate a new Quiz Object from Quiz Class
    questionsArray = await myQuiz.getQuestions();
    console.log(questionsArray);
    myQuiz.hideForm();
    let question = new Question(0);//Instantiate a new question object from Questions Class
    question.displayQuestion();
    console.log(question, "Current Question");
}
//Classes
class Quiz {
    constructor({ category, difficulty, numbers }) {
        this.score = 0;
        this.category = category;
        this.difficulty = difficulty;
        this.numbers = numbers;
    }
    getQuestions = async () => {
        try {
            let response = await fetch(`https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`);
            response = await response.json();
            return response.results;
        } catch (error) {
            console.log(error);
        }
    }
    hideForm = () => {
        form.classList.add("d-none");
    }
    showFinalResults = () => {
        rowData.innerHTML = `
        <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0 text-center">
        ${this.score === questionsArray.length ? `CongratulationS! 🎉🎉` : `Better luck next time, You answered ${this.score} out of ${questionsArray.length} questions!`}
        </h2>
            <button class="again btn btn-primary rounded-pill" id="restartQuiz"><i class="bi bi-arrow-repeat"></i> Try Again</button>
</div>
        `
        const restartBtn = document.querySelector("#restartQuiz");
        restartBtn.addEventListener("click", () => {
            window.location.reload();
        })
    }
}
class Question {
    constructor(i) {
        this.index = i
        this.difficulty = questionsArray[i].difficulty;
        this.category = questionsArray[i].category;
        this.question = questionsArray[i].question;
        this.correctAnswer = questionsArray[i].correct_answer;
        this.incorrectAnswers = questionsArray[i].incorrect_answers;
        this.allAnswers = this.mergeAllAnswers();
        this.isAnswered = false;
    }
    displayQuestion = () => {
        rowData.innerHTML = `
        <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        <div class="w-100 d-flex justify-content-between">
        <span class="btn btn-category">${this.category}</span>
        <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${questionsArray.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.allAnswers.map((answer) => `<li>${answer}</li>`).toString().replaceAll(",", "")}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${myQuiz.score}</h2>
        </div>
        `;
        const choices = document.querySelectorAll("ul li");
        choices.forEach((choice) => choice.addEventListener("click", () => {
            this.checkAnswer(choice);
        }))
    }
    mergeAllAnswers = () => {
        let allAnswersArray = [...this.incorrectAnswers, this.correctAnswer].sort();
        return allAnswersArray;
    };
    checkAnswer = (answer) => {
        if (this.isAnswered === false) {
            this.isAnswered = true;
            if (answer.innerHTML === this.correctAnswer) {
                console.log('true');
                myQuiz.score++;
                answer.classList.add("correct", "animate__animated", "animate__pulse");
            }
            else {
                console.log('false');
                answer.classList.add("wrong", "animate__animated", "animate__shakeX");
            }
            this.getNextQuestion();
        }
    }
    getNextQuestion = () => {
        this.index++;
        if (this.index < questionsArray.length) {
            setTimeout(() => {
                console.log(this.index, 'New Index');
                let nextQuestion = new Question(this.index); //
                console.log(nextQuestion, "Next Question");
                nextQuestion.displayQuestion();
            }, 1000);
        }
        else {
            setTimeout(() => {
                myQuiz.showFinalResults();
            }, 1000);
        }
    }

}
//Event Listeners
startQuiz.addEventListener("click", () => {
    initiateQuiz();
});

