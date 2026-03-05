document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ГЕНЕРАТОР ФОНА МАТРИЦЫ ---
    const matrixContainer = document.getElementById('matrix-rain-container');
    const columns = Math.floor(window.innerWidth / 20); // Колонка каждые 20px
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${i * 20}px`;
        // Разная скорость и задержка падения для каждой колонки
        column.style.animationDuration = `${Math.random() * 5 + 3}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        
        // Генерируем строку случайных символов
        let columnText = '';
        for(let j = 0; j < 30; j++) {
            columnText += alphabet.charAt(Math.floor(Math.random() * alphabet.length)) + '<br>';
        }
        column.innerHTML = columnText;
        matrixContainer.appendChild(column);
    }

    // --- 2. ЛОГИКА ДОБАВЛЕНИЯ ГОСТЕЙ (ЛИСТЬЕВ) ---
    const leafCanopy = document.getElementById('leaf-canopy');
    
    // Это имитация данных, которые ты получаешь от своего API
    const mockApiData = [
        { name: "Sasha", date: "01.03.2026", color: "#8a2be2" },
        { name: "Neo", date: "01.03.2026", color: "#00ff00" },
        { name: "Trinity", date: "28.02.2026", color: "#ff00ff" },
        { name: "Morpheus", date: "25.02.2026", color: "#ff8c00" },
        { name: "Smith", date: "24.02.2026", color: "#ff0000" }
    ];

    // Функция создания одного листа
    function addLeaf(guestData) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        
        // Случайная позиция внутри кроны дерева
        const topPos = Math.random() * 80; // От 0% до 80% высоты контейнера кроны
        const leftPos = Math.random() * 80; // От 0% до 80% ширины
        const rotation = Math.floor(Math.random() * 60) - 30; // Угол от -30deg до 30deg
        
        leaf.style.top = `${topPos}%`;
        leaf.style.left = `${leftPos}%`;
        
        // Передаем переменные в CSS
        leaf.style.setProperty('--leaf-color', guestData.color);
        leaf.style.setProperty('--random-rotate', `${rotation}deg`);
        
        // Заполняем атрибут data-info для всплывающей подсказки
        leaf.setAttribute('data-info', `Добавлен: ${guestData.date}`);

        // Создаем прожилку
        const vein = document.createElement('div');
        vein.className = 'vein';
        
        // Создаем текст с именем
        const span = document.createElement('span');
        span.textContent = guestData.name;

        // Собираем всё вместе
        leaf.appendChild(vein);
        leaf.appendChild(span);
        leafCanopy.appendChild(leaf);
    }

    // Имитируем постепенную загрузку данных (чтобы увидеть анимацию появления)
    mockApiData.forEach((guest, index) => {
        setTimeout(() => {
            addLeaf(guest);
        }, index * 600); // Каждый лист появляется с задержкой в 600мс от предыдущего
    });
});