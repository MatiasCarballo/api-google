import { Controller, Get, HttpCode, HttpStatus, Param, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';
import { UserService } from "./user.service";
import { AuthGuard } from "src/Utils/auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags('UserAuth')
@Controller('user')
export class UserController{
  constructor(
    private userService: UserService
  ) {
  }

  @Get('/redirect')
  @Redirect('https://66297m8j-3000.brs.devtunnels.ms', 302)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'User Info'})
  async gg(@Res() res: Response){    
    return {url:'https://66297m8j-3000.brs.devtunnels.ms'}
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'User Info'})
  async me(@Req() req: any){
    const result = await this.userService.userInfo(req.dataJwt);
    return { statusCode: HttpStatus.OK, result };
  }

  @Get('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Login'})
  async login(){
    const result = await this.userService.login()
    return { statusCode: HttpStatus.OK, result };
  }

  @Get('/callback')
  @HttpCode(HttpStatus.OK)
  // @Redirect('https://66297m8j-3000.brs.devtunnels.ms', 302)
  async auth(@Req() req: Request, @Res() res: Response){
    const result = await this.userService.callback(req.query.code);
    res.cookie('access_token', result, { httpOnly: true })
    res.redirect('https://66297m8j-3000.brs.devtunnels.ms');
    // return {url:};
  }

  @Get('/addAcount/:email')
  @HttpCode(HttpStatus.OK)
  async addAcount(@Req() req: Request, @Param() email: string){
    //de las cookies tomo el user
    //tienen que enviar el gmail que se va adjuntar

  }
}