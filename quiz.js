// Quiz JavaScript for Logistics Quiz

class QuizGame {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.questions = [];
        this.selectedCategory = null;
        this.usedHelps = {
            scenario: false,
            teacher: false,
            team: false
        };
        this.answers = [];
        this.isAnswered = false;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.startQuiz();
    }
    
    loadData() {
        const data = JSON.parse(localStorage.getItem('quizData'));
        this.selectedCategory = localStorage.getItem('selectedCategory');
        
        if (!data || !this.selectedCategory) {
            window.location.href = 'index.html';
            return;
        }
        
        // Filter questions by category
        this.questions = data.questions.filter(q => q.category === this.selectedCategory);
        
        if (this.questions.length === 0) {
            alert('Nenhuma pergunta encontrada para esta categoria!');
            window.location.href = 'index.html';
            return;
        }
        
        // Shuffle questions
        this.questions = this.shuffleArray(this.questions);
        
        // Get category info
        this.categoryInfo = data.categories.find(c => c.id === this.selectedCategory);
        this.settings = data.settings;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    setupEventListeners() {
        // Help buttons
        document.getElementById('help-scenario').addEventListener('click', () => this.useHelp('scenario'));
        document.getElementById('help-teacher').addEventListener('click', () => this.useHelp('teacher'));
        document.getElementById('help-team').addEventListener('click', () => this.useHelp('team'));
        
        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        
        // Modal close buttons
        document.getElementById('close-help-modal').addEventListener('click', () => this.closeHelpModal());
        document.getElementById('close-help-btn').addEventListener('click', () => this.closeHelpModal());
        document.getElementById('continue-btn').addEventListener('click', () => this.closeResultModal());
        
        // Final results buttons
        document.getElementById('play-again-btn').addEventListener('click', () => this.playAgain());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    }
    
    startQuiz() {
        this.updateProgress();
        this.loadQuestion();
    }
    
    updateProgress() {
        const currentQuestionSpan = document.getElementById('current-question');
        const totalQuestionsSpan = document.getElementById('total-questions');
        const progressBar = document.getElementById('progress-bar');
        
        currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        totalQuestionsSpan.textContent = this.questions.length;
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showFinalResults();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        this.isAnswered = false;
        
        // Update category badge
        document.getElementById('category-badge').textContent = this.categoryInfo.name;
        
        // Update question text
        document.getElementById('question-text').textContent = question.question;
        
        // Load answer options
        this.loadAnswerOptions(question);
        
        // Reset timer
        this.timeLeft = question.timer || this.settings.defaultTimer;
        this.startTimer();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Reset help buttons for new question
        this.resetHelpButtons();
        
        // Add animation
        document.querySelector('.bg-white.rounded-lg.shadow-lg.p-8.mb-6').classList.add('animate-fade-in');
    }
    
    loadAnswerOptions(question) {
        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'answer-option w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-transparent transition-all duration-300';
            optionElement.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        ${String.fromCharCode(65 + index)}
                    </div>
                    <span class="text-gray-800">${option}</span>
                </div>
            `;
            
            optionElement.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionElement);
        });
    }
    
    selectAnswer(selectedIndex) {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        this.stopTimer();
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Calculate score
        let points = 0;
        if (isCorrect) {
            points = this.settings.pointsCorrect + (this.timeLeft * this.settings.timeBonus);
            this.score += points;
        }
        
        // Store answer
        this.answers.push({
            questionIndex: this.currentQuestionIndex,
            selectedAnswer: selectedIndex,
            correct: isCorrect,
            points: points,
            timeLeft: this.timeLeft
        });
        
        // Update score display
        document.getElementById('score').textContent = this.score;
        
        // Show answer feedback
        this.showAnswerFeedback(selectedIndex, question, isCorrect);
        
        // Show result modal
        setTimeout(() => {
            this.showResultModal(isCorrect, question.explanation, points);
        }, 1000);
    }
    
    showAnswerFeedback(selectedIndex, question, isCorrect) {
        const options = document.querySelectorAll('.answer-option');
        
        options.forEach((option, index) => {
            option.classList.add('disabled');
            
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Add confetti for correct answers
        if (isCorrect) {
            this.showConfetti();
        }
    }
    
    showConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 50; i++) {
            const confettiPiece = document.createElement('div');
            confettiPiece.className = 'confetti-piece';
            confettiPiece.style.left = Math.random() * 100 + '%';
            confettiPiece.style.animationDelay = Math.random() * 3 + 's';
            confettiPiece.style.backgroundColor = ['#3b82f6', '#f97316', '#10b981', '#fbbf24'][Math.floor(Math.random() * 4)];
            confettiContainer.appendChild(confettiPiece);
        }
        
        setTimeout(() => {
            confettiContainer.remove();
        }, 3000);
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer-display');
        const timerBar = document.getElementById('timer-bar');
        
        timerDisplay.textContent = `${this.timeLeft}s`;
        
        const question = this.questions[this.currentQuestionIndex];
        const totalTime = question.timer || this.settings.defaultTimer;
        const percentage = (this.timeLeft / totalTime) * 100;
        
        timerBar.style.width = `${percentage}%`;
        
        // Change color based on time left
        if (percentage <= 25) {
            timerBar.className = 'timer-bar danger h-2 rounded-full transition-all duration-1000';
        } else if (percentage <= 50) {
            timerBar.className = 'timer-bar warning h-2 rounded-full transition-all duration-1000';
        } else {
            timerBar.className = 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-1000';
        }
    }
    
    timeUp() {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        this.stopTimer();
        
        const question = this.questions[this.currentQuestionIndex];
        
        // Store answer as incorrect
        this.answers.push({
            questionIndex: this.currentQuestionIndex,
            selectedAnswer: -1, // No answer selected
            correct: false,
            points: 0,
            timeLeft: 0
        });
        
        // Show correct answer
        const options = document.querySelectorAll('.answer-option');
        options.forEach((option, index) => {
            option.classList.add('disabled');
            if (index === question.correct) {
                option.classList.add('correct');
            }
        });
        
        // Show result modal
        setTimeout(() => {
            this.showResultModal(false, question.explanation, 0, true);
        }, 1000);
    }
    
    useHelp(helpType) {
        if (this.usedHelps[helpType] || this.isAnswered) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const helpContent = question.helps[helpType];
        
        if (!helpContent) {
            alert('Ajuda não disponível para esta pergunta.');
            return;
        }
        
        this.usedHelps[helpType] = true;
        this.updateHelpButton(helpType);
        this.showHelpModal(helpType, helpContent);
    }
    
    updateHelpButton(helpType) {
        const button = document.getElementById(`help-${helpType}`);
        button.classList.add('used');
        button.disabled = true;
    }
    
    resetHelpButtons() {
        // Don't reset used helps - they should remain used for the entire quiz
        const helpButtons = ['help-scenario', 'help-teacher', 'help-team'];
        helpButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            const helpType = buttonId.replace('help-', '');
            
            if (this.usedHelps[helpType]) {
                button.classList.add('used');
                button.disabled = true;
            }
        });
    }
    
    showHelpModal(helpType, content) {
        const modal = document.getElementById('help-modal');
        const title = document.getElementById('help-modal-title');
        const icon = document.getElementById('help-modal-icon');
        const contentElement = document.getElementById('help-modal-content');
        
        const helpTitles = {
            scenario: 'Ajuda com Cenário',
            teacher: 'Ajuda do Docente',
            team: 'Ajuda da Equipe Apresentadora'
        };
        
        const helpIcons = {
            scenario: 'fas fa-map-marked-alt text-4xl text-green-500',
            teacher: 'fas fa-graduation-cap text-4xl text-blue-500',
            team: 'fas fa-users text-4xl text-purple-500'
        };
        
        title.textContent = helpTitles[helpType];
        icon.innerHTML = `<i class="${helpIcons[helpType]}"></i>`;
        contentElement.textContent = content;
        
        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
    }
    
    closeHelpModal() {
        const modal = document.getElementById('help-modal');
        modal.classList.add('hidden');
        modal.classList.remove('modal-enter');
    }
    
    showResultModal(isCorrect, explanation, points, timeUp = false) {
        const modal = document.getElementById('result-modal');
        const icon = document.getElementById('result-icon');
        const title = document.getElementById('result-title');
        const explanationElement = document.getElementById('result-explanation');
        
        if (timeUp) {
            icon.innerHTML = '<i class="fas fa-clock text-6xl text-orange-500"></i>';
            title.textContent = 'Tempo Esgotado!';
            title.className = 'text-2xl font-bold text-orange-600 mb-2';
        } else if (isCorrect) {
            icon.innerHTML = '<i class="fas fa-check-circle text-6xl text-green-500"></i>';
            title.textContent = `Resposta Correta! (+${points} pontos)`;
            title.className = 'text-2xl font-bold text-green-600 mb-2';
        } else {
            icon.innerHTML = '<i class="fas fa-times-circle text-6xl text-red-500"></i>';
            title.textContent = 'Resposta Incorreta!';
            title.className = 'text-2xl font-bold text-red-600 mb-2';
        }
        
        explanationElement.textContent = explanation;
        
        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
    }
    
    closeResultModal() {
        const modal = document.getElementById('result-modal');
        modal.classList.add('hidden');
        modal.classList.remove('modal-enter');
    }
    
    nextQuestion() {
        if (!this.isAnswered) return;
        
        this.currentQuestionIndex++;
        this.updateProgress();
        this.loadQuestion();
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.updateProgress();
            this.loadQuestion();
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.textContent = 'Finalizar';
            nextBtn.innerHTML = 'Finalizar<i class="fas fa-flag-checkered ml-2"></i>';
        } else {
            nextBtn.innerHTML = 'Próxima<i class="fas fa-arrow-right ml-2"></i>';
        }
    }
    
    showFinalResults() {
        const modal = document.getElementById('final-results-modal');
        const finalScore = document.getElementById('final-score');
        const correctAnswers = document.getElementById('correct-answers');
        const wrongAnswers = document.getElementById('wrong-answers');
        
        const correct = this.answers.filter(a => a.correct).length;
        const wrong = this.answers.length - correct;
        
        finalScore.textContent = this.score;
        correctAnswers.textContent = correct;
        wrongAnswers.textContent = wrong;
        
        // Save results to localStorage
        this.saveResults();
        
        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
    }
    
    saveResults() {
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        
        const result = {
            date: new Date().toISOString(),
            category: this.selectedCategory,
            score: this.score,
            correct: this.answers.filter(a => a.correct).length,
            total: this.answers.length,
            answers: this.answers
        };
        
        results.push(result);
        localStorage.setItem('quizResults', JSON.stringify(results));
    }
    
    playAgain() {
        window.location.href = 'index.html';
    }
    
    goHome() {
        window.location.href = 'index.html';
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    new QuizGame();
});

