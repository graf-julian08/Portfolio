// --- 1. Persistent Paint Canvas ---
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouse = { x: -100, y: -100, lastX: -100, lastY: -100 };
let isMoving = false;

// Set Canvas Size
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // Setup drawing style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Use a white stroke
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
}
window.addEventListener('resize', resize);
resize();

// Track Mouse
window.addEventListener('mousemove', (e) => {
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    isMoving = true;
});

// The "Artist" Loop
function animate() {
    // 1. "Age" the canvas: Draw a very transparent black rectangle over everything
    // This allows strokes to persist but slowly fade/blur out over time (approx 5-10 seconds)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(10, 10, 10, 0.02)'; // Very low opacity = long trails
    ctx.fillRect(0, 0, width, height);

    // 2. Draw new stroke if moving
    if (isMoving && mouse.lastX > 0) {
        // Calculate speed for thickness
        const dx = mouse.x - mouse.lastX;
        const dy = mouse.y - mouse.lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Dynamic Line Width: Faster = Thinner, Slower = Thicker (Simulating ink flow)
        // Or User's preference: Vertical = Thick. Let's stick to the "Artist" feel (Speed based is usually better feeling).
        // But user asked for "Pinsel... hoch runter dicke Linie". Let's try to honor verticality.

        let lineWidth = 2;
        if (Math.abs(dy) > Math.abs(dx)) {
            // Vertical movement dominance
            lineWidth = Math.min(Math.abs(dy) * 0.8, 12);
            if (lineWidth < 2) lineWidth = 2;
        } else {
            lineWidth = 2;
        }

        ctx.beginPath();
        ctx.moveTo(mouse.lastX, mouse.lastY);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.stroke();
    }

    // Stop drawing if mouse stops
    isMoving = false;

    requestAnimationFrame(animate);
}
animate();


// --- 2. Custom Cursor ---
const cursor = document.getElementById('cursor');

window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%) scale(2.5)`;
        cursor.style.mixBlendMode = 'normal';
        cursor.style.backgroundColor = 'white';
        cursor.style.opacity = '0.2';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%) scale(1)`;
        cursor.style.mixBlendMode = 'difference';
        cursor.style.backgroundColor = 'white';
        cursor.style.opacity = '1';
    });
});


// --- 3. Menu Interactions ---
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const menuOverlay = document.getElementById('fullscreen-menu');
const menuLinks = document.querySelectorAll('.menu-link');

function openMenu() {
    menuOverlay.classList.remove('translate-x-full');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    menuOverlay.classList.add('translate-x-full');
    document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// --- 4. GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

// Animate Sections
const sections = document.querySelectorAll('section');

sections.forEach(section => {
    gsap.from(section.children, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
});
