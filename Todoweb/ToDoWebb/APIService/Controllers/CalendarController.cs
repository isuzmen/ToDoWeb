﻿using BusinessLogic.Abstract;
using BusinessLogic.Concrete;
using DataAccess.Abstract;
using Google.Apis.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CalendarController : ControllerBase
{
    //günlere not eklencek
    //notlar sadece içerik şeklinde olacak(content), bunun için calender not model yapılması lazım

}
