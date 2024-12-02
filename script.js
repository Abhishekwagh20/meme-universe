// Keep track of shown memes to avoid repetition
let shownMemes = new Set();

async function fetchMemes() {
    const loadingElement = document.getElementById('loading');
    const container = document.getElementById('meme-container');
    
    loadingElement.style.display = 'block';
    container.innerHTML = '';

    // List of popular meme subreddits
    const subreddits = ['dankmemes', 'memes', 'wholesomememes', 'me_irl', 'ProgrammerHumor'];
    const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    try {
        const response = await fetch(`https://www.reddit.com/r/${randomSubreddit}/hot.json?limit=30`);
        const data = await response.json();
        
        // Filter out previously shown memes and get valid image posts
        const validMemes = data.data.children
            .filter(post => {
                const url = post.data.url;
                return url.startsWith('https://i.redd.it/') && 
                       (url.endsWith('.jpg') || url.endsWith('.png')) &&
                       !shownMemes.has(url);
            });

        // Get 3 random memes from the valid ones
        const selectedMemes = [];
        while (selectedMemes.length < 3 && validMemes.length > 0) {
            const randomIndex = Math.floor(Math.random() * validMemes.length);
            const meme = validMemes.splice(randomIndex, 1)[0];
            selectedMemes.push(meme);
            shownMemes.add(meme.data.url);
        }

        // Clear shown memes cache if it gets too large
        if (shownMemes.size > 100) {
            shownMemes.clear();
        }

        if (selectedMemes.length === 0) {
            container.innerHTML = '<div class="error-message">No fresh memes found. Try again!</div>';
            return;
        }

        selectedMemes.forEach((meme, index) => {
            const memeData = meme.data;
            const memeCard = document.createElement('div');
            memeCard.className = 'meme-card';
            
            // Create an image element
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS
            img.src = `https://corsproxy.io/?${encodeURIComponent(memeData.url)}`;
            img.className = 'meme-image';
            img.loading = 'lazy';
            img.alt = `Meme ${index + 1}`;
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '⬇️ Save Meme';
            
            // Add download handler
            downloadBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(memeData.url)}`);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    // Get file extension from original URL
                    const extension = memeData.url.split('.').pop().toLowerCase();
                    a.download = `meme_${Date.now()}.${extension}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error('Download failed:', error);
                    alert('Download failed. Please try again.');
                }
            });
            
            memeCard.appendChild(img);
            memeCard.appendChild(downloadBtn);
            container.appendChild(memeCard);
        });
    } catch (error) {
        console.error('Error fetching memes:', error);
        container.innerHTML = '<div class="error-message">Failed to connect to the meme dimension. Please try again!</div>';
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', fetchMemes);
