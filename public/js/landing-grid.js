document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('landing-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let points = [];
    const spacing = 40;
    let cols = 0;
    let rows = 0;
    let mousePos = { x: -1000, y: -1000 };

    // Imposta le dimensioni del canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Ricalcola la griglia
        points = [];
        cols = Math.ceil(canvas.width / spacing) + 1;
        rows = Math.ceil(canvas.height / spacing) + 1;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * spacing;
                const y = j * spacing;
                points.push({ x, y, originX: x, originY: y });
            }
        }
    }

    // Event Listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
    });

    // Inizializza
    resize();

    // Loop di animazione
    function render() {
        // Pulisci il canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Stile delle linee
        ctx.strokeStyle = "rgba(100, 100, 100, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();

        const maxDist = 300;
        const pullStrength = 0.5;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const index = i * rows + j;
                const point = points[index];
                if (!point) continue;

                const dx = mousePos.x - point.originX;
                const dy = mousePos.y - point.originY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Fisica
                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const easedForce = force * force;
                    const moveX = dx * easedForce * pullStrength;
                    const moveY = dy * easedForce * pullStrength;
                    
                    point.x += (point.originX + moveX - point.x) * 0.1;
                    point.y += (point.originY + moveY - point.y) * 0.1;
                } else {
                    point.x += (point.originX - point.x) * 0.1;
                    point.y += (point.originY - point.y) * 0.1;
                }

                // Disegna connessioni
                if (i < cols - 1) {
                    const rightPoint = points[(i + 1) * rows + j];
                    if (rightPoint) { ctx.moveTo(point.x, point.y); ctx.lineTo(rightPoint.x, rightPoint.y); }
                }
                if (j < rows - 1) {
                    const bottomPoint = points[i * rows + (j + 1)];
                    if (bottomPoint) { ctx.moveTo(point.x, point.y); ctx.lineTo(bottomPoint.x, bottomPoint.y); }
                }
            }
        }
        ctx.stroke();
        animationFrameId = requestAnimationFrame(render);
    }

    // Avvia
    render();
});