 export class Calendar {
    constructor() {

    }

    setup() {
        this.setupTimes();
        this.setupDays();
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
            const slots = $("<div></div>").addClass("slots");
        
            for (let hour = 0; hour < 24; hour++){
                $("<div></div>").attr("data-hour", hour)
                .addClass('slot')
                .appendTo(slots)
                .click(() => cal.clickSlot(hour, dayIndex))
                .hover(() => cal.hoverOver(hour), () => cal.hoverOut());
            }
            $(this).append(header).append(slots);
        })
    }
    clickSlot(hour, dayIndex) {
        console.log('click', hour, day)
    }
    hoverOver(hour){
        console.log('hovv', hour, dayIndex)
    }
    hoverOut() {
        // todo later
    }
 }