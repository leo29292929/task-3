document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch JSON data
    function loadJson() {
        return fetch('task3.json')
            .then(response => response.json())
            .then(data => {
                console.log('Fetch is true');
                return data;
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                return null;
            });
    }

    let questionNumber = 1;
    let correctAnswersCount = 0; // Counter for correct answers
    let questions; // Array to store the questions
    let currentQuestionIndex = 0; // To track the current question index

    // Function to get random questions
    function getRandomQuestions(questions, count) {
        let selectedQuestions = [];
        let usedIndices = new Set();

        while (selectedQuestions.length < count) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            if (!usedIndices.has(randomIndex)) {
                selectedQuestions.push(questions[randomIndex]);
                usedIndices.add(randomIndex);
            }
        }

        return selectedQuestions;
    }

    // Function to process the JSON data
    function processJson(data) {
        if (data) {
            const easyQuestions = getRandomQuestions(data.easy_questions, 4);
            const mediumQuestions = getRandomQuestions(data.medium_questions, 4);
            const difficultQuestions = getRandomQuestions(data.difficult_questions, 2);

            questions = [...easyQuestions, ...mediumQuestions, ...difficultQuestions];

            displayQuestionsOneAtATime();
            return 'true'; // Indicate successful processing
        } else {
            console.log('No data to process');
            return 'false'; // Indicate failed processing
        }
    }

    // Function to display questions one at a time
    function displayQuestionsOneAtATime() {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = ''; // Clear previous content
        
        if (currentQuestionIndex >= questions.length) {
            // Display final score
            const finalScoreOuterBox = document.createElement('div');
            finalScoreOuterBox.className = 'final-score-outerbox';
        
            const finalScore = document.createElement('div');
            finalScore.className = 'final-score';
            finalScore.textContent = `Final Score: ${correctAnswersCount} out of ${questions.length}`;
        
            finalScoreOuterBox.appendChild(finalScore);
            questionContainer.appendChild(finalScoreOuterBox);
            return;
        }
        
        const question = questions[currentQuestionIndex];

        // Create outer box
        const outerBox = document.createElement('div');
        outerBox.className = 'outer-box';

        // Create score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display';
        // scoreDisplay.textContent = `Score: ${correctAnswersCount}`;

        // Create question box
        const questionBox = document.createElement('div');
        questionBox.className = 'question-box';
        questionBox.textContent = `${questionNumber} - ${question.description}`;
        
        // Create input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter your answer here...';

        // Create check button
        const checkButton = document.createElement('button');
        checkButton.textContent = 'Check';

        checkButton.addEventListener('click', () => {
            handleAnswer(inputField.value.trim(), question);
        });

        // Handle Enter key press
        inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleAnswer(inputField.value.trim(), question);
            }
        });

        // Append score display, question box, input field, and button to outer box
        outerBox.appendChild(scoreDisplay);
        outerBox.appendChild(questionBox);
        outerBox.appendChild(inputField);
        outerBox.appendChild(checkButton);

        // Append outer box to container
        questionContainer.appendChild(outerBox);
    }

    // Function to handle the answer
    function handleAnswer(userAnswer, question) {
        if (!isValidAnswer(userAnswer)) {
            alert('Don\'t try to cheat. Please enter a valid answer.');
            return; // Stay on the same question
        }

        // Check the answer and update the score
        checkAnswer(userAnswer, question);

        // Move to the next question
        currentQuestionIndex++;
        questionNumber++;
        displayQuestionsOneAtATime();
    }

    // Function to validate the user input
    function isValidAnswer(answer) {
        // Check for invalid answers (empty, single letter/number/symbol)
        return answer.length > 1;
    }

    // Function to check the user's answer
    function checkAnswer(userAnswer, question) {
        // Create a RegExp object from the regex pattern in the question
        const regexPattern = new RegExp(question.regex);

        // Validate the user's answer against the regex pattern
        const isCorrect = regexPattern.test(userAnswer) && 
                          !question.non_matches.includes(userAnswer);

        if (isCorrect) {
            correctAnswersCount++;
            console.log(`Correct answer for question ${questionNumber}: ${userAnswer}`);
        } else {
            console.log(`Incorrect answer for question ${questionNumber}: ${userAnswer}`);
        }
    }

    // Call the loadJson function and pass the result to processJson
    loadJson()
        .then(processJson)
        .then(result => {
            console.log(result === 'true'); // Log whether the result is 'true'
        });
});
