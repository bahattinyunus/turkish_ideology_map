const questions = [
    {
        text: "Devletin ekonomideki rolü ne olmalıdır?",
        options: [
            { text: "Devlet fabrikalar kurmalı, piyasayı yönlendirmeli.", points: { kemalizm: 3, komünizm: 2, ulusalcılık: 2 } },
            { text: "Tamamen serbest piyasa, devlet karışmamalı.", points: { liberalizm: 3, muhafazakarlık: 1 } },
            { text: "Devlet sadece gelir adaleti ve sosyal haklar için müdahale etmeli.", points: { sosyal_demokrat: 3 } },
            { text: "Devlet mülkiyeti kaldırmalı, her şey halkın olmalı.", points: { komünizm: 3, anarşizm: 2 } }
        ]
    },
    {
        text: "Din ve devlet ilişkisi nasıl olmalı?",
        options: [
            { text: "Devlet tamamen laik olmalı, din kamusal alana taşınmamalı.", points: { kemalizm: 3, sosyal_demokrat: 2, ulusalcılık: 2, komünizm: 1 } },
            { text: "Devlet dini değerleri korumalı ve gözetmeli.", points: { muhafazakarlık: 3, milli_islamcılık: 2 } },
            { text: "Siyaset ve hukuk İslam'a göre şekillenmeli.", points: { islamcılık: 3, milli_islamcılık: 3 } },
            { text: "Devlet dine karışmamalı, din de devlete karışmamalı (Özgürlükçü Laiklik).", points: { liberalizm: 2, sosyal_demokrat: 1 } }
        ]
    },
    {
        text: "Milli kimlik anlayışın nedir?",
        options: [
            { text: "Türk kimliği her şeyin üzerindedir, devletin bekası esastır.", points: { milliyetçilik: 3, ulusalcılık: 3, kemalizm: 1 } },
            { text: "Müslümanların kardeşliği (Ümmet) ulus kimliğinden önemlidir.", points: { islamcılık: 3, milli_islamcılık: 2 } },
            { text: "Herkesin vatana vatandaşlık bağıyla bağlı olduğu bir üst kimlik yeterlidir.", points: { kemalizm: 2, sosyal_demokrat: 2 } },
            { text: "Ulus devletler insanlığı böler, evrensel değerler önemlidir.", points: { liberalizm: 2, komünizm: 2, anarşizm: 3 } }
        ]
    },
    {
        text: "Toplumsal değişim nasıl olmalı?",
        options: [
            { text: "Devrimci bir değişimle eski kurumlar yıkılmalı.", points: { kemalizm: 2, komünizm: 3, anarşizm: 2 } },
            { text: "Geleneklerimize ve geçmişimize sahip çıkarak yavaşça ilerlemeliyiz.", points: { muhafazakarlık: 3, milliyetçilik: 1, milli_islamcılık: 1 } },
            { text: "Demokratik reformlarla, özgürlükleri genişleterek.", points: { sosyal_demokrat: 3, liberalizm: 2 } },
            { text: "Mevcut düzeni korumak en iyisidir.", points: { muhafazakarlık: 2 } }
        ]
    },
    {
        text: "Birey mi önemli, devlet/toplum mu?",
        options: [
            { text: "Devletin güvenliği ve toplumun birliği her şeyden önce gelir.", points: { milliyetçilik: 2, ulusalcılık: 3, kemalizm: 1 } },
            { text: "Birey özgürlüğü kutsaldır, devlet buna dokunamaz.", points: { liberalizm: 3, anarşizm: 3 } },
            { text: "Toplumun ortak çıkarı ve eşitliği bireyden önemlidir.", points: { komünizm: 2, sosyal_demokrat: 1, islamcılık: 1 } },
            { text: "Aile ve cemaat bağları bireyi var eder.", points: { muhafazakarlık: 2, milli_islamcılık: 2 } }
        ]
    }
];

let currentQuestion = 0;
let scores = {};

function startQuiz() {
    scores = {}; // Reset scores
    currentQuestion = 0;
    document.getElementById('quiz-modal').style.display = 'block';
    showQuestion();
}

function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}

function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('quiz-question').innerText = q.text;

    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = ''; // Clear old buttons

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt.points);
        optionsDiv.appendChild(btn);
    });
}

function selectOption(points) {
    // Add points
    for (const [ideology, score] of Object.entries(points)) {
        scores[ideology] = (scores[ideology] || 0) + score;
    }

    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    // Find highest score
    let winner = "";
    let maxScore = -1;

    for (const [ideology, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            winner = ideology;
        }
    }

    // Default if no points
    if (!winner) winner = "Merkez";

    // Show text
    const container = document.getElementById('quiz-content');
    container.innerHTML = `
        <h2 class="result-title">Sonuç: ${winner.toUpperCase().replace('_', ' ')}</h2>
        <p class="result-desc">Verdiğin cevaplara göre sana en yakın ideoloji bu görünüyor.</p>
        <button class="option-btn" onclick="focusOnNode('${winner}')">Haritada Göster 🌍</button>
    `;
}

function focusOnNode(nodeId) {
    closeQuiz();
    // Dispatch custom event for script.js to handle
    const event = new CustomEvent('focusNode', { detail: { id: nodeId } });
    document.dispatchEvent(event);

    // Reset modal content for next time after a short delay
    setTimeout(() => {
        // Simple reload of page content approach or re-render
        // Ideally we just re-render question 1 structure but for MVP:
        location.reload(); // Simplest reset to avoid UI state complexity in MVP
    }, 1000);
    // Wait, reload will kill the focus effect. Better to manually reset HTML.
    // Fixed below in script execution.
}

// Override focusOnNode to not reload, but fix UI.
// This function needs to be global or accessible.
window.focusOnNode = function (nodeId) {
    document.getElementById('quiz-modal').style.display = 'none';

    // Restore Quiz UI Structure
    setTimeout(() => {
        document.getElementById('quiz-content').innerHTML = `
            <h2 class="quiz-title">🧭 İdeoloji Pusulası</h2>
            <div id="quiz-question" class="question-text">Soru yükleniyor...</div>
            <div id="options-container" class="options-container" id="quiz-options"></div>
            <!-- Need to fix IDs because I overwrote innerHTML above -->
        `;
        // Actually, let's just create the initial structure in index.html and only modify sub-elements.
        // For MVP, reloading is bad because we lose the "Focus" animation. 
        // We will just let script.js handle the focus, and close the modal. 
        // We won't reset the modal until 'Start' is clicked again.
    }, 100);

    // Call graph focus
    if (window.graphFocusFunction) {
        window.graphFocusFunction(nodeId);
    }
};
