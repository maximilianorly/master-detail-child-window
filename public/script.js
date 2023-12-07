// START: base window code
const btnOpenMasterDetail = document.getElementById("openMasterDetail");
const btnSendMax = document.getElementById('sendMax');
const btnSendCarter = document.getElementById('sendCarter');

let newWindow;

const dataManager = {
    primaryData: {
        name: 'Max',
        age: 29,
        shoeSize: 7
    },
    secondaryData: {
        name: 'Carter',
        age: 5,
        shoeSize: null
    },
    _activeData: null,

    setActiveData(dataKey) {
        const dataMap = {
            'Max': this.primaryData,
            'Carter': this.secondaryData
        };
        this._activeData = dataMap[dataKey] || null;
    },

    getActiveData() {
        return this._activeData;
    },

    sendData() {
        if (this._activeData) {
            try {
                newWindow.postMessage(JSON.stringify(this._activeData), 'http://localhost:3000');
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    },

    updateDataDisplay() {
        if (!this._activeData) {
            return;
        }
        dataDisplay.textContent = `Name: ${this._activeData.name}, Age: ${this._activeData.age}, Shoe Size: ${this._activeData.shoeSize}`;
    }
};

// toggle send buttons
const toggleSendButtons = (enable) => {
    btnSendMax.disabled = !enable;
    btnSendCarter.disabled = !enable;
};
// default disabled, matching HTML
toggleSendButtons(false);


document.getElementById('openWindow').addEventListener('click', () => {
    if (newWindow && !newWindow.closed) {
        alert("The window is already open.");
    } else {
        newWindow = window.open('http://localhost:3000/master-detail', 'newWindow', 'width=400,height=300');
        if (newWindow) {
            // pass data using postMessage
            newWindow.onload = () => {
                // close modal
                isModal.toggle = false;
                
                // prepare content to send
                var p = newWindow.document.createElement('p');
                p.textContent = 'Hello from the parent window!';
                newWindow.document.getElementById('welcomeMessage').appendChild(p);
                dataManager.sendData()
            };
        }
    }
});

function handleSendButtonClick(buttonElement) {
    dataManager.setActiveData(buttonElement.dataset.point);

    if (newWindow && !newWindow.closed) {
        dataManager.sendData();
        newWindow.focus();
    } else {
        isModal.toggle && dataManager.updateDataDisplay();
    }
}

btnSendMax.addEventListener('click', () => handleSendButtonClick(btnSendMax));

btnSendCarter.addEventListener('click', () => handleSendButtonClick(btnSendCarter));

// close child window on parent unload
window.addEventListener('beforeunload', () => {
    if (newWindow && !newWindow.closed) {
        newWindow.close();
    }
});

function handleButtonsPureReset() {
    if (!isModal.toggle) {
        toggleSendButtons(false);
        btnOpenMasterDetail.disabled = false;
    }
}
// END: base window code

// START: modal code
const modal = document.getElementById("myModal");
const btnCloseModal = document.getElementsByClassName("close")[0];

const isModal = {
    _isModal: false,

    get toggle() {
        return this._isModal;
    },

    set toggle(value) {
        this._isModal = value;
        if (!value) {
            modal.style.display = "none";
            btnOpenMasterDetail.disabled = false;
        } else {
            dataManager.updateDataDisplay();
            modal.style.display = "block";
            btnOpenMasterDetail.disabled = true;
        }
    }
}

// When the user clicks the button, open the modal 
btnOpenMasterDetail.onclick = function() {
    if (newWindow && !newWindow.closed) {
        alert("The window is already open.");
        newWindow.focus();
        return;
    }
    isModal.toggle = true;
    toggleSendButtons(true);
}

// When the user clicks on <span> (x), close the modal
btnCloseModal.onclick = function() {
    isModal.toggle = false;
    toggleSendButtons(false);
}


function reopenModalOnChildWindowClose() {
    isModal.toggle = true;
    toggleSendButtons(true);
}

// END: modal code