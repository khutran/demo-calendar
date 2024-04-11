import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { CreateEventCalendarDto } from './google-calendar.dto';

@Injectable()
export class GoogleCalendarService {
  private readonly calendar;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env['GOOGLE_CREDENTIALS_PATH'],
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createEvent(eventData: CreateEventCalendarDto) {
    try {
      const res = await this.calendar.events.insert({
        calendarId: process.env['CALENDAR_ID'],
        resource: eventData
      });
      console.log('Event created:', res.data.htmlLink);
      return res.data;
    } catch (error) {
      console.error('Error adding event:', error.message);
      throw error;
    }
  }
  async updateEvent(eventData: CreateEventCalendarDto) {
    try {
      console.log(eventData);
      const res = await this.calendar.events.update({
        calendarId: process.env['CALENDAR_ID'],
        eventId: eventData.eventId,
        resource: eventData
      });
      console.log('Event created:', res.data.htmlLink);
      return res.data;
    } catch (error) {
      console.error('Error update event:', error.message);
      throw error;
    }
  }
  async cancelEvent(eventData: CreateEventCalendarDto) {
    try {
      await this.calendar.events.delete({
        calendarId: process.env['CALENDAR_ID'],
        eventId: eventData.eventId,
      });
      console.log('Event deleted:', eventData.eventId);
      return;
    } catch (error) {
      console.error('Error cancel event:', error.message);
      throw error;
    }
  }
}
