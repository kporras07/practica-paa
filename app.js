class PAAApp {
    constructor() {
        this.questions = [];
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.selectedType = '';
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.bindEvents();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            this.questions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }
    
    bindEvents() {
        // Selection buttons
        document.querySelectorAll('.selection-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedType = e.target.dataset.type;
                this.startQuiz();
            });
        });
        
        // Next button
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        
        // Get selected question count
        const questionCount = parseInt(document.getElementById('question-count').value) || 10;
        
        // Prepare questions based on selection
        if (this.selectedType === 'all') {
            this.currentQuestions = [...this.questions.math, ...this.questions.verbal];
        } else if (this.selectedType === 'math') {
            this.currentQuestions = [...this.questions.math];
        } else if (this.selectedType === 'verbal') {
            this.currentQuestions = [...this.questions.verbal];
        }
        
        // Shuffle questions
        this.shuffleArray(this.currentQuestions);
        
        // Limit to selected question count
        this.currentQuestions = this.currentQuestions.slice(0, questionCount);
        
        this.showScreen('question-screen');
        this.displayQuestion();
    }
    
    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update progress
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.currentQuestions.length;
        
        const progressPercent = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
        
        // Display question
        document.getElementById('question-text').textContent = question.question;
        
        // Display options
        const optionsContainer = document.getElementById('question-options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="answer" value="${index}" id="option-${index}">
                <label for="option-${index}">${option}</label>
            `;
            
            // Make entire option clickable
            optionElement.addEventListener('click', () => {
                const radioInput = optionElement.querySelector('input[type="radio"]');
                radioInput.checked = true;
                document.getElementById('next-btn').disabled = false;
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Bind option selection for radio inputs
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', () => {
                document.getElementById('next-btn').disabled = false;
            });
        });
        
        // Reset next button
        document.getElementById('next-btn').disabled = true;
    }
    
    nextQuestion() {
        // Save answer
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const userAnswer = selectedOption ? parseInt(selectedOption.value) : -1;
        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        
        this.userAnswers.push({
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            userAnswer: userAnswer,
            correctAnswer: currentQuestion.correct,
            isCorrect: userAnswer === currentQuestion.correct,
            explanation: currentQuestion.explanation,
            options: currentQuestion.options
        });
        
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        this.saveToLocalStorage();
        
        const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.userAnswers.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Update score display
        document.getElementById('score-percentage').textContent = `${percentage}%`;
        document.getElementById('correct-count').textContent = correctAnswers;
        document.getElementById('total-count').textContent = totalQuestions;
        
        // Display question review
        const reviewContainer = document.getElementById('question-review');
        reviewContainer.innerHTML = '<h3>Revisión de respuestas:</h3>';
        
        this.userAnswers.forEach((answer, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
            
            const statusIcon = answer.isCorrect ? '✓' : '✗';
            const statusClass = answer.isCorrect ? 'correct' : 'incorrect';
            
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="question-number">Pregunta ${index + 1}</span>
                    <span class="status ${statusClass}">${statusIcon}</span>
                </div>
                <p class="review-question">${answer.question}</p>
                <p class="review-answer">
                    Tu respuesta: <span class="${statusClass}">
                        ${answer.userAnswer >= 0 ? answer.options[answer.userAnswer] : 'Sin respuesta'}
                    </span>
                </p>
                ${!answer.isCorrect ? `
                    <p class="review-correct">
                        Respuesta correcta: <span class="correct">${answer.options[answer.correctAnswer]}</span>
                    </p>
                ` : ''}
                <p class="review-explanation">${answer.explanation}</p>
            `;
            
            reviewContainer.appendChild(reviewItem);
        });
        
        this.showScreen('results-screen');
    }
    
    saveToLocalStorage() {
        const results = {
            date: new Date().toISOString(),
            type: this.selectedType,
            score: this.userAnswers.filter(a => a.isCorrect).length,
            total: this.userAnswers.length,
            answers: this.userAnswers
        };
        
        let history = JSON.parse(localStorage.getItem('paa-history') || '[]');
        history.push(results);
        
        // Keep only last 10 results
        if (history.length > 10) {
            history = history.slice(-10);
        }
        
        localStorage.setItem('paa-history', JSON.stringify(history));
    }
    
    restart() {
        this.showScreen('start-screen');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PAAApp();
});