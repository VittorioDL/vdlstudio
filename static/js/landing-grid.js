document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('landing-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let points = [];
    const spacing = 45; 
    let cols = 0, rows = 0;
    let mousePos = { x: -1000, y: -1000 };
    
    // Array che conterrà tutte le onde attive
    let ripples = []; 

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        points = [];
        
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
    
    // --- GESTIONE MOVIMENTO (Peso Gravitazionale) ---
    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mousePos = { x: -1000, y: -1000 }; 
    });

    window.addEventListener('touchmove', (e) => {
        mousePos.x = e.touches[0].clientX;
        mousePos.y = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', () => {
        mousePos = { x: -1000, y: -1000 }; 
    });

    // --- TRIGGER DELL'ONDA (Click o Tap) ---
    window.addEventListener('mousedown', (e) => {
        // Aggiunge un nuovo ripple alle coordinate del click
        ripples.push({ x: e.clientX, y: e.clientY, radius: 0, strength: 50 });
    });
    window.addEventListener('touchstart', (e) => {
        ripples.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, radius: 0, strength: 50 });
    }, { passive: true });

    resize();

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.classList.contains('dark');

        // Linee pulite senza effetti di luce
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();

        // 1. AGGIORNA LE ONDE (Espansione e Dissipazione)
        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].radius += 1.6; // Velocità dell'onda
            ripples[i].strength *= 0.985; // L'onda perde forza man mano che si allarga
            // Se l'onda è troppo debole, rimuovila dalla memoria
            if (ripples[i].strength < 0.5) ripples.splice(i, 1);
        }

        const maxDist = 333; // Raggio dell'attrazione del cursore

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const point = points[i * rows + j];
                if (!point) continue;

                let moveX = 0;
                let moveY = 0;

                // 2. FISICA DEL CURSORE (Massa che attrae)
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

                // 3. FISICA DELLE ONDE (Ripple)
                for (const ripple of ripples) {
                    const dxRipple = point.originX - ripple.x;
                    const dyRipple = point.originY - ripple.y;
                    const distRipple = Math.sqrt(dxRipple * dxRipple + dyRipple * dyRipple);

                    // Calcola quanto il punto è distante dal fronte dell'onda
                    const distanceToWave = Math.abs(distRipple - ripple.radius);
                    const waveWidth = 100; // Spessore del "bordo" dell'onda

                    if (distanceToWave < waveWidth && distRipple > 0) {
                        const pulse = 1 - (distanceToWave / waveWidth); // 1 al centro dell'onda, 0 ai margini
                        // Funzione coseno per far ondeggiare il punto avanti e indietro
                        const push = Math.cos((distRipple - ripple.radius) * 0.1) * pulse * ripple.strength;

                        moveX += (dxRipple / distRipple) * push;
                        moveY += (dyRipple / distRipple) * push;
                    }
                }

                const targetX = point.originX + moveX;
                const targetY = point.originY + moveY;

                // Ritorno elastico più veloce (0.15 invece di 0.08) per far stabilizzare prima la griglia
                elastic_return = 0.09;
                point.x += (targetX - point.x) * elastic_return;
                point.y += (targetY - point.y) * elastic_return;

                // Disegna le connessioni
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
});