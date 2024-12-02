let seenMemes = new Set();
const SUBREDDITS = [
    'dankmemes',
    'memes',
    'wholesomememes',
    'me_irl',
    'ProgrammerHumor',
    'funny',
    'PrequelMemes',
    'HistoryMemes',
    'AnimeMemes',
    'GamingMemes',
    'marvelmemes',
    'dcmemes',
    'ComedyCemetery',
    'terriblefacebookmemes',
    'antimeme',
    'bonehurtingjuice',
    'surrealmemes',
    'deepfriedmemes',
    'okbuddyretard',
    'comedyheaven'
];

async function fetchMemes() {
    const loadingElement = document.getElementById('loading');
    const memeContainer = document.getElementById('meme-container');
    
    try {
        loadingElement.style.display = 'block';
        memeContainer.innerHTML = '';

        // Randomly select 5 subreddits to fetch from
        const selectedSubreddits = SUBREDDITS
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        const memes = await Promise.all(
            selectedSubreddits.map(subreddit => 
                fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=30`)
                    .then(response => response.json())
                    .then(data => ({
                        posts: data.data.children
                            .filter(post => {
                                const url = post.data.url;
                                return !seenMemes.has(url) && 
                                       (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif'));
                            })
                            .map(post => ({
                                title: post.data.title,
                                url: post.data.url
                            }))
                    }))
                    .catch(error => ({ posts: [] })) // Handle errors for individual subreddits
            )
        );

        const allMemes = memes
            .flatMap(({ posts }) => posts)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        if (allMemes.length === 0) {
            throw new Error('No fresh memes found! Try again later.');
        }

        allMemes.forEach(meme => {
            seenMemes.add(meme.url);
            const memeCard = createMemeCard(meme);
            memeContainer.appendChild(memeCard);
        });

        // Add meme explosion effect
        createMemeExplosion();

    } catch (error) {
        memeContainer.innerHTML = `
            <div class="error-message">
                ${error.message || 'Failed to fetch memes. Please try again!'}
            </div>
        `;
    } finally {
        loadingElement.style.display = 'none';

        // Clear seenMemes if it gets too large
        if (seenMemes.size > 500) {
            seenMemes.clear();
        }
    }
}

function createMemeCard(meme) {
    const card = document.createElement('div');
    card.className = 'meme-card';
    
    const img = document.createElement('img');
    img.className = 'meme-image';
    img.src = meme.url;
    img.alt = meme.title;
    img.loading = 'lazy';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = '⬇️ Save Meme';
    downloadBtn.onclick = () => saveImage(meme.url);
    
    card.appendChild(img);
    card.appendChild(downloadBtn);
    
    return card;
}

async function saveImage(imageUrl) {
    try {
        const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(imageUrl)}`);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `meme_${Date.now()}${getFileExtension(imageUrl)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        // Show success animation
        showDownloadSuccess();
    } catch (error) {
        console.error('Failed to download image:', error);
        alert('Failed to download meme. Please try again!');
    }
}

function getFileExtension(url) {
    return url.match(/\.[^.\/]*$/)[0] || '.jpg';
}

function showDownloadSuccess() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #FF4500, #FF6B6B);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        font-family: 'Comic Neue', cursive;
        animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        z-index: 1000;
    `;
    notification.textContent = '✨ Meme saved! ✨';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'bounceOut 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 1800);
}

function createMemeExplosion() {
    const emojis = ['🔥', '⭐', '💫', '✨', '🎉', '🚀', '💯', '🌟'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: absolute;
            font-size: ${20 + Math.random() * 20}px;
            left: ${50 + (Math.random() - 0.5) * 40}%;
            top: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
        `;

        const angle = (Math.random() * Math.PI * 2);
        const velocity = 2 + Math.random() * 3;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        let x = 0;
        let y = 0;
        let opacity = 1;

        container.appendChild(emoji);

        const animate = () => {
            if (opacity <= 0) {
                container.removeChild(emoji);
                return;
            }

            x += dx;
            y += dy;
            opacity -= 0.02;
            emoji.style.transform = `translate(${x}rem, ${y}rem) rotate(${x * 10}deg)`;
            emoji.style.opacity = opacity;

            requestAnimationFrame(animate);
        };

        animate();
    }

    setTimeout(() => document.body.removeChild(container), 3000);
}

// Add this to your existing CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% { transform: translate(-50%, 100%) scale(0.3); opacity: 0; }
        50% { transform: translate(-50%, -20%) scale(1.1); opacity: 0.8; }
        80% { transform: translate(-50%, 10%) scale(0.9); opacity: 0.9; }
        100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
    }

    @keyframes bounceOut {
        0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        20% { transform: translate(-50%, 10%) scale(0.9); opacity: 0.9; }
        50% { transform: translate(-50%, -20%) scale(1.1); opacity: 0.8; }
        100% { transform: translate(-50%, 100%) scale(0.3); opacity: 0; }
    }

    @keyframes floatIn {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initial load
fetchMemes();
