// Main JavaScript for Logistics Quiz - Home Page

// Default data structure
const defaultData = {
    categories: [
        {
            id: 'gestao-estoque',
            name: 'Gestão de Estoque',
            icon: 'fas fa-boxes',
            color: 'blue',
            description: 'Controle e otimização de estoques'
        },
        {
            id: 'transporte',
            name: 'Transporte',
            icon: 'fas fa-truck',
            color: 'orange',
            description: 'Modalidades e gestão de transportes'
        },
        {
            id: 'supply-chain',
            name: 'Supply Chain',
            icon: 'fas fa-network-wired',
            color: 'green',
            description: 'Cadeia de suprimentos integrada'
        },
        {
            id: 'sustentabilidade',
            name: 'Sustentabilidade',
            icon: 'fas fa-leaf',
            color: 'green',
            description: 'Logística verde e sustentável'
        }
    ],
    questions: [
        {
            id: 1,
            category: 'gestao-estoque',
            question: 'Qual é o principal objetivo da gestão de estoque?',
            options: [
                'Minimizar custos de armazenagem',
                'Maximizar o volume de produtos',
                'Equilibrar custos e níveis de serviço',
                'Reduzir o número de fornecedores'
            ],
            correct: 2,
            explanation: 'A gestão de estoque busca equilibrar os custos de manutenção com os níveis de serviço ao cliente.',
            timer: 30,
            helps: {
                scenario: 'Imagine uma empresa que precisa atender pedidos rapidamente, mas também controlar custos de armazenagem.',
                teacher: 'A gestão de estoque é uma função crítica que busca otimizar o trade-off entre custos e serviço.',
                team: 'Pense no equilíbrio: nem muito estoque (caro) nem pouco estoque (falta produtos).'
            }
        },
        {
            id: 2,
            category: 'transporte',
            question: 'Qual modal de transporte é mais adequado para cargas de alto valor e urgentes?',
            options: [
                'Rodoviário',
                'Ferroviário',
                'Aéreo',
                'Aquaviário'
            ],
            correct: 2,
            explanation: 'O transporte aéreo é ideal para cargas de alto valor e urgentes devido à velocidade.',
            timer: 25,
            helps: {
                scenario: 'Uma empresa precisa entregar componentes eletrônicos caros em 24 horas para outra cidade.',
                teacher: 'Cada modal tem características específicas: velocidade, custo, capacidade e confiabilidade.',
                team: 'Para urgência e alto valor, pense no modal mais rápido disponível.'
            }
        }
    ],
    settings: {
        defaultTimer: 30,
        pointsCorrect: 10,
        timeBonus: 1,
        adminPassword: 'admin123'
    }
};

// Initialize data if not exists
function initializeData() {
    if (!localStorage.getItem('quizData')) {
        localStorage.setItem('quizData', JSON.stringify(defaultData));
    }
}

// Get data from localStorage
function getData() {
    return JSON.parse(localStorage.getItem('quizData')) || defaultData;
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('quizData', JSON.stringify(data));
}

// Load categories on page load
function loadCategories() {
    const data = getData();
    const categoriesGrid = document.getElementById('categories-grid');
    const modalCategories = document.getElementById('modal-categories');
    
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    if (modalCategories) modalCategories.innerHTML = '';
    
    data.categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        categoriesGrid.appendChild(categoryCard);
        
        if (modalCategories) {
            const modalCategoryBtn = createModalCategoryButton(category);
            modalCategories.appendChild(modalCategoryBtn);
        }
    });
}

// Create category card
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = `category-card bg-${category.color}-100 hover:bg-${category.color}-200 p-4 rounded-lg border-2 border-${category.color}-300 transition-all duration-300`;
    
    card.innerHTML = `
        <div class="text-center">
            <i class="${category.icon} text-${category.color}-600 text-3xl mb-2"></i>
            <h4 class="font-bold text-${category.color}-800 mb-1">${category.name}</h4>
            <p class="text-${category.color}-600 text-sm">${category.description}</p>
        </div>
    `;
    
    card.addEventListener('click', () => selectCategory(category.id));
    
    return card;
}

// Create modal category button
function createModalCategoryButton(category) {
    const button = document.createElement('button');
    button.className = `w-full text-left p-3 rounded-lg border-2 border-${category.color}-300 bg-${category.color}-50 hover:bg-${category.color}-100 transition-colors duration-300`;
    
    button.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="${category.icon} text-${category.color}-600 text-xl"></i>
            <div>
                <div class="font-semibold text-${category.color}-800">${category.name}</div>
                <div class="text-${category.color}-600 text-sm">${category.description}</div>
            </div>
        </div>
    `;
    
    button.addEventListener('click', () => {
        selectCategory(category.id);
        closeModal();
    });
    
    return button;
}

// Select category and start quiz
function selectCategory(categoryId) {
    localStorage.setItem('selectedCategory', categoryId);
    window.location.href = 'quiz.html';
}

// Modal functions
function openModal() {
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
    }
}

function closeModal() {
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('modal-enter');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Add fade-in animation to elements
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadCategories();
    addFadeInAnimation();
    
    // Event listeners
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', openModal);
    }
    
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.transform');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for use in other files
window.QuizApp = {
    getData,
    saveData,
    showNotification,
    initializeData
};

