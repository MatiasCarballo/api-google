import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/Utils/auth.guard";
import { CalendarService } from "./calendarEvent.service";
import { CreateEventDTO, UpdateEventDTO } from "./calendarEvent.dto";


@ApiTags('Calendar')
@UseGuards(AuthGuard)
@Controller('calendar')
export class CalendarController{
  constructor(
    private calendarService: CalendarService
  ){}
  

  @Get('/')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: ''})
  async getCalendar(@Req() req: any){
    const result = await this.calendarService.getCalendar(req.dataJwt);
    return { statusCode: HttpStatus.OK, result };
  }

  @Get('/events')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: ''})
  async getAllEvent(@Req() req: any){
    const result = await this.calendarService.geAlltEvent(req.dataJwt);
    return { statusCode: HttpStatus.OK, result };
  }

  @Get('/event')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: ''})
  async getEvent(@Req() req: any, @Param() eventId:string){
    const result = await this.calendarService.getEvent(req.dataJwt, eventId);
    return { statusCode: HttpStatus.OK, result };
  }

  @Post('/event')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: ''})
  async createEvent(@Req() req: any, @Body() data: CreateEventDTO){
    const result = await this.calendarService.createEvent(req.dataJwt, data);
    return { statusCode: HttpStatus.OK, result };
  }

  @Put('/event')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: ''})
  async updateEvent(@Req() req: any, @Body() data: UpdateEventDTO){
    const result = await this.calendarService.updateEvent(req.dataJwt, data);
    return { statusCode: HttpStatus.OK, result };
  }

  @Delete('/event')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: ''})
  async deleteEvent(@Req() req: any, @Param() eventId:string){
    const result = await this.calendarService.deleteEvent(req.dataJwt, eventId);
    return { statusCode: HttpStatus.OK, result };
  }
}