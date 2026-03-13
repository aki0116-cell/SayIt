function createCoachUI(words, suggestionsArray) {
    let panel = document.getElementById('sayit-panel');

    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'sayit-panel';
        // 套用上面的極簡 CSS
        panel.style.cssText = "position:fixed; top:20px; right:20px; width:240px; background:#000; color:#fff; padding:12px; border:1px solid #fff; z-index:9999; font-family:monospace; font-size:14px; transition:opacity 0.5s; user-select:none;";
        document.body.appendChild(panel);
        makeDraggable(panel);
    }

    const listContent = words.map((word, index) => {
        const suggestions = suggestionsArray[index] || [];
        return `
            <div style="margin-bottom: 15px; border-top: 1px solid #fff; padding-top: 10px;">
                <div>[ 重複詞: ${word} ]</div>
                <div style="margin-top: 5px;">建議: ${suggestions.join(', ') || 'N/A'}</div>
            </div>
        `;
    }).join('');

    panel.style.opacity = "1";
    panel.style.pointerEvents = "auto"; // 顯示時要能被拖動
    panel.innerHTML = `
        <div style="font-weight:bold; front-size :10 ;margin-bottom:10px;">這些字你已經用800次了小賤賤：</div>
        ${listContent}
    `;

    // 自動消失邏輯
    setTimeout(() => {
        if (panel) {
            panel.style.opacity = "0";
            setTimeout(() => { 
                if(panel.style.opacity === "0") panel.style.pointerEvents = "none"; 
            }, 500);
        }
    }, 8000);
}
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.style.cursor = 'move'; // 讓使用者知道可以移動

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        // 計算滑鼠點擊位置距離元素邊框的距離
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        
        element.style.transition = 'none'; // 拖動時關閉動畫，避免延遲感
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // 計算新位置
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // 更新位置 (改用 left/top 比較好算)
        element.style.right = 'auto'; // 移除原本的 right 限制
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.transition = 'opacity 0.5s'; // 恢復透明度動畫
    });
}