document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const form = document.getElementById('form');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const messages = document.getElementById('messages');

    // --- Event Listeners ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (nameInput.value && messageInput.value) {
            const messageData = {
                sender: nameInput.value,
                message: messageInput.value
            };
        
            socket.emit('chat message', messageData);
       
            messageInput.value = ''; 
            messageInput.focus();
        }
    });

    
    socket.on('load old messages', (msgs) => {
        msgs.forEach(msg => {
            displayMessage(msg);
        });
    });

   
    socket.on('chat message', (data) => {
        displayMessage(data);
    });


    function displayMessage(data) {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${data.sender}</strong>: ${data.message}`;

    
        if (nameInput.value && data.sender === nameInput.value) {
            item.classList.add('my-message');
        } else {
            item.classList.add('other-message');
        }
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    }
});