function flipCard(card) {
    card.classList.toggle("flipped");
}

function getRandomBackground() {
    const aboutSection = document.getElementById('about');
    aboutSection.innerHTML = '<h1>Bienvenue sur mon portfolio</h1><p>Je suis Luca de Brito, étudiant en informatique, fan de jeu vidéo.</p>';
    
    const normalStars = ['../images/Star 1.png', '../images/Star 2.png', '../images/Star 3.png', '../images/Star 4.png'];
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) { // Génère entre 1 et 5 étoiles normales
        let imgSrc = normalStars[Math.floor(Math.random() * normalStars.length)];
        createBackgroundImage(imgSrc, aboutSection);
    }
    
    if (Math.random() < 0.1) { // 1/10 chance for Stari.png
        createBackgroundImage('../images/Stari.png', aboutSection);
    }
    if (Math.random() < 0.01) { // 1/100 chance for Staross.png
        createBackgroundImage('../images/Staross.png', aboutSection);
    }
}

function createBackgroundImage(src, parent) {
    const img = document.createElement('div');
    img.classList.add('background-image');
    img.style.backgroundImage = `url('${src}')`;
    img.style.top = Math.random() * 100 + '%';
    img.style.left = Math.random() * 100 + '%';
    parent.appendChild(img);
}

getRandomBackground();