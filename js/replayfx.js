function getTodaysSchedule()
{
var itemHidden = $(".itemHidden");
itemHidden.each(function()
{
  $(this).removeClass("itemHidden");
  $(this).addClass("item");

});
var baseurl = "http://replayfxcalendar.azurewebsites.net/";
  //clear html of all elements
  $(".happening").html("<h3>Now Happening</h3>");
  $(".featured").html("<h3>Featured Events</h3>");
  $(".announcement").html("<h3>Announcements</h3>");

  var compareDte = new Date();
  var startDte = new Date(2017,6,27);
  var endDte = new Date(2017,6,30);
  var dte = new Date();
  if(startDte<=compareDte&&compareDte<=endDte)
  {
    dte = dte.getMonth()+"-"+dte.getDate()+"-"+dte.getFullYear();
  }
  else {
    dte = "7-27-17";
  }


  var numUpcomingEvents = 0;
  var announcementExists = false;
  $.ajax({
    url: baseurl+"daily/"+dte,
    context: document.body,
  }).done(function(data) {
    var html = "";
    var counter = 0;
    var upcoming = $("<div></div>");
    upcoming.appendTo("body");
    $(data).each(function(){
      //this will create
        var evnt = $("<div></div>");
        var title = $("<h2></h2>");
        var times = $("<div></div>");
        var startTime = $("<span></span>");
        var description = $("<div></div>");
        var eventType = this["replayEventTypes"];
        var image = this["image"];
        var location = $("<div></div>");

        //Pull Data from each object
        title.html(this["title"]);
        /*var tempDate = this["date"];
        tempDate = tempDate.substring(5,7)+"/"+tempDate.substring(8,10)+"/"+tempDate.substring(0,4);

        date.html(tempDate);*/
        var tempStartTime = this["startTime"];
        if(tempStartTime!==null&&tempStartTime.substring(0,2)>12)
        {
          var hour = tempStartTime.substring(0,2);
          hour= hour-12;
          tempStartTime = hour+":"+tempStartTime.substring(3,5)+" pm ";
        }
        else if(tempStartTime!==null){
            if(tempStartTime.substring(0,2)=="00")
            {
              tempStartTime = "12:00 am ";
            }
            else {
              tempStartTime = tempStartTime+" am ";
            }

          }
      else {
        tempStartTime = "";
      }

      var tempEndTime = this["endTime"];
      if(tempEndTime!==null&&tempEndTime.substring(0,2)>12)
      {
        var hour = tempEndTime.substring(0,2);
        hour= hour-12;
        tempEndTime = hour+":"+tempEndTime.substring(3,5)+" pm ";

      }
      else if(tempEndTime!==null) {
        if(tempEndTime.substring(0,2)=="00")
      {
          tempEndTime = "12:00 am ";
      }
      else {
        tempEndTime = tempEndTime+" am ";
      }

    }
    else {
      tempEndTime = "";
    }


    startTime.html(tempStartTime+" - " +tempEndTime);
    description.html(this["description"]);
    //append and format times
    startTime.appendTo(times);



    location.html("Locations: " +this["location"]);
    if(image==null)
    {
    title.appendTo(evnt);
  //  date.appendTo(evnt);
    times.appendTo(evnt);
    description.appendTo(evnt);
    location.appendTo(evnt);
    evnt.addClass("event")
    //evnt.html(counter+" "+JSON.stringify(this));
  }
  else {
    var tempImageThirdCol = $("<div></div>");
    tempImageThirdCol.addClass("col-md-4");
    var img = $("<img></img>");
    img.attr("src",image);
    img.attr("width","100%");
    img.attr("height", "auto");
    img.appendTo(tempImageThirdCol);
    var tempTwoThirdCol = $("<div></div>");
    tempTwoThirdCol.addClass("col-md-8");
    var tempEvnt = $("<div></div>");
    title.appendTo(tempEvnt);
  //  date.appendTo(evnt);
    times.appendTo(tempEvnt);
    description.appendTo(tempEvnt);
    location.appendTo(tempEvnt);

    tempEvnt.appendTo(tempTwoThirdCol);
    tempImageThirdCol.appendTo(evnt);
    tempTwoThirdCol.appendTo(evnt);
    evnt.addClass("event");

  }
    counter++;
    var tem = $("<div></div>");
    tem.addClass("smallEvent");


    var curDay = new Date();
    var hasStarted = true;
    if(!(this["startTime"].substring(0,2)<curDay.getHours()))
      {
        if((this["startTime"].substring(0,2)>curDay.getHours())||(this["startTime"].substring(0,2)==curDay.getHours()&&this["startTime"].substring(3,5)>curDay.getMinutes()))
        {
          title.clone().appendTo(tem);
          startTime.clone().appendTo(tem);
          location.clone().appendTo(tem);
          $("<br />").appendTo(tem);
          tem.appendTo(".list");
          numUpcomingEvents++;
          hasStarted = false;
        }
    }
    //This block of code will add the events to the Now Happening if they are currently happening.
    if(hasStarted)
    {
      if((this["endTime"]==null||(this["endTime"].substring(0,2)>curDay.getHours())||(this["endTime"].substring(0,2)==curDay.getHours()&&this["endTime"].substring(3,5)>curDay.getMinutes())))
      {
        addEventToSliderElement(evnt,"happening");
      }
    }

    var featured = isOfType(eventType, "featured");
    if(featured)
    {
      addEventToSliderElement(evnt,"featured");
    }

    var announcement = isOfType(eventType,"announcement");
    if(announcement)
    {
      addEventToSliderElement(evnt,"announcement");
    }
    if(image!=null)
    {
      addEventToSliderElement(evnt,"announcement");
    }
  });
  var items = $(".mainSection");

  $(items).each(function(){

    if($(this).find(".event").length==0)
    {
      $(this).removeClass("item");
      $(this).addClass("itemHidden");
    }
  });
});

}

function isOfType (event, type)
{
  var temp = false;
  $(event).each(function(){
    if(this["name"]==type)
    {
      temp = true;
    }
  });
  return temp;
}

function addEventToSliderElement(event, element)
{
  var counting = 0;
  var evntClone = event.clone();
  element = "."+element;
  $(element).each(function(){
  if($(this).find(".event").length>=2)
  {

    if(counting==$(element).length-1)
    {
          var tempEvent = $(this).clone().html("");
          var tempItemDiv = $("<div></div>");
          tempItemDiv.addClass("item");

          evntClone.appendTo(tempEvent);
          tempEvent.appendTo(tempItemDiv);
          tempItemDiv.insertAfter($(this).parents(".item"));
    }
    else {
     evntClone.appendTo(this);
    }
  }
  else
  {
    evntClone.appendTo(this);
  }
  counting++;
});
}
function addEventToSmallSchedule(event)
{

}

function init() {
  $("#close_me").on("click", () => {window.close();});
}

$(init);

// $(function () {
// $('.marquee').marquee({
// pauseOnHover: true,
// duration: 15000,
// allowCss3Support: false
// });
// });

$(function () {
  $('.marquee').marquee({
    duration: '10000',
    gap: '200',
    direction: 'up',
    duplicated: true
  });
})

// function changeBackground() {
//   setInterval(function() { $(".cf3 img.top").css("display", "none")})
// }

// $(document).ready(function(){
//   setInterval(function(){
//     $("body").css({'background':'url("../bg_images/Mario.png")'},3000)
//     $("body").css({'background':'url("../bg_images/press_start.jpg")'},3000)
//   },3000);
//         });

$(document).ready(function(){
  $('.backgroundImage').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplayspeed: 500,
    fade: true,
    arrows: false,
    // cssEase: 'linear'
  });
});
