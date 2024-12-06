import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { calendar } from '@googleapis/calendar';
import { EncriptionService } from "../encryption.service";
import { GoogleAuth } from "./googleAuth.service";
 

@Injectable()
export class GoogleCalendar{
  private encriptionService: EncriptionService;
  private googleAuth: GoogleAuth;

  constructor(
    private readonly moduleRef: ModuleRef,
  ){}

  onModuleInit(){
    this.encriptionService = this.moduleRef.get(EncriptionService, {
      strict: false,
    }); 
    this.googleAuth = this.moduleRef.get(GoogleAuth, {
      strict: false,
    });
  }

  async getclient(user){
    const tokenDesencrypt = JSON.parse(this.encriptionService.decryptToken(user.token));
    const RTokenDesencrypt = JSON.parse(this.encriptionService.decryptToken(user.RToken));
    tokenDesencrypt.refresh_token = RTokenDesencrypt

    const oauthClient = await this.googleAuth.oauthClient();
    oauthClient.setCredentials(tokenDesencrypt);
    return calendar({version: 'v3', auth: oauthClient});
  }

  async createCalendar(user, data){//calendario carpeta, de eventos
    const client = await this.getclient(user);
    const resp = await client.calendars.insert({
      requestBody: {
        summary: data.name,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
    });
    return resp.data.id;
  }

  async createEvent(user, data){//data: CreateEventDTO
    const client = await this.getclient(user);
    const passRandom = await this.generateRandomPassword();
    //refrescar token
    return await client.events.insert({
      calendarId: `${user.calendarId}`,
      //auth: oauth2Client,//ver si funciona sin esto
      sendUpdates: 'all',
      requestBody: {
        summary: `${data.title ? data.title : ''}`, //----
        description: `${data.description ? data.description : ''}`,
        start: {
          dateTime: `${data.start}`,
          //timeZone: 'America/Argentina/Buenos_Aires',
        },
        end: {
          dateTime: `${data.end}`,
          //timeZone: 'America/Argentina/Buenos_Aires',
        },
        ...(data.location && {
          location: `${data.location}`,
        }),
        ...(data.meet && {
          conferenceData: {
            createRequest: {
              requestId: `${passRandom}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        }),
        attendees: data.attendees.map((email) => ({ email })),
      },
      conferenceDataVersion: 1,
    });
  }

  async getAllEvent(user, idCalendar: string) {
    // this.refreshTokenCalendar();
    const client = await this.getclient(user);
    const resp = await client.events.list({
      calendarId: `${idCalendar}`,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    return resp;
  }

  async getEventId(user,calendarId: string, eventId: string) {
    // this.refreshTokenCalendar();
    const client = await this.getclient(user);
    const resp = await client.events.get({
      //auth: oauth2Client,
      calendarId: `${calendarId}`,
      eventId: `${eventId}`,
    });
    return resp.data;
  }


  async updateEvent(user, data) {//UpdateEventDTO
    // await this.refreshTokenCalendar();
    const client =  await this.getclient(user);
    const e = await this.getEventId(user, user.calendarId, data.eventId);
    const attendees = [];
    data.attendees.map((a) => {//cambiar esto, verificar que no existan email en el evento 
      attendees.push({ email: a });
    });
    if (e.start && e.end) {
      //me exije que verifique que no sea undefine
      (e.summary = `${data.title}`),
        (e.description = `${data.description}`),
        (e.start.dateTime = `${data.start}`),
        (e.end.dateTime = `${data.end}`),
        (e.location = `${data.location}`),
        (e.attendees = attendees);
    } else {
      const error = new Error('Event not found');
      throw error;
    }

    const response = await client.events.update({
      //auth: oauth2Client,
      calendarId: `${data.calendarId}`,
      eventId: `${data.eventId}`,
      requestBody: e,
    });
    return response;
  }

  async deleteEvent(user, eventId: string) {
    // await this.refreshTokenCalendar();
    const client =  await this.getclient(user);
    await client.events.delete({
      calendarId: `${user.calendarId}`,
      eventId: `${eventId}`,
    });
  }


  async generateRandomPassword() {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 20; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}