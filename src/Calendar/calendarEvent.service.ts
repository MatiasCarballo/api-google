import { calendar } from "@googleapis/calendar";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { GoogleCalendar } from "src/Utils/Services/googleCalendar.service";
import { Calendar } from "./calendar.schema";
import { Event } from "./event.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/User/user.service";

@Injectable()
export class CalendarService{
  private googleCalendar: GoogleCalendar;
  private userService: UserService;

  constructor(
    private readonly moduleRef: ModuleRef,
    @InjectModel(Calendar.name) private CalendarModel: Model<Calendar>,
    @InjectModel(Event.name) private EventModel: Model<Event>,
  ){}

  onModuleInit(){
    this.googleCalendar = this.moduleRef.get(GoogleCalendar, {
      strict: false,
    });
    this.userService = this.moduleRef.get(UserService, {
      strict: false,
    });
  }

  async createCalendar(user){//esto solo se usa cuando se crea el user
    const calendar = await this.googleCalendar.createCalendar(user, {name: 'root'});//cambiar despues
    const calendarM = await this.CalendarModel.create({name:'root', calendarIdG:calendar})
    return calendarM._id.toString();
  }

  async createEvent(user, data){
    const userI = await this.userService.userInfo(data, true);
    const calendarId = await this.getCalendar(userI.calendarIdM)
    const event = await this.googleCalendar.createEvent(userI, data);
    const createEvent = {
      calendarId: event.data.organizer?.email,
      eventId: event.data.id,
      start: event.data.start?.dateTime,
      end: event.data.end?.dateTime,
      meetUrl: event.data.hangoutLink,
      location: event.data.location,
      attendees: event.data.attendees?.map((a) => {
        // delete a.eventStatus;
        return a;
      }),
    };
    const eventM = await this.EventModel.create(createEvent);
    await this.CalendarModel.findOneAndUpdate({calendarIdG:user.calendarIdG},{$addToSet:{avents:eventM}});
    return 'ok'
  }

  async getCalendar(user){//get calendar
    const userI = await this.userService.userInfo(user, true);
    const calendar = await this.CalendarModel.findOne({calendarIdM: userI.calendarIdM});
    return calendar;
  }

  async geAlltEvent(user){//get all event
    const userI = await this.userService.userInfo(user, true);
    const calendar = await this.CalendarModel.findOne({calendarIdM: userI.calendarIdM}).populate('avents');
    return calendar;
  }

  async getEvent(user, eventId){
    const event = await this.EventModel.findOne({eventId});
    return event;
  }

  async updateEvent(user, data){
    const userI = await this.userService.userInfo(user, true);
    const event = await this.googleCalendar.updateEvent(userI, data);
    const eventM = await this.EventModel.findOneAndUpdate({eventId:data.eventId},data);
  }//corregir luego y decidir si usar "data" o "event"

  async deleteEvent(user, eventId){
    const userI = await this.userService.userInfo(user, true);
    const event = await this.googleCalendar.deleteEvent(userI,eventId);
    return 'ok';
  }
}