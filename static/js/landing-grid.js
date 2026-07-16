function initCanvas() {
    const canvas = document.getElementById('landing-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let points = [];
    let spacing = 45; 
    let cols = 0, rows = 0;
    let mousePos = { x: -1000, y: -1000 };
    let ripples = []; 

    // Previene onde doppie o sovrapposte ravvicinate (anti-rimbalzo)
    let lastRippleTime = 0;
    const rippleCooldown = 350; 

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        points = [];
        
        // Lo spacing si adatta alla densità dei pixel del dispositivo.
        // Mantiene la stessa proporzione fisica visiva su PC, tablet e telefoni.
        const dpr = window.devicePixelRatio || 1;
        spacing = Math.max(45, 30 * dpr); 
        
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

    // --- FUNZIONE DI RESET DELLA POSIZIONE (Annulla attrazione gravitazionale) ---
    function resetCursor() {
        mousePos = { x: -1000, y: -1000 };
    }

    // --- GESTIONE INPUT MOUSE (PC) ---
    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', resetCursor);
    window.addEventListener('mouseup', resetCursor); // Cruciale per rilasci rapidi e simulatori PC

    window.addEventListener('mousedown', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        triggerRipple(e.clientX, e.clientY);
    });

    // --- GESTIONE INPUT TOUCH (MOBILE E SIMULATORE DEVELOPER TOOL) ---
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

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.classList.contains('dark');
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();

        // 1. ESPANSIONE E DISSIPAZIONE DELLE ONDE
        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].radius += 1.6; 
            ripples[i].strength *= 0.99; 
            if (ripples[i].strength < 0.5) ripples.splice(i, 1);
        }

        const maxDist = 333; 

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

                // 3. FISICA DELLE ONDE (Ripple sinusoidale morbido)
                for (const ripple of ripples) {
                    const dxRipple = point.originX - ripple.x;
                    const dyRipple = point.originY - ripple.y;
                    const distRipple = Math.sqrt(dxRipple * dxRipple + dyRipple * dyRipple);

                    const distanceToWave = Math.abs(distRipple - ripple.radius);
                    const waveWidth = 260; 

                    if (distanceToWave < waveWidth && distRipple > 0) {
                        const pulse = 1 - (distanceToWave / waveWidth);
                        const push = Math.sin((distRipple - ripple.radius) * 0.04) * pulse * (ripple.strength * 0.5);

                        moveX += (dxRipple / distRipple) * push;
                        moveY += (dyRipple / distRipple) * push;
                    }
                }

                const targetX = point.originX + moveX;
                const targetY = point.originY + moveY;

                // Ritorno elastico progressivo
                const elastic_return = 0.06;
                point.x += (targetX - point.x) * elastic_return;
                point.y += (targetY - point.y) * elastic_return;

                // Disegno delle linee della griglia
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
    
    render();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCanvas);
} else {
    initCanvas();
}