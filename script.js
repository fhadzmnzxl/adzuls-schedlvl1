document.addEventListener('DOMContentLoaded', function () {
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    let officialClassStartDate; 
    let allMotivationalQuotes = [];
    let currentScheduleData = {}; // Store fetched schedule data globally

    const pageTitleEl = document.getElementById('pageTitle');
    const pageSubtitleEl = document.getElementById('pageSubtitle');
    const sourceLinkEl = document.getElementById('sourceLink');
    const disclaimerTextEl = document.getElementById('disclaimerText');
    
    const tabsListContainer = document.getElementById('tabsListContainer');
    const scheduleGridContainer = document.getElementById('scheduleGridContainer');
    const specialEventsSection = document.getElementById('specialEventsSection');
    const specialEventsContainer = document.getElementById('specialEventsContainer');

    const quoteSectionEl = document.getElementById('quoteSection');
    const quoteTextEl = document.getElementById('motivationalQuoteText');
    const quoteAuthorEl = document.getElementById('motivationalQuoteAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    function populateStaticText(settings) {
        if (settings.pageTitle && pageTitleEl) pageTitleEl.textContent = settings.pageTitle;
        if (settings.pageSubtitle && pageSubtitleEl) pageSubtitleEl.textContent = settings.pageSubtitle;
        if (settings.sourceLinkText && sourceLinkEl) sourceLinkEl.textContent = settings.sourceLinkText;
        if (settings.sourceLinkURL && sourceLinkEl) sourceLinkEl.href = settings.sourceLinkURL;
        if (settings.disclaimerText && disclaimerTextEl) disclaimerTextEl.textContent = settings.disclaimerText;
        if (settings.officialClassStartDate) {
            const [year, month, day] = settings.officialClassStartDate.split('-').map(Number);
            officialClassStartDate = new Date(year, month - 1, day); 
        }
    }

    function createClassEntryHTML(classData) {
        let booksHTML = '';
        if (classData.books && classData.books.length > 0) {
            booksHTML = `<ul>${classData.books.map(book => `<li>${book}</li>`).join('')}</ul>`;
        } else {
            booksHTML = 'None specified';
        }
        return `
            <div class="class-entry" data-course-id="${classData.id || classData.courseCode}">
                <span class="time">${classData.time}</span>
                <span class="course-code">${classData.courseCode}</span>
                <span class="course-name">${classData.courseName}</span>
                <span class="instructor">${classData.instructor}</span>
                <span class="time-left-indicator"></span>
                <span class="ongoing-indicator">Ongoing</span>
                <span class="tooltip">
                    <strong class="units-icon">Units:</strong> ${classData.units}<br>
                    <strong>Instructor:</strong> ${classData.instructor}<br>
                    <strong class="books-icon">Books:</strong>
                    ${booksHTML}
                </span>
            </div>`;
    }
    
    function createSpecialEventHTML(eventData) {
        let timeDisplay = '';
        const rule = eventData.displayRule;
        if (rule.timeStart && rule.timeEnd) {
            timeDisplay = `${rule.timeStart} - ${rule.timeEnd}`;
        } else if (rule.timeStart) {
            timeDisplay = `Starts at ${rule.timeStart}`;
        } else if (rule.eventTime && rule.eventTime !== "All Day") {
             timeDisplay = rule.eventTime;
        } else if (rule.eventTime === "All Day") {
             timeDisplay = "All Day";
        }

        let dateDisplay = rule.dayDisplay || rule.date || '';
        if (rule.type === "dateRange") {
            dateDisplay = `Relevant: ${rule.visibleFrom} to ${rule.visibleUntil}`;
            if(rule.eventDate) dateDisplay += ` (Event on ${rule.eventDate})`;
        } else if (rule.type === "multiDate" && rule.dates) {
            dateDisplay = `On: ${rule.dates.join(', ')}`;
        } else if (rule.type === "persistentUntil") {
             dateDisplay = `Important until: ${rule.showUntil}`;
        }

        return `
            <div class="event-entry" 
                 data-event-id="${eventData.id}" 
                 data-event-date="${rule.date || rule.eventDate || (rule.dates?.[0]) || ''}"
                 data-event-time-start="${rule.timeStart || ''}" 
                 data-event-time-end="${rule.timeEnd || ''}"
                 data-display-type="${rule.type}" 
                 data-visible-from="${rule.visibleFrom || ''}"
                 data-visible-until="${rule.visibleUntil || ''}"
                 data-show-until="${rule.showUntil || ''}"
                 ${rule.type === 'multiDate' && rule.dates ? `data-multi-dates='${JSON.stringify(rule.dates)}'` : ''}>
                <span class="event-date">${dateDisplay}</span>
                ${timeDisplay ? `<span class="event-time">${timeDisplay}</span>` : ''}
                <span class="event-title">${eventData.title}</span>
                <span class="event-details">${eventData.details}</span>
                <span class="time-left-indicator"></span> 
                <span class="ongoing-indicator"></span>
            </div>`;
    }

    function renderSchedule(scheduleData) {
        if (!scheduleGridContainer || !tabsListContainer) return;
        scheduleGridContainer.innerHTML = ''; 
        tabsListContainer.innerHTML = '';
        scheduleData.forEach(day => {
            const tabButton = document.createElement('li');
            tabButton.classList.add('tab-button');
            tabButton.dataset.day = day.dayIndex;
            tabButton.textContent = day.dayName.substring(0, 3);
            tabsListContainer.appendChild(tabButton);

            const dayColumn = document.createElement('div');
            dayColumn.classList.add('day-column');
            dayColumn.dataset.day = day.dayIndex;
            const dayHeader = document.createElement('h3');
            dayHeader.textContent = day.dayName;
            dayColumn.appendChild(dayHeader);

            if (day.classes && day.classes.length > 0) {
                day.classes.forEach(classItem => {
                    dayColumn.insertAdjacentHTML('beforeend', createClassEntryHTML(classItem));
                });
            } else {
                const noClassesP = document.createElement('p');
                noClassesP.classList.add('no-classes');
                noClassesP.textContent = `No classes scheduled on ${day.dayName}.`;
                dayColumn.appendChild(noClassesP);
            }
            scheduleGridContainer.appendChild(dayColumn);
        });
        addTabEventListeners();
        initializeMobileTabs(); 
        addTouchTooltipListeners();
    }

    function renderSpecialEvents(eventsData) {
        if (!specialEventsContainer || !specialEventsSection) return;
        specialEventsContainer.innerHTML = ''; // Clear previous events
        
        if (!eventsData || eventsData.length === 0) {
            specialEventsSection.style.display = 'none';
            return;
        }
        
        const now = new Date();
        const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        let hasVisibleEvents = false;

        eventsData.forEach(eventItem => {
            if (!eventItem.displayRule) return; 
            let shouldDisplay = false;
            const rule = eventItem.displayRule;

            try {
                switch (rule.type) {
                    case 'specificDate':
                        if (rule.date === todayYMD) {
                            const specificEventDateForTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            const eventEndTimeForCheck = rule.timeEnd ? parseTimeStrToDateObj(rule.timeEnd, specificEventDateForTime) : null;
                            if (!eventEndTimeForCheck || now < eventEndTimeForCheck) {
                                shouldDisplay = true;
                            }
                        }
                        break;
                    case 'dateRange':
                        const visibleFrom = new Date(rule.visibleFrom + "T00:00:00");
                        const visibleUntil = new Date(rule.visibleUntil + "T23:59:59"); 
                        if (now >= visibleFrom && now <= visibleUntil) {
                            shouldDisplay = true;
                        }
                        break;
                    case 'multiDate':
                        if (rule.dates && rule.dates.includes(todayYMD)) {
                            const multiEventDateForTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            const multiEventEndTime = rule.timeEnd ? parseTimeStrToDateObj(rule.timeEnd, multiEventDateForTime) : null;
                             if (!multiEventEndTime || now < multiEventEndTime) {
                                shouldDisplay = true;
                            }
                        }
                        break;
                    case 'persistentUntil':
                        const showUntil = new Date(rule.showUntil + "T23:59:59");
                        if (now <= showUntil) {
                            shouldDisplay = true;
                        }
                        break;
                }
            } catch (e) {
                console.error("Error processing displayRule for event:", eventItem.id, e);
            }

            if (shouldDisplay) {
                specialEventsContainer.insertAdjacentHTML('beforeend', createSpecialEventHTML(eventItem));
                hasVisibleEvents = true;
            }
        });

        if (specialEventsSection) {
            specialEventsSection.style.display = hasVisibleEvents ? 'block' : 'none';
        }
        addTouchTooltipListenersToEvents();
    }
    
    function displayRandomQuote() {
        if (!allMotivationalQuotes || allMotivationalQuotes.length === 0 || !quoteTextEl || !quoteAuthorEl) {
            if (quoteSectionEl) quoteSectionEl.style.display = 'none';
            return;
        }
        const randomIndex = Math.floor(Math.random() * allMotivationalQuotes.length);
        const selectedQuote = allMotivationalQuotes[randomIndex];
        quoteTextEl.textContent = `"${selectedQuote.text}"`;
        quoteAuthorEl.textContent = `— ${selectedQuote.author || 'Unknown'}`;
        if (quoteSectionEl) quoteSectionEl.style.display = 'block';
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => displayRandomQuote());
    }

    function addTabEventListeners() {
        const tabs = document.querySelectorAll('.mobile-tabs-nav .tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                if (mobileMediaQuery.matches) {
                    if (this.dataset.day === '0') { return; }
                    activateTab(this.dataset.day, true); 
                }
            });
        });
    }
    
    function activateTab(targetDay, saveToLocalStorage = false) {
        const tabs = document.querySelectorAll('.mobile-tabs-nav .tab-button');
        const dayColumns = document.querySelectorAll('.schedule-grid .day-column');
        if (targetDay === '0' && mobileMediaQuery.matches) return;
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.day === targetDay && targetDay !== '0') tab.classList.add('active');
        });
        dayColumns.forEach(column => {
            column.classList.remove('active');
            if (column.dataset.day === targetDay) column.classList.add('active');
        });
        if (saveToLocalStorage && targetDay !== '0' && mobileMediaQuery.matches) {
            localStorage.setItem('lastActiveScheduleTab', targetDay);
        }
    }

    function initializeMobileTabs() {
        const tabs = document.querySelectorAll('.mobile-tabs-nav .tab-button');
        const dayColumns = document.querySelectorAll('.schedule-grid .day-column');
        if (tabs.length === 0) return; 

        const todayJsDay = new Date().getDay();
        let defaultDayToShow = String(todayJsDay); 
        const savedTab = localStorage.getItem('lastActiveScheduleTab');

        if (todayJsDay === 0) { 
            defaultDayToShow = savedTab && savedTab !== '0' ? savedTab : '1';
        } else {
            const todayColumn = document.querySelector(`.day-column[data-day="${defaultDayToShow}"]`);
            const hasClassesToday = todayColumn && todayColumn.querySelector('.class-entry');
            if (!hasClassesToday) {
                 defaultDayToShow = savedTab && savedTab !== '0' ? savedTab : '1';
            }
        }
        
        tabs.forEach(tab => tab.classList.remove('is-today'));
        const todayTabButton = document.querySelector(`.tab-button[data-day="${String(todayJsDay)}"]`);
        if (todayTabButton) todayTabButton.classList.add('is-today');

        dayColumns.forEach(col => col.classList.remove('is-today-column'));
        const desktopTodayColumn = document.querySelector(`.day-column[data-day="${String(todayJsDay)}"]`);
        if (desktopTodayColumn && !mobileMediaQuery.matches) {
             desktopTodayColumn.classList.add('is-today-column');
        }
        
        if (mobileMediaQuery.matches) {
            dayColumns.forEach(col => col.classList.remove('active')); 
            const colToShow = document.querySelector(`.day-column[data-day="${defaultDayToShow}"]`);
            if(colToShow) colToShow.classList.add('active');
            const activeTabButton = document.querySelector(`.tab-button[data-day="${defaultDayToShow}"]`);
            if(activeTabButton && defaultDayToShow !== '0') activeTabButton.classList.add('active');
        } else { 
            dayColumns.forEach(column => {
                // On desktop, all day-columns are 'active' in terms of class for potential styling,
                // but their display:block is handled by CSS media query directly.
                column.classList.add('active'); 
            });
        }
    }
    
    mobileMediaQuery.addEventListener('change', () => initializeMobileTabs());
    
    function parseTimeStrToDateObj(timeStr, referenceFullDate) {
        const dateToUse = new Date(referenceFullDate); 
        const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM|NN)/i);
        if (!timeParts) return null;
        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const period = timeParts[3].toUpperCase();
        if (period === 'PM' && hours < 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        dateToUse.setHours(hours, minutes, 0, 0);
        return dateToUse;
    }

    function updateTimers(itemsSelector, isRegularClass) {
        const now = new Date();
        const currentDayOfWeekJs = now.getDay(); 
        const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        if (isRegularClass && officialClassStartDate && now < officialClassStartDate) {
            document.querySelectorAll(itemsSelector).forEach(entry => {
                const timeLeftIndicator = entry.querySelector('.time-left-indicator');
                const ongoingIndicator = entry.querySelector('.ongoing-indicator');
                if (timeLeftIndicator) timeLeftIndicator.style.display = 'none';
                if (ongoingIndicator) ongoingIndicator.style.display = 'none';
                entry.classList.remove('is-ongoing');
            });
            return;
        }

        document.querySelectorAll(itemsSelector).forEach(entry => {
            const timeLeftIndicator = entry.querySelector('.time-left-indicator');
            const ongoingIndicator = entry.querySelector('.ongoing-indicator');
            if (!timeLeftIndicator || !ongoingIndicator) return;
            
            entry.classList.remove('is-ongoing');
            timeLeftIndicator.style.display = 'none'; timeLeftIndicator.textContent = '';
            ongoingIndicator.style.display = 'none'; 
            ongoingIndicator.textContent = isRegularClass ? 'Ongoing' : 'Happening Now';

            let itemDateForTimingLogic; 
            let itemStartTimeStr, itemEndTimeStr;
            let eventIsTodayAndHasTimes = false;

            if (isRegularClass) {
                const dayColumn = entry.closest('.day-column');
                if (!dayColumn) return;
                const classDay = parseInt(dayColumn.dataset.day, 10);
                if (classDay !== currentDayOfWeekJs) return;
                
                const timeElement = entry.querySelector('.time');
                if (!timeElement) return;
                const timeRangeStr = timeElement.textContent.trim();
                const timeRangeParts = timeRangeStr.split(' - ');
                if (timeRangeParts.length < 2) return;
                itemStartTimeStr = timeRangeParts[0];
                itemEndTimeStr = timeRangeParts[1];
                itemDateForTimingLogic = new Date(now); 
                eventIsTodayAndHasTimes = true; 
            } else { 
                const eventDataDateStr = entry.dataset.eventDate; 
                itemStartTimeStr = entry.dataset.eventTimeStart;
                itemEndTimeStr = entry.dataset.eventTimeEnd;

                if (eventDataDateStr && itemStartTimeStr && itemEndTimeStr) { 
                    if (eventDataDateStr === todayYMD) {
                         const [year, month, day] = eventDataDateStr.split('-').map(Number);
                         itemDateForTimingLogic = new Date(year, month - 1, day);
                         eventIsTodayAndHasTimes = true;
                    }
                }
            }
            
            if (!eventIsTodayAndHasTimes) return; 

            const itemStartDateTime = parseTimeStrToDateObj(itemStartTimeStr, itemDateForTimingLogic);
            const itemEndDateTime = parseTimeStrToDateObj(itemEndTimeStr, itemDateForTimingLogic);

            if (!itemStartDateTime || !itemEndDateTime) return;

            if (now >= itemStartDateTime && now < itemEndDateTime) {
                entry.classList.add('is-ongoing');
                ongoingIndicator.style.display = 'inline-block';
            } else if (now < itemStartDateTime) { 
                const timeLeftMs = itemStartDateTime.getTime() - now.getTime();
                const totalMinutesLeft = Math.floor(timeLeftMs / (1000 * 60));
                const hoursLeft = Math.floor(totalMinutesLeft / 60);
                const minutesPart = totalMinutesLeft % 60;
                let text = '';
                if (hoursLeft > 0) text = `${hoursLeft}h`;
                else if (minutesPart > 0) text = `${minutesPart}m`;
                else if (timeLeftMs > 0 && timeLeftMs < (1000 * 60)) text = '<1m';
                if (text) {
                    timeLeftIndicator.textContent = text;
                    timeLeftIndicator.style.display = 'inline-block';
                }
            } else { // Event is past
                if (!isRegularClass && entry.dataset.displayType === 'specificDate') { 
                    entry.classList.add('hidden-event'); 
                    setTimeout(() => { 
                        if (entry.parentNode) entry.parentNode.removeChild(entry);
                        if (specialEventsContainer && specialEventsContainer.children.length === 0 && specialEventsSection) {
                            specialEventsSection.style.display = 'none';
                        }
                    }, 500); 
                }
            }
        });
    }
    
    function addTouchTooltipListenersToSelector(selector) {
        if (isTouchDevice) {
             document.querySelectorAll(selector).forEach(entry => {
                const tooltip = entry.querySelector('.tooltip'); 
                if (tooltip || selector.includes('.event-entry')) { 
                    entry.addEventListener('click', function(e) {
                        if (this.classList.contains('tooltip-active')) {
                            this.classList.remove('tooltip-active');
                        } else {
                            document.querySelectorAll('.class-entry.tooltip-active, .event-entry.tooltip-active').forEach(ae => ae.classList.remove('tooltip-active'));
                            this.classList.add('tooltip-active');
                        }
                        e.stopPropagation(); 
                    });
                }
            });
        }
    }
    function addTouchTooltipListeners() { addTouchTooltipListenersToSelector('.class-entry'); }
    function addTouchTooltipListenersToEvents(){ addTouchTooltipListenersToSelector('.event-entry'); }
     if (isTouchDevice) {
        document.body.addEventListener('click', function(e) {
            document.querySelectorAll('.class-entry.tooltip-active, .event-entry.tooltip-active').forEach(activeEntry => {
                if (!activeEntry.contains(e.target)) activeEntry.classList.remove('tooltip-active');
            });
        });
    }
    
    function runAllUpdates() {
        if (currentScheduleData && currentScheduleData.specialEvents) {
            renderSpecialEvents(currentScheduleData.specialEvents); 
        }
        updateTimers('.schedule-grid .class-entry', true);
        updateTimers('.special-events-section .event-entry', false);
    }
    
    Promise.all([
        fetch('schedule.json').then(res => {
            if (!res.ok) throw new Error(`Schedule JSON fetch error: ${res.statusText}`);
            return res.json();
        }),
        fetch('quotes.json').then(res => {
            if (!res.ok) { 
                console.warn('Quotes JSON not found or fetch error, quotes will not be displayed.');
                return []; 
            }
            return res.json();
        }).catch(err => { 
            console.warn('Error fetching quotes.json:', err.message, '. Quotes will not be displayed.');
            return []; 
        })
    ])
    .then(([scheduleAPIData, quotesData]) => {
        currentScheduleData = scheduleAPIData; 
        allMotivationalQuotes = quotesData;
        populateStaticText(scheduleAPIData.settings);
        renderSchedule(scheduleAPIData.weeklySchedule); // Render main schedule first
        renderSpecialEvents(scheduleAPIData.specialEvents); // Then special events (which might affect section visibility)
        initializeMobileTabs(); 
        if (allMotivationalQuotes.length > 0) displayRandomQuote(); else if(quoteSectionEl) quoteSectionEl.style.display = 'none';
        runAllUpdates(); 
        setInterval(runAllUpdates, 30000); 
    })
    .catch(error => { 
        console.error('Error fetching initial data:', error);
        if(scheduleGridContainer) scheduleGridContainer.innerHTML = `<p style="color:red; text-align:center;">Could not load schedule data. Error: ${error.message}. Please try again later.</p>`;
        if (quoteSectionEl) quoteSectionEl.style.display = 'none';
    });
});
