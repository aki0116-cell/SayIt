const itemurl = "http://127.0.0.1:8000/items/";

async function backend(data) {
    try {
        const response = await fetch(itemurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error= await response.json();
            console.error(error);
            return;
        }

        const re = await response.json();
        console.log(re);
        return re;

    } catch (e) {
        console.error(e);
    }
}


async function sendDataToAPI(data) {
    
    try {
        const response = await fetch('https://api.datamuse.com/words?rel_syn=' + encodeURIComponent(data) + '&max=3');
        const result = await response.json();
        return result.map(i => i.word);
    }   catch (e) {
        console.error(e);
    }
}
