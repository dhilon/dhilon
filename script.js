const inPerson = document.getElementById('in-person');
const remote = document.getElementById('remote');
const remoteUrl = document.getElementById('event_remote_url');
const eventLocation = document.getElementById('event_location');
const modality = document.getElementById('event_modality');
const eventName = document.getElementById('event-name');
const eventWeekday = document.getElementById('event_weekday');
const eventTime = document.getElementById('time');
const eventAttendees = document.getElementById('event_attendees');
const remoteUrlInput = document.getElementById('event_remote_url_input');
const locationInput = document.getElementById('event_location_input');
const eventCategory = document.getElementById('event_category');
const modal = document.getElementById('event_modal');
// Bootstrap modal instance
const bsModal = typeof bootstrap !== 'undefined' ? new bootstrap.Modal(modal) : null;
const closeModal = document.getElementById('close_modal');
const saveModal = document.getElementById('save_modal');
const xModal = document.getElementById('x_modal');
const eventDetails = {};

// Set the default behavior for the Save button (create mode)
function setDefaultSaveHandler() {
    saveModal.onclick = () => {
        if (saveEvent()) {
            if (bsModal) { bsModal.hide(); } else { modal.style.display = 'none'; }
        }
    };
}

function modalityChange() {
    if (modality.value === 'in-person') {
        remoteUrl.hidden = true;
        eventLocation.hidden = false;
        // Toggle required fields for modality
        locationInput.required = true;
        remoteUrlInput.required = false;
    } else {
        remoteUrl.hidden = false;
        eventLocation.hidden = true;
        // Toggle required fields for modality
        remoteUrlInput.required = true;
        locationInput.required = false;
    }
}

function saveEvent() {
    const form = document.getElementById('data-form');
    // HTML5 validation: if invalid, show messages and abort
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    const eventDetails = {
        name: eventName.value,
        weekday: eventWeekday.value,
        time: eventTime.value,
        modality: modality.value,
        location: locationInput.value,
        remote_url: remoteUrlInput.value,
        attendees: eventAttendees.value,
        category: eventCategory.value
    };
    console.log(eventDetails);
    addEventToCalendarUI(eventDetails);
    document.getElementById('data-form').reset();
    modal.style.display = 'none';
    // Reset required toggles to default state
    modalityChange();
    return true;
}

function createEventCard(eventInfo) {
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1';
    let info = document.createElement('div');
    if (eventInfo.modality === 'in-person') {
        info.innerHTML = "<b>Event Name: </b>" + (eventInfo.name ? eventInfo.name : 'N/A') + '<br>' + "<b>Weekday: </b>" + (eventInfo.weekday ? eventInfo.weekday : 'N/A') + '<br>' + "<b>Time: </b>" + (eventInfo.time ? eventInfo.time : 'N/A') + '<br>' + "<b>Modality: </b>" + (eventInfo.modality ? eventInfo.modality : 'N/A') + '<br>' + "<b>Location: </b>" + (eventInfo.location ? eventInfo.location : 'N/A') + '<br>' + "<b>Attendees: </b>" + (eventInfo.attendees ? eventInfo.attendees : 'N/A');
    }
    else {
        info.innerHTML = "<b>Event Name: </b>" + (eventInfo.name ? eventInfo.name : 'N/A') + '<br>' + "<b>Weekday: </b>" + (eventInfo.weekday ? eventInfo.weekday : 'N/A') + '<br>' + "<b>Time: </b>" + (eventInfo.time ? eventInfo.time : 'N/A') + '<br>' + "<b>Modality: </b>" + (eventInfo.modality ? eventInfo.modality : 'N/A') + '<br>' + "<b>Remote URL: </b>" + (eventInfo.remote_url ? eventInfo.remote_url : 'N/A') + '<br>' + "<b>Attendees: </b>" + (eventInfo.attendees ? eventInfo.attendees : 'N/A');
    }

    event_element.appendChild(info);
    return event_element;
}

function addEventToCalendarUI(eventInfo) {
    let event_card = createEventCard(eventInfo);
    event_card.style.color = 'white';
    if (eventInfo.category === 'Work') {
        event_card.style.backgroundColor = 'blue';
    }
    else if (eventInfo.category === 'School') {
        event_card.style.backgroundColor = 'green';
    }
    else if (eventInfo.category === 'Personal') {
        event_card.style.backgroundColor = 'purple';
    }
    else {
        event_card.style.backgroundColor = 'black';
    }
    event_card.onclick = () => changeCard(event_card, eventInfo);
    document.getElementById(`${eventInfo.weekday.toLowerCase()}`).appendChild(event_card);
}

function changeCard(event_card, eventInfo) {
    if (bsModal) { bsModal.show(); } else { modal.style.display = 'block'; modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; }
    eventName.value = eventInfo.name;
    eventWeekday.value = eventInfo.weekday;
    eventTime.value = eventInfo.time;
    modality.value = eventInfo.modality;
    locationInput.value = eventInfo.location;
    remoteUrlInput.value = eventInfo.remote_url;
    eventAttendees.value = eventInfo.attendees;
    eventCategory.value = eventInfo.category;
    // Ensure modality-specific fields reflect current selection
    modalityChange();
    // Close buttons should also restore default save handler (create mode)
    closeModal.onclick = () => { if (bsModal) { bsModal.hide(); } else { modal.style.display = 'none'; } setDefaultSaveHandler(); };
    xModal.onclick = () => { if (bsModal) { bsModal.hide(); } else { modal.style.display = 'none'; } setDefaultSaveHandler(); };
    // In edit mode, replace save handler to update the card safely
    saveModal.onclick = () => {
        const container = document.getElementById(`${eventInfo.weekday.toLowerCase()}`);
        if (container && container.contains(event_card)) {
            container.removeChild(event_card);
        }
        if (saveEvent()) {
            if (bsModal) { bsModal.hide(); } else { modal.style.display = 'none'; }
        }
        // After saving an edit, revert to default create behavior
        setDefaultSaveHandler();
    };
}

// Initialize default save handler on load
setDefaultSaveHandler();
// Initialize modality-specific required flags
modalityChange();