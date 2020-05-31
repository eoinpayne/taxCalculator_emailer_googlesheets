
function sendEmails() { // Get the sheet where the data is
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Mailing List")
  var startRow = 8; // First row of data to process since there is a header row 
  var numColums = sheet.getRange(1,1).getValue(); //gets count of services to iterate on. Set by a formula which counts Colums stored on spreasheet
  var numRows = sheet.getRange(2,1).getValue(); // Number of rows to process is set by a formula which counts emails (row, colum) 

  ////Services and upcoming notification Dates
  //Get the 2 rows, 1st is row of services, 2nd is row of upcoming notification dates stored on spreadsheet.
  var servicesAndDates_DataRange = sheet.getRange(7, 2, 2, numColums)      //(startRow, startColumn, numRows, numColums) (row, colum, num rows, num colum)
  var servicesAndDates_Values = servicesAndDates_DataRange.getValues();
  var services_Data = servicesAndDates_Values[0];
  var UpcomingDates_Data = servicesAndDates_Values[1];  
  
  
  let listOfServiceObjects = []; //service objects will be the notifcations etc
  var x;
  //Build an object for each service and spawn it with its next notification date, if exists. Then add it to list.
  for (x = 0; x<services_Data.length; x++){   //change from length to number of colums
    //var tempServiceData = services_Data[x]    
    //var tempServiceDate_Dates = UpcomingDates_Data[x]
    
    var workingServiceObject = new Service(services_Data[x])
    if (UpcomingDates_Data[x] !== "x"){
      workingServiceObject.addUpcomingDate(tempServiceDate_Dates)
    }
    listOfServiceObjects.push(workingServiceObject)
    }
  
  ////Recipients
  //The 1st colum from the spreadsheet is the email address, each following column represents yes/no for each service
  var Recipients_DataRange = sheet.getRange(9, 1, numRows, numColums+1)
  var Recipients_Values = Recipients_DataRange.getValues();
  //var RecipientsData = Recipients_Values[0];
  for (var RecipientsData of Recipients_Values){
    for (x = 1; x<=RecipientsData.length; x++){
      if (RecipientsData[x] === "Yes"){
        var tempServiceObject = listOfServiceObjects[x-1]
        tempServiceObject.addRecipient(RecipientsData[0])
      }
    }
  }
}


// // iterate each service and any with a date, check if today's date matches
//if so, send email to all recipients on the object
// reach out to sheet and write what last sent notification was.

function eMailer(service){
  var message = service.serviceType.slice(4);
  var subject = message;
  MailApp.sendEmail(email(0), subject, message);
}


function Service(serviceType){
  this.serviceType = serviceType;
  this.recipients = [];
  this.upcomingDate;
  
  this.addRecipient= function(recipient) {
    this.recipients.push(recipient)
  }
  this.addUpcomingDate = function(date){
    this.upcomingDate = new Date(date) //already set at 0 hours
  }
}

function isDateToday(date){
  var now = Date.now()
  var now0hours = now.setHours(0,0,0,0)
}