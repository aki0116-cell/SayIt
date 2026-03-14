console.log("內容腳本已啟動");

let lastUserText = "";
let lastAiext = "";
const wordCounts = {};
const notifiedWords = new Set();

const aiWordCounts = {};

const tokenize = (text) => {
    if (!text) return [];
    return text.toLowerCase().match(/\b(\w+)\b/g) || [];
};


const getLatestUserText = () => {
    const userNodes = document.querySelectorAll('[data-message-author-role="user"]');
    if (userNodes.length === 0) return "";
    const lastNode = userNodes[userNodes.length - 1];
    const textNode = lastNode.querySelector('.whitespace-pre-wrap') || lastNode;
    return textNode.innerText.trim();
};

const observer = new MutationObserver(() => {

    const currentText = getLatestUserText();

    if (currentText && currentText !== lastUserText) {

        lastUserText = currentText;

        const repetitiveWords = countWords(currentText, wordCounts);

        const newWords = repetitiveWords.filter(word => !notifiedWords.has(word));

        if (newWords.length > 0) {
            const recommendations = newWords.map(word => sendDataToAPI(word));

            Promise.all(recommendations).then(suggestions => {
                createCoachUI(newWords, suggestions || []);
            });
        }
    }

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});


function countWords(text ,countObj) {
    const words = tokenize(text);
    let cantUse = [];
    const stopWords = new Set(['the', 'and', 'a', 'an', 'is', 'are', 'to', 'of', 'in', 'it', 'you', 'that']);
    words.forEach(word => {
        if (word.length < 3) return;
        if (stopWords.has(word.toLowerCase())) return;
        if(countObj[word]=== undefined){
            countObj[word] = 1
        }else{
            countObj[word]++
        }

        if (countObj[word] >= 3) {
            cantUse.push(word);
        }
    });

    
    return [...new Set(cantUse)];
}

async function getUserId() {
    const result = await chrome.storage.local.get(['sayit_user_id']);
    if (result.sayit_user_id) {
        return result.sayit_user_id;
    } else {
        const newId = 'user_' + Math.random().toString(36).substr(2, 9);
        await chrome.storage.local.set({ sayit_user_id: newId });
        return newId;
    }
}