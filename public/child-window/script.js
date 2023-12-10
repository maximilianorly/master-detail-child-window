// Public ENV vars sent by server
const BASE_URL = publicEnvVars.BASE_URL
window.addEventListener("message", (event) => {
    if (
        // accept only from specified origin
        event.origin !== BASE_URL
        // handle interval messages from other sources than the opening window, i.e. react-dev-tools -.-
        || event.source !== window.opener) {
        return;
    }
    if (event.data) {
        try {
            var data = JSON.parse(event.data);
            var displayArea = document.getElementById('dataDisplay');
        
            displayArea.textContent = `Name: ${data.name}, Age: ${data.age}, Shoe Size: ${data.shoeSize}`;
        } catch (err) {
            console.error('Incorrect data format sent to window. Message:', event.data);
            return;
        }
    }
});

document.getElementById('closeAndOpenModal').addEventListener('click', () => {
    window.opener.reopenModalOnChildWindowClose();
    window.close();
});

window.onunload = () => {
    if (window.opener && !window.opener.closed) {
        window.opener.handleButtonsPureReset();
    }
};