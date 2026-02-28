class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const color = this.getColor(number);
        this.shadowRoot.innerHTML = `
            <style>
                .lotto-ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #fff;
                    background-image: ${color};
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.2);
                }
            </style>
            <div class="lotto-ball">${number}</div>
        `;
    }

    getColor(number) {
        const num = parseInt(number);
        if (num <= 10) return 'linear-gradient(to bottom, #fbc02d, #f57f17)'; // Yellow
        if (num <= 20) return 'linear-gradient(to bottom, #1e88e5, #0d47a1)'; // Blue
        if (num <= 30) return 'linear-gradient(to bottom, #e53935, #b71c1c)'; // Red
        if (num <= 40) return 'linear-gradient(to bottom, #5e35b1, #311b92)'; // Purple
        return 'linear-gradient(to bottom, #43a047, #1b5e20)'; // Green
    }
}

customElements.define('lotto-ball', LottoBall);

const generateBtn = document.getElementById('generate-btn');
const lottoDisplay = document.querySelector('.lotto-display');
const historyList = document.getElementById('history-list');

function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    lottoDisplay.innerHTML = '';
    numbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoDisplay.appendChild(lottoBall);
    });
}

function addToHistory(numbers) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerHTML = numbers.map(number => `<lotto-ball number="${number}"></lotto-ball>`).join('');
    historyList.prepend(historyItem);
}


generateBtn.addEventListener('click', () => {
    const newNumbers = generateNumbers();
    displayNumbers(newNumbers);
    addToHistory(newNumbers);
});

// Initial generation
generateBtn.click();