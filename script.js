// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Custom Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 2. Navbar Scroll Effect & Smooth Scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // 4. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / 50; // Speed adjustment

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            hasCounted = true;
        }
    }, { threshold: 0.15 });

    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // 6. Gallery Snake Animation
    const snakeGallery = document.getElementById('snakeGallery');
    if (snakeGallery) {
        const originalItems = Array.from(snakeGallery.children);
        let items = [];
        let rows = 3;

        function getItemDimensions() {
            const vw = window.innerWidth;
            if (vw <= 480) return { w: 180, h: 101, gap: 5 };
            if (vw <= 768) return { w: 220, h: 124, gap: 8 };
            return { w: 350, h: 197, gap: 15 };
        }

        let dims = getItemDimensions();
        let itemWidth = dims.w;
        let itemHeight = dims.h;
        let targetGap = dims.gap;
        const speed = 1.2; // Pixels per frame

        let containerWidth = snakeGallery.clientWidth;
        let L = containerWidth + itemWidth; // Length of one segment (row)
        let gap = targetGap;
        let totalTrackLength = 0;

        function rebuildTrack() {
            // Recalculate dimensions for current viewport
            dims = getItemDimensions();
            itemWidth = dims.w;
            itemHeight = dims.h;
            targetGap = dims.gap;

            containerWidth = snakeGallery.clientWidth;
            L = containerWidth + itemWidth;
            
            // Calculate how many rows we need to fit ALL items without overlapping
            const minTotalLength = originalItems.length * (itemWidth + targetGap);
            rows = Math.max(3, Math.ceil(minTotalLength / L));
            
            totalTrackLength = rows * L;

            // Re-render items
            snakeGallery.innerHTML = '';
            items = [];

            for (let i = 0; i < originalItems.length; i++) {
                const clone = originalItems[i].cloneNode(true);
                clone.style.width = itemWidth + 'px';
                clone.style.height = itemHeight + 'px';
                snakeGallery.appendChild(clone);
                items.push(clone);
            }

            // Calculate exact gap to distribute them perfectly
            gap = (totalTrackLength / originalItems.length) - itemWidth;

            // Set positions and wrapper height
            items.forEach((item, index) => {
                item.d = index * (itemWidth + gap);
                item.style.transition = 'none';
            });

            snakeGallery.style.height = (rows * itemHeight + (rows - 1) * gap) + 'px';
        }

        rebuildTrack();

        // Handle window resizing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(rebuildTrack, 100);
        });

        let isPaused = false;
        snakeGallery.addEventListener('mousedown', () => { isPaused = true; });
        window.addEventListener('mouseup', () => { isPaused = false; });
        snakeGallery.addEventListener('touchstart', () => { isPaused = true; });
        window.addEventListener('touchend', () => { isPaused = false; });

        function animateSnake() {
            if (!isPaused && totalTrackLength > 0) {
                containerWidth = snakeGallery.clientWidth;
                L = containerWidth + itemWidth;

                items.forEach(item => {
                    item.d += speed;

                    // Wrap around seamlessly
                    if (item.d >= totalTrackLength) {
                        item.d -= totalTrackLength;
                    }

                    let row = Math.floor(item.d / L);
                    let offset = item.d % L;
                    let x, y;

                    // Even rows move right, odd rows move left
                    if (row % 2 === 0) {
                        x = offset - itemWidth;
                    } else {
                        x = containerWidth - offset;
                    }
                    
                    y = row * (itemHeight + gap);
                    item.style.transform = `translate(${x}px, ${y}px)`;
                });
            }
            requestAnimationFrame(animateSnake);
        }

        animateSnake();
    }

    // 7. Infographics Progress Bars
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressCounters = document.querySelectorAll('.progress-counter');
    const whyWorkSection = document.querySelector('.why-work');

    const progressObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate Bars
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });

            // Animate text counter from 0% to 100%
            progressCounters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const duration = 1500; // matching transition duration in css (1.5s)
                const stepTime = Math.abs(Math.floor(duration / target));

                const timer = setInterval(() => {
                    current += 1;
                    counter.textContent = current + "%";
                    if (current >= target) {
                        clearInterval(timer);
                    }
                }, stepTime);
            });

            // Stop observing after firing
            progressObserver.unobserve(whyWorkSection);
        }
    }, { threshold: 0.3 });

    if (whyWorkSection) {
        progressObserver.observe(whyWorkSection);
    }

    // 8. Timeline Line Animation
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            timelineContainer.classList.add('scrolled');
        }
    }, { threshold: 0.5 });

    if (timelineContainer) {
        timelineObserver.observe(timelineContainer);
    }

    // 9. Mouse Parallax for Hero Stack
    const heroSection = document.querySelector('.hero');
    const parallaxStack = document.getElementById('parallax-stack');

    heroSection.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        if (parallaxStack) {
            parallaxStack.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        if (parallaxStack) {
            parallaxStack.style.transform = `rotateY(0deg) rotateX(0deg)`;
        }
    });

    // 10. Simple Particles Animation on Canvas
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = 'rgba(255,255,255,0.1)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        init();
        animate();
    }
});
