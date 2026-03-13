function createCoachUI(words, suggestionsArray) {
    let panel = document.getElementById('sayit-panel');

    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'sayit-panel';
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
    panel.style.pointerEvents = "auto";
    panel.innerHTML = `
        <div style="font-weight:bold; front-size :10 ;margin-bottom:10px;">這些字你已經用800次了小賤賤：</div>
        ${listContent}
    `;


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

    element.style.cursor = 'move'; 

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        
        element.style.transition = 'none'; 
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

       
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

       
        element.style.right = 'auto'; 
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.transition = 'opacity 0.5s';
    });
}