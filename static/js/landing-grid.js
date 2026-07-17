function initCanvas() {
    const canvas = document.getElementById('landing-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let points = [];
    let spacing = 35; // Valore base più compatto per una griglia fitta
    let cols = 0, rows = 0;
    let mousePos = { x: -1000, y: -1000 };
    let ripples = []; 

    // Parametri dinamici adattati allo schermo
    let dynamicWaveWidth = 260; // Dimensione dell'onda
    let dynamicWaveForce = 0.6;  // Spinta dell'onda

    // Previene onde doppie o sovrapposte ravvicinate (anti-rimbalzo)
    let lastRippleTime = 0;
    const rippleCooldown = 350; 

    // Variabile per calcolare il tempo trascorso tra i frame (Delta Time)
    let lastFrameTime = performance.now();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        points = [];
        
        const width = window.innerWidth;

        // 1. DENSITÀ DINAMICA DELLA GRIGLIA
        // Se lo schermo è piccolo (mobile), usiamo uno spacing molto fitto (30-35px).
        // Se lo schermo è grande, lo allarghiamo leggermente (fino a 45px) per non appesantire la GPU.
        if (width < 768) {
            spacing = 30; // Griglia fittissima e bellissima su mobile
            dynamicWaveWidth = 130; // L'onda su mobile è dimezzata per rimanere proporzionata
            dynamicWaveForce = 0.45; // Forza leggermente ridotta per evitare distorsioni su griglia fitta
        } else if (width < 1200) {
            spacing = 38;
            dynamicWaveWidth = 190;
            dynamicWaveForce = 0.55;
        } else {
            spacing = 45; // Griglia standard per PC desktop
            dynamicWaveWidth = 260; // Onda grande e cinematica su schermi enormi
            dynamicWaveForce = 0.6;
        }
        
        cols = Math.ceil(canvas.width / spacing) + 2;
        rows = Math.ceil(canvas.height / spacing) + 2;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = (i - 1) * spacing;
                const y = (j - 1) * spacing;
                points.push({ x, y, originX: x, originY: y });
            }
        }
    }

    window.addEventListener('resize', resize);
    
    // Funzione centralizzata per far partire l'onda in modo controllato
    function triggerRipple(x, y) {
        const now = Date.now();
        if (now - lastRippleTime < rippleCooldown) return; 
        
        lastRippleTime = now;
        ripples.push({ x, y, radius: 0, strength: 50 });
    }

    // --- FUNZIONE DI RESET DELLA POSIZIONE ---
    function resetCursor() {
        mousePos = { x: -1000, y: -1000 };
    }

    // --- GESTIONE INPUT MOUSE (PC) ---
    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', resetCursor);
    window.addEventListener('mouseup', resetCursor); 

    window.addEventListener('mousedown', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        triggerRipple(e.clientX, e.clientY);
    });

    // --- GESTIONE INPUT TOUCH (MOBILE) ---
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            mousePos.x = touch.clientX;
            mousePos.y = touch.clientY;
            triggerRipple(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mousePos.x = e.touches[0].clientX;
            mousePos.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', resetCursor);
    window.addEventListener('touchcancel', resetCursor);

    resize();

    // Loop di rendering
    function render(currentTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Delta Time (dt) tarato sui 60 FPS standard
        const dt = Math.min(3, (currentTime - lastFrameTime) / 16.666);
        lastFrameTime = currentTime;
        
        const isDark = document.documentElement.classList.contains('dark');
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();

        // 1. AGGIORNA LE ONDE (Velocità adattiva)
        for (let i = ripples.length - 1; i >= 0; i--) {
            // Su mobile l'onda viaggia leggermente più lenta per assaporarne il movimento sulla griglia fitta
            const speedMultiplier = window.innerWidth < 768 ? 3.2 : 4.8;
            ripples[i].radius += speedMultiplier * dt; 
            ripples[i].strength *= Math.pow(0.985, dt); 
            if (ripples[i].strength < 0.5) ripples.splice(i, 1);
        }

        const maxDist = window.innerWidth < 768 ? 180 : 333; // Raggio attrazione cursore ridotto su mobile

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const point = points[i * rows + j];
                if (!point) continue;

                let moveX = 0;
                let moveY = 0;

                // 2. FISICA DEL CURSORE (Attrazione)
                const dxMouse = mousePos.x - point.originX;
                const dyMouse = mousePos.y - point.originY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < maxDist) {
                    const force = (maxDist - distMouse) / maxDist;
                    const ease = Math.pow(force, 2); 
                    const pullStrength = 0.65; 
                    moveX += dxMouse * ease * pullStrength;
                    moveY += dyMouse * ease * pullStrength;
                }

                // 3. FISICA DELLE ONDE (Ripple adattivo e morbido)
                for (const ripple of ripples) {
                    const dxRipple = point.originX - ripple.x;
                    const dyRipple = point.originY - ripple.y;
                    const distRipple = Math.sqrt(dxRipple * dxRipple + dyRipple * dyRipple);

                    const distanceToWave = Math.abs(distRipple - ripple.radius);

                    if (distanceToWave < dynamicWaveWidth && distRipple > 0) {
                        const pulse = 1 - (distanceToWave / dynamicWaveWidth);
                        // Curva sinusoidale proporzionata alla larghezza dell'onda impostata nel resize()
                        const waveScale = 7 / dynamicWaveWidth; 
                        const push = Math.sin((distRipple - ripple.radius) * waveScale) * pulse * (ripple.strength * dynamicWaveForce);

                        moveX += (dxRipple / distRipple) * push;
                        moveY += (dyRipple / distRipple) * push;
                    }
                }

                const targetX = point.originX + moveX;
                const targetY = point.originY + moveY;

                // Ritorno elastico fluido
                const elastic_return = 0.1 * dt;
                point.x += (targetX - point.x) * Math.min(1, elastic_return);
                point.y += (targetY - point.y) * Math.min(1, elastic_return);

                // Disegna la griglia
                if (i < cols - 1) {
                    const right = points[(i + 1) * rows + j];
                    if (right) { ctx.moveTo(point.x, point.y); ctx.lineTo(right.x, right.y); }
                }
                if (j < rows - 1) {
                    const bottom = points[i * rows + (j + 1)];
                    if (bottom) { ctx.moveTo(point.x, point.y); ctx.lineTo(bottom.x, bottom.y); }
                }
            }
        }
        ctx.stroke();
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame((timestamp) => {
        lastFrameTime = timestamp;
        render(timestamp);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCanvas);
} else {
    initCanvas();
}