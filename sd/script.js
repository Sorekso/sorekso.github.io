const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const addButton = document.getElementById('addButton');
const removeButton = document.getElementById('removeButton'); // Botón para eliminar el ganador
const nameInput = document.getElementById('nameInput');

let participants = []; // Array para almacenar los nombres
let isSpinning = false; // Variable para evitar múltiples giros simultáneos
let totalRotation = 0; // Para mantener la rotación acumulada

// Agregar participantes
addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name); // Agregar el nombre al array
        drawWheel(); // Dibujar la ruleta
        nameInput.value = ''; // Limpiar el input
    }
});

// Girar la ruleta
spinButton.addEventListener('click', () => {
    if (participants.length === 0) {
        alert("¡Por favor, agrega nombres antes de girar!");
        return;
    }

    if (isSpinning) return; // Evitar que se pueda girar mientras está girando
    isSpinning = true;
    spinButton.disabled = true; // Desactivar el botón de girar durante el giro

    const rotations = 13.2; // 13.2 vueltas completas
    const rotationDegrees = rotations * 360; // Total en grados
    totalRotation += rotationDegrees; // Acumulamos la rotación total

    canvas.style.transition = 'transform 4s ease-out'; // Añadir una transición suave de 4 segundos
    canvas.style.transform = `rotate(${totalRotation}deg)`; // Aplicar la rotación acumulada

    // Habilitar el botón de eliminar ganador (en este caso, la segunda opción)
    setTimeout(() => {
        isSpinning = false;
        removeButton.disabled = false; // Habilitar el botón de eliminar después del giro
    }, 4000); // 4 segundos es el tiempo de la animación
});

// Eliminar la opción verde (segunda opción) al apretar el botón de "Eliminar ganador"
removeButton.addEventListener('click', () => {
    if (participants.length >= 2) {
        participants.splice(1, 1); // Eliminar la segunda opción (índice 1)
        drawWheel(); // Redibujar la ruleta
        removeButton.disabled = true; // Deshabilitar el botón después de eliminar
        spinButton.disabled = false; // Habilitar el botón de girar nuevamente
    } else {
        alert("No hay suficientes participantes para eliminar.");
    }
});

// Dibujar la ruleta
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    if (participants.length === 0) {
        return; // No dibujar si no hay participantes
    }

    const colors = ['#ff0', '#0f0', '#00f', '#f00'];
    const angleIncrement = 360 / participants.length;

    participants.forEach((name, index) => {
        const startAngle = (angleIncrement * index) * (Math.PI / 180);
        const endAngle = (angleIncrement * (index + 1)) * (Math.PI / 180);

        // Dibujar la sección
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, 140, startAngle, endAngle);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // Dibujar el texto
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + angleIncrement / 2 * (Math.PI / 180));
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(name, 70, 10);
        ctx.restore();
    });
}
