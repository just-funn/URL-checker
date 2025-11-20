// Multi-timezone digital clock

(function () {
    const addBtn = document.getElementById('addBtn');
    const tzSelect = document.getElementById('timezoneSelect');
    const clocksArea = document.getElementById('clocksArea');

    // Default clocks
    const defaultZones = ['local', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

    // Keep track of displayed zones to avoid duplicates
    const shownZones = new Set();

    function prettyZoneLabel(zone) {
        if (zone === 'local') return 'Local Time';
        return zone.replace('_', ' ');
    }

    function formatTimeForZone(time, zone) {
        // Use Intl.DateTimeFormat for timezone-aware formatting
        try {
            if (zone === 'local') {
                return {
                    time: time.toLocaleTimeString(),
                    date: time.toLocaleDateString()
                };
            }
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: zone };
            const optionsDate = { year: 'numeric', month: 'short', day: 'numeric', timeZone: zone };
            const timeStr = new Intl.DateTimeFormat(undefined, optionsTime).format(time);
            const dateStr = new Intl.DateTimeFormat(undefined, optionsDate).format(time);
            return { time: timeStr, date: dateStr };
        } catch (e) {
            // Fallback to UTC if invalid timezone
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'UTC' };
            const optionsDate = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
            return {
                time: new Intl.DateTimeFormat(undefined, optionsTime).format(time),
                date: new Intl.DateTimeFormat(undefined, optionsDate).format(time)
            };
        }
    }

    function createClockCard(zone) {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.dataset.zone = zone;

        const zoneTitle = document.createElement('div');
        zoneTitle.className = 'clock-zone';
        zoneTitle.textContent = prettyZoneLabel(zone);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'clock-time';
        timeDiv.textContent = '--:--:--';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'clock-date';
        dateDiv.textContent = '';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            shownZones.delete(zone);
            clocksArea.removeChild(card);
        });

        card.appendChild(zoneTitle);
        card.appendChild(timeDiv);
        card.appendChild(dateDiv);
        card.appendChild(removeBtn);

        return { card, timeDiv, dateDiv };
    }

    function addZone(zone) {
        if (shownZones.has(zone)) return;
        const { card, timeDiv, dateDiv } = createClockCard(zone);
        clocksArea.appendChild(card);
        shownZones.add(zone);

        // Store DOM nodes on the card for fast updates
        card._timeDiv = timeDiv;
        card._dateDiv = dateDiv;
    }

    function updateClocks() {
        const now = new Date();
        const cards = clocksArea.querySelectorAll('.clock-card');
        cards.forEach(card => {
            const zone = card.dataset.zone;
            const formatted = formatTimeForZone(now, zone);
            card._timeDiv.textContent = formatted.time;
            card._dateDiv.textContent = formatted.date;
        });
    }

    // Initialize defaults
    defaultZones.forEach(addZone);
    updateClocks();
    setInterval(updateClocks, 1000);

    addBtn.addEventListener('click', () => {
        const zone = tzSelect.value;
        addZone(zone);
    });

    // Allow adding by pressing Enter while select has focus
    tzSelect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
            e.preventDefault();
        }
    });
})();
