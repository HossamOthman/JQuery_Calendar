import { getDayIndex, addDays } from "./helper.js";

 export class Calendar {
    constructor() {
        this.weekStart = null;
        this.weekEnd = null;
        this.weekOffset = 0;
    }

    setup() {
        this.setupTimes();
        this.setupDays();
        this.calculateCurrentWeek();
        this.showWeek();
        this.setupControls();
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
        console.log('click', hour, dayIndex)
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
    }

    changeWeek(number) {
        this.weekOffset += number;
        this.weekStart = addDays(this.weekStart, 7 * number);
        this.weekEnd = addDays(this.weekStart, 7 * number);
        this.showWeek();
    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        $(`.day[data-dayIndex=${dayIndex}]`).addClass('currentDay');
    }

    hideCurrentDay() {
        $('.day').removeClass('currentDay');
    }
 }