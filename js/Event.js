import {generateId} from './helper.js';

export class Event {
    constructor(data) {
        this.id = data.id || generateId();
        this.title = data.title;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.description = data.description;
        this.color = data.color;
    }

    isValidIn(calendar) {
        //todo
        console.log('test valid', this);
    }

    IpdateIn(calendar) {
        this.prevDate = this.date;
        this.title = $("#eventTitle").val();
        this.start = $("#eventStart").val();
        this.end = $("#eventEnd").val();
        this.date = $("#eventDate").val();
        this.description = $("#eventDescription").val();
        this.color = $("#eventColor").val();
        this.showIn(calendar);
    }

    showIn(calendar){
        console.log('show event', this);
    }
}