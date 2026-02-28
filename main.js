const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const uploadContent = document.getElementById('upload-content');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const loadingOverlay = document.getElementById('loading-overlay');
const resultSection = document.getElementById('result-section');
const removeImageBtn = document.getElementById('remove-image-btn');

// Mock Data for Results
const animalTypes = [
    {
        name: '강아지상',
        desc: '순하고 귀여운 인상으로 어디서나 사랑받는 타입입니다. 친근함이 당신의 가장 큰 무기!',
        color: '#ffb142' // Custom color example
    },
    {
        name: '고양이상',
        desc: '도도하고 시크한 매력의 소유자. 날카로운 눈매 속에 숨겨진 따뜻함이 매력 포인트!',
        color: '#ff5252'
    },
    {
        name: '토끼상',
        desc: '밝고 맑은 에너지의 소유자. 호기심 가득한 눈망울로 주변을 환하게 만듭니다.',
        color: '#706fd3'
    },
    {
        name: '공룡상',
        desc: '강렬하고 카리스마 넘치는 인상. 무심한 듯 챙겨주는 츤데레 매력이 있습니다.',
        color: '#33d9b2'
    },
    {
        name: '곰상',
        desc: '듬직하고 편안한 인상. 곁에 있으면 마음이 놓이는 힐링 캐릭터입니다.',
        color: '#b33939'
    }
];

// Event Listeners for Upload Area
uploadArea.addEventListener('click', () => imageUpload.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#03c75a';
    uploadArea.style.backgroundColor = '#f0fdf4';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#e3e5e8';
    uploadArea.style.backgroundColor = '#f5f6f8';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e3e5e8';
    uploadArea.style.backgroundColor = '#f5f6f8';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0]);
    }
});

removeImageBtn.addEventListener('click', resetApp);

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        // Show Preview
        imagePreview.src = e.target.result;
        uploadContent.style.display = 'none';
        previewContainer.style.display = 'flex';
        removeImageBtn.style.display = 'block'; // Show reset button below
        
        // Start "Analysis"
        startAnalysis();
    };
    reader.readAsDataURL(file);
}

function startAnalysis() {
    loadingOverlay.style.display = 'flex';
    resultSection.style.display = 'none';

    // Simulate Network/Processing Delay (2.5 seconds)
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        showResults();
    }, 2500);
}

function showResults() {
    // 1. Generate random percentages that sum to 100
    let remaining = 100;
    const scores = [];
    
    // Generate 4 random numbers first
    for (let i = 0; i < animalTypes.length - 1; i++) {
        // Random number between 0 and remaining (with some buffer to ensure others get points)
        const val = Math.floor(Math.random() * (remaining - (animalTypes.length - i - 1) * 5)); 
        scores.push(val);
        remaining -= val;
    }
    // Assign the remainder to the last one
    scores.push(remaining);

    // Combine with types
    let results = animalTypes.map((type, index) => ({
        ...type,
        score: scores[index]
    }));

    // Sort by score descending to find the winner
    results.sort((a, b) => b.score - a.score);
    
    const winner = results[0];

    // 2. Update DOM
    document.getElementById('result-title').textContent = `당신은 매력적인 ${winner.name}!`;
    document.getElementById('result-title').style.color = winner.color;
    document.getElementById('result-desc').textContent = winner.desc;

    // 3. Render Chart
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = ''; // Clear previous

    results.forEach(item => {
        const row = document.createElement('div');
        row.className = 'chart-row';
        
        // Create bar with dynamic width
        row.innerHTML = `
            <div class="label">${item.name}</div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: 0%; background-color: ${item.color}"></div>
            </div>
            <div class="percentage">${item.score}%</div>
        `;
        chartContainer.appendChild(row);
        
        // Trigger animation
        setTimeout(() => {
            row.querySelector('.bar-fill').style.width = `${item.score}%`;
        }, 50);
    });

    // 4. Show Section
    resultSection.style.display = 'block';
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetApp() {
    imageUpload.value = '';
    imagePreview.src = '';
    uploadContent.style.display = 'block';
    previewContainer.style.display = 'none';
    resultSection.style.display = 'none';
    removeImageBtn.style.display = 'none';
}
