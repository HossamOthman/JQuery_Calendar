import { getDayIndex, addDays, dateString } from "./helper.js";
import {Event, MODE} from './Event.js';


 export class Calendar {
    constructor() {
        this.weekStart = null;
        this.weekEnd = null;
        this.weekOffset = 0;
        this.mode = MODE.VIEW;
        this.events = {};
        this.slotHeight = 30;
        this.eventsLoaded = false;
        this.readyToTrash = false;
    }

    setup() {
        this.setupTimes();
        this.setupDays();
        this.calculateCurrentWeek();
        this.showWeek();
        this.setupControls();
        this.loadEvents();
    }

    setupTimes() {
        const header = $("<div></div>").addClass("columnHeader");
        const slots = $("<div></div>").addClass("slots");
        for (let hour = 0; hour < 24; hour++){
            $("<div></div>").attr("data-hour", hour)
            .addClass('time')
            .text(`${hour}:00 - ${hour+1}:00`)
            .appendTo(slots);
        }
        $('.dayTime').append(header).append(slots);
    }

    setupDays() {
        const cal = this;
        $('.day').each(function() {
            const dayIndex = parseInt($(this).attr('data-dayIndex'));
            const name = $(this).attr('data-name');
            const header = $("<div></div>").addClass("columnHeader").text(name);
            $('<div></div>').addClass('dayDisplay').appendTo(header)
            const slots = $("<div></div>").addClass("slots");
        
            for (let hour = 0; hour < 24; hour++){
                $("<div></div>").attr("data-hour", hour)
                .addClass('slot')
                .appendTo(slots)
                .click(() => cal.clickSlot(hour, dayIndex))
                .hover(
                    () => cal.hoverOver(hour), 
                    () => cal.hoverOut()
                );
            }
            $(this).append(header).append(slots);
        })
    }
    clickSlot(hour, dayIndex) {
        // console.log('click', hour, dayIndex);
        if (this.mode != MODE.VIEW ){
            return;
        }
        this.mode = MODE.CREATE;
        const start = hour.toString().padStart(2, '0') + ':00';
        const end = hour < 23 ? (hour+1).toString().padStart(2, '0') + ':00' : '23:59' ;
        const date = dateString(addDays(this.weekStart, dayIndex));
        const event = new Event ({
            start, end, date, title: '', description: '', color: 'red'
        });
        this.openModal(event);
    }

    openModal(event){
        $('#modalTitle').text(this.mode == MODE.UPDATE ? 'Update your Event' :'Create New Event' );
        $('#eventTitle').val(event.title);
        $('#eventDate').val(event.date);
        $('#eventStart').val(event.start);
        $('#eventEnd').val(event.end);
        $('#eventDescription').val(event.description);
        $('.color').removeClass('active');
        $(`.color[data-color=${event.color}]`).addClass('active');
        if (this.mode ==  MODE.UPDATE) {
            $('#submitButton').val('Update');
            $('#deleteButton').show()
                .off('click')
                .click(() => {
                
                event.deleteIn(this);
            });
            $('#copyButton').show()
                .off('click')
                .click(() => {
                
                event.copyIn(this);
            })
        } else if (this.mode ==  MODE.CREATE) {
            $('#submitButton').val('Create');
            $('#deleteButton, #copyButton').hide();
        }
        $('#eventModal').fadeIn(200);
        $('#eventTitle').focus();
        $('#calendar').addClass('opaque');
        $('#eventModal')
            .off('submit')
            .submit((e) => {
            e.preventDefault();
            
            this.submitModal(event)
        })
    };


    closeModal() {
        $('#eventModal').fadeOut(200);
        $('#errors').text('');
        $('#calendar').removeClass('opaque');
        this.mode = MODE.VIEW;
    }

    submitModal(event) {
        if (event.isValidIn(this)){
            event.updateIn(this);
            this.closeModal();
        }
    }

    hoverOver(hour){
        $(`.time[data-hour=${hour}]`).addClass('currentTime');
    }
    hoverOut() {
        $(`.time`).removeClass('currentTime');
    }
    calculateCurrentWeek() {
        const now = new Date();
        this.weekStart = addDays(now, -getDayIndex(now));
        this.weekEnd = addDays(this.weekStart, 6)
    }

    showWeek() {
        const formatOptions = {
            month: "2-digit",
            day: "2-digit",
            year: 'numeric',
        };
        $('#weekStartDisplay').text(this.weekStart.toLocaleDateString(undefined, formatOptions));
        $('#weekEndDisplay').text(this.weekEnd.toLocaleDateString(undefined, formatOptions));

        for (let dayIndex=0; dayIndex < 7; dayIndex++){
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString(undefined, {
                month: "2-digit",
                day: "2-digit",
            });
            $(`.day[data-dayIndex=${dayIndex}] .dayDisplay`).text(display);
        }
        if(this.weekOffset == 0){
            this.showCurrentDay();
        } else {
            this.hideCurrentDay();
        }
    }

    setupControls() {
        $('#nextWeekBtn').click(() => this.changeWeek(1));
        $('#prevWeekBtn').click(() => this.changeWeek(-1));
        $('#cancelButton').click(() => this.closeModal());
        $('.color').click(this.changeColor);
        $('#trashBtn').click(() => this.trash());
        $('#addBtn').click(() => this.addNewEvent())
    }

    changeColor() {
        $('.color').removeClass('active');
        $(this).addClass('active');
    }

    changeWeek(number) {
        this.weekOffset += number;
        this.weekStart = addDays(this.weekStart, 7 * number);
        this.weekEnd = addDays(this.weekStart, 7 * number);
        this.showWeek();
        this.loadEvents();
    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        $(`.day[data-dayIndex=${dayIndex}]`).addClass('currentDay');
    }

    hideCurrentDay() {
        $('.day').removeClass('currentDay');
    }

    saveEvents() {
        localStorage.setItem('JQCalendar.events', JSON.stringify(this.events)); 
    }

    loadEvents() {
        $('.event').remove();
        if(!this.eventsLoaded) {
            this.events = JSON.parse(localStorage.getItem('JQCalendar.events'));
            if(this.events) {
                for (const date of Object.keys(this.events)) {
                    for (const id of Object.keys(this.events[date])) {
                        const event = new Event(this.events[date][id]);
                        this.events[date][id] = event;
                    }
                }
            }
            this.eventsLoaded = true;
        }
        if (this.events) {
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const date = dateString(addDays(this.weekStart, dayIndex));
                if (this.events[date]) {
                    for (const event of Object.values(this.events[date])) {
                        event.showIn(this)
                    }
                }
            }
        } else {
            this.events = {};
        }
    }

    trash() {
        if(this.mode != MODE.VIEW) return;
        if(this.readyToTrash) {
            this.readyToTrash = false;
            this.events = {};
            this.saveEvents();
            $('.event').remove();
        } else {
            this.readyToTrash = true;
            window.alert('This will delete all events, Are you sure? ' +
            'This cannot be undone. if you are sure ' +
            'Click DELETE again in the next minute');
            setTimeout(() => {
                this.readyToTrash = false;
            }, 1000*60)
        }
    }
    addNewEvent(){
        if(this.mode != MODE.VIEW) return;
        this.mode = MODE.CREATE;
        const event = new Event({
            start: '12:00',
            end: '13:00',
            date: dateString(this.weekStart),
            title: '',
            description: '',
            color: 'red'
        });
        this.openModal(event);
    }
 }