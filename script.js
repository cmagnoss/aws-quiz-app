document.addEventListener('DOMContentLoaded', () => {
    const setupSection = document.getElementById('setup-section');
    const quizSection = document.getElementById('quiz-section');
    const resultsSection = document.getElementById('results-section');

    const numQuestionsInput = document.getElementById('num-questions');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const explanationText = document.getElementById('explanation-text');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    const overallScoreEl = document.getElementById('overall-score');
    const domainScoresEl = document.getElementById('domain-scores');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');

    let allQuestions = [];
    let currentQuizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let domainScores = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 }, 4: { correct: 0, total: 0 }, 5: { correct: 0, total: 0 } };
    const domainPercentages = { 1: 0.20, 2: 0.24, 3: 0.28, 4: 0.14, 5: 0.14 };
    const domainNames = {
        1: "Fundamentos de IA e ML",
        2: "Fundamentos de IA generativa",
        3: "Aplicações de modelos de base",
        4: "Diretrizes de IA responsável",
        5: "Segurança, conformidade e governança para soluções de IA"
    };

    // --- Fetch Questions --- 
    async function loadQuestions() {
        try {
            const response = await fetch('question_bank.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allQuestions = await response.json();
            // Update max value for input based on available questions
            const maxQuestions = allQuestions.length;
            numQuestionsInput.max = maxQuestions;
            numQuestionsInput.placeholder = `5-${maxQuestions}`;
            document.querySelector('#setup-section .info').textContent = `Nota: O banco de questões atual possui ${maxQuestions} perguntas. Escolha um número entre 5 e ${maxQuestions}.`;

        } catch (error) {
            console.error("Erro ao carregar as perguntas:", error);
            setupSection.innerHTML = "<p>Erro ao carregar as perguntas. Tente recarregar a página.</p>";
        }
    }

    // --- Quiz Logic --- 
    function selectQuestions(totalSelected) {
        let selectedQuestions = [];
        const questionsByDomain = { 1: [], 2: [], 3: [], 4: [], 5: [] };
        allQuestions.forEach(q => questionsByDomain[q.domain].push(q));

        // Shuffle questions within each domain
        for (const domain in questionsByDomain) {
            questionsByDomain[domain].sort(() => Math.random() - 0.5);
        }

        let questionsNeeded = totalSelected;
        let domainCounts = {};

        // Calculate ideal number per domain and take integer part
        for (const domain in domainPercentages) {
            const count = Math.floor(totalSelected * domainPercentages[domain]);
            domainCounts[domain] = count;
            questionsNeeded -= count;
            selectedQuestions.push(...questionsByDomain[domain].slice(0, count));
        }

        // Distribute remaining questions based on fractional parts (or just add sequentially if needed)
        // Simple approach: add remaining questions from domains with most available questions first
        const sortedDomains = Object.keys(domainPercentages).sort((a, b) => questionsByDomain[b].length - questionsByDomain[a].length);

        while (questionsNeeded > 0) {
            let added = false;
            for (const domain of sortedDomains) {
                if (questionsNeeded <= 0) break;
                const currentCount = domainCounts[domain] || 0;
                if (questionsByDomain[domain].length > currentCount) {
                    selectedQuestions.push(questionsByDomain[domain][currentCount]);
                    domainCounts[domain] = currentCount + 1;
                    questionsNeeded--;
                    added = true;
                }
            }
             if (!added && questionsNeeded > 0) { // Fallback if somehow questions run out
                 console.warn("Não foi possível selecionar o número exato de perguntas distribuídas perfeitamente. Completando com perguntas disponíveis.");
                 const remainingAvailable = allQuestions.filter(q => !selectedQuestions.some(sq => sq.question === q.question));
                 selectedQuestions.push(...remainingAvailable.slice(0, questionsNeeded));
                 questionsNeeded = 0;
             }
        }

        // Final shuffle
        selectedQuestions.sort(() => Math.random() - 0.5);
        return selectedQuestions;
    }

    function startQuiz() {
        const numSelected = parseInt(numQuestionsInput.value);
        const maxQuestions = allQuestions.length;

        if (isNaN(numSelected) || numSelected < 5 || numSelected > maxQuestions) {
            alert(`Por favor, escolha um número de perguntas entre 5 e ${maxQuestions}.`);
            return;
        }

        currentQuizQuestions = selectQuestions(numSelected);
        currentQuestionIndex = 0;
        score = 0;
        domainScores = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 }, 4: { correct: 0, total: 0 }, 5: { correct: 0, total: 0 } };

        setupSection.style.display = 'none';
        resultsSection.style.display = 'none';
        quizSection.style.display = 'block';
        feedbackContainer.style.display = 'none';

        displayQuestion();
    }

    function displayQuestion() {
        feedbackContainer.style.display = 'none';
        const question = currentQuizQuestions[currentQuestionIndex];
        questionCounter.textContent = `Pergunta ${currentQuestionIndex + 1} de ${currentQuizQuestions.length}`;
        questionText.textContent = question.question;
        optionsContainer.innerHTML = ''; // Clear previous options

        // Increment total count for the domain
        domainScores[question.domain].total++;

        for (const key in question.options) {
            const button = document.createElement('button');
            button.textContent = `${key}: ${question.options[key]}`;
            button.classList.add('option-btn');
            button.dataset.answer = key;
            button.addEventListener('click', handleAnswer);
            optionsContainer.appendChild(button);
        }
    }

    function handleAnswer(event) {
        const selectedOption = event.target;
        const selectedAnswer = selectedOption.dataset.answer;
        const question = currentQuizQuestions[currentQuestionIndex];
        const correctAnswer = question.answer;

        // Disable all buttons
        const optionButtons = optionsContainer.querySelectorAll('.option-btn');
        optionButtons.forEach(button => button.disabled = true);

        if (selectedAnswer === correctAnswer) {
            score++;
            domainScores[question.domain].correct++;
            selectedOption.classList.add('correct');
            feedbackText.textContent = 'Correto!';
            feedbackText.className = 'correct';
        } else {
            selectedOption.classList.add('incorrect');
            feedbackText.textContent = `Incorreto. A resposta correta era ${correctAnswer}.`;
            feedbackText.className = 'incorrect';
            // Highlight the correct answer
            optionButtons.forEach(button => {
                if (button.dataset.answer === correctAnswer) {
                    button.classList.add('correct');
                }
            });
        }

        explanationText.textContent = `Explicação: ${question.explanation || 'Nenhuma explicação disponível.'}`;
        feedbackContainer.style.display = 'block';

        // Change button text if it's the last question
        if (currentQuestionIndex === currentQuizQuestions.length - 1) {
            nextQuestionBtn.textContent = 'Ver Resultados';
        } else {
            nextQuestionBtn.textContent = 'Próxima Pergunta';
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuizQuestions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizSection.style.display = 'none';
        resultsSection.style.display = 'block';

        const overallPercentage = ((score / currentQuizQuestions.length) * 100).toFixed(1);
        overallScoreEl.textContent = `Pontuação Geral: ${score} de ${currentQuizQuestions.length} (${overallPercentage}%)`;

        domainScoresEl.innerHTML = ''; // Clear previous results
        for (const domain in domainScores) {
            const stats = domainScores[domain];
            if (stats.total > 0) {
                const percentage = ((stats.correct / stats.total) * 100).toFixed(1);
                const li = document.createElement('li');
                li.textContent = `${domainNames[domain]} (Domínio ${domain}): ${stats.correct} de ${stats.total} (${percentage}%)`;
                domainScoresEl.appendChild(li);
            }
        }
    }

    function restartQuiz() {
        resultsSection.style.display = 'none';
        setupSection.style.display = 'block';
        numQuestionsInput.value = 10; // Reset to default
    }

    // --- Event Listeners --- 
    startQuizBtn.addEventListener('click', startQuiz);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartQuizBtn.addEventListener('click', restartQuiz);

    // --- Initial Load --- 
    loadQuestions();
});

