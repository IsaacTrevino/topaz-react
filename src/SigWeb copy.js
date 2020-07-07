 import {
  IsSigWebInstalled,
  SetDisplayXSize,
  SetDisplayYSize,
  SetTabletState,
  SetJustifyMode,
  ClearTablet,
  NumberOfTabletPoints,
  SetSigCompressionMode,
  GetSigString,
  SetImageXSize,
  SetImageYSize,
  SetImagePenWidth, //<--
  GetSigImageB64, //<--
  Reset,
  GetSigWebVersion,
  SetKeyString,
  AutoKeyAddANSIData,
  SetEncryptionMode,
  SetSigWindow,
  LCDSetWindow,
  KeyPadAddHotSpot,
  KeyPadClearHotSpotList,
  TabletModelNumber,
  SigWebEvent,
  SetLCDCaptureMode,
  LcdRefresh,
  ClearSigWindow,
  LCDSendGraphicUrl,
  LCDGetLCDSize,
  KeyPadQueryHotSpot,
  LCDWriteString,
  LCDStringWidth,
  LCDStringHeight
 } from "./SigWebTablet";
 
 
let tmr;
let eventTmr;
let resetIsSupported = false;

let lcdX, lcdY, scrn;

export function startTablet()
{
  try
  {
    scrn = 0;
    var retmod = 0;
    SetTabletState(1);
    retmod = TabletModelNumber();
    SetTabletState(0);
    if(retmod == 11 || retmod == 12 || retmod == 15)
    {
      var ctx = document.getElementById('cnv').getContext('2d');
      eventTmr = setInterval( SigWebEvent, 20 );
      if(tmr == null)
      {
        tmr = SetTabletState(1, ctx, 50);
      }
      else
      {
        SetTabletState(0, tmr);
        tmr = null;
        tmr = SetTabletState(1, ctx, 50);
      }
      SetLCDCaptureMode(2);
      document.FORM1.sigString.value = "SigString: ";
      LcdRefresh(0, 0, 0, 240, 64);
      SetJustifyMode(0);
      KeyPadClearHotSpotList();
      ClearSigWindow(1);
      SetDisplayXSize(500);
      SetDisplayYSize(100);
      SetImageXSize(500);
      SetImageYSize(100);
      SetLCDCaptureMode(2);

      LCDSendGraphicUrl(1, 2, 0, 20, "/images/Sign.bmp");
      LCDSendGraphicUrl(1, 2, 207, 4, "/images/OK.bmp");
      LCDSendGraphicUrl(1, 2, 15, 4, "/images/CLEAR.bmp");

      const lcdSize = LCDGetLCDSize();
      lcdX = lcdSize & 0xffff;
      lcdY = (lcdSize >> 16) & 0xffff;

      const data = "RGV Metro Waste LLC. Terms and Conditions. Please press Continue.";

      parse(data);

      LCDWriteString(0, 2, 180, 45, "9pt Arial", 15, "Continue");

      KeyPadAddHotSpot(0, 1, 177, 40, 40, 15);   //Continue

      ClearTablet();

      LCDSetWindow(0, 0, 1, 1);
      SetSigWindow(1, 0, 0, 1, 1);
      SetLCDCaptureMode(2);
      console.log('caputre mode');
      

    if(KeyPadQueryHotSpot(0) > 0)
    {
      console.log('button pressed');
      scrn = 1;
      processPenUp(scrn);
    }


      SetLCDCaptureMode(2);
    }
    else
    {
      alert("You do not have the appropriate signature pad plugged in.");
    }
  }
  catch (e)
  {
    alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
  }

}



function processPenUp(scrn, lcdX, lcdY)
  {
    if(KeyPadQueryHotSpot(0) > 0)
    {
      ClearSigWindow(1);
      LcdRefresh(1, 16, 45, 50, 15);

      if(scrn == 1)
      {
        ClearTablet();
        LcdRefresh(0, 0, 0, 240, 64);

        const data2 = "We'll bind the signature to all the displayed text. Please press Continue.";

        parse(data2);

        LCDWriteString(0, 2, 15, 45, "9pt Arial", 15, "Continue");
        LCDWriteString(0, 2, 200, 45, "9pt Arial", 15, "Back");

        KeyPadAddHotSpot(1, 1, 195, 40, 20, 15);  //Back

        scrn = 2;
      }
      else if(scrn == 2)
      {
        LcdRefresh(2, 0, 0, 240, 64);
        ClearTablet();
        KeyPadClearHotSpotList();
        KeyPadAddHotSpot(2, 1, 10, 5, 53, 17);   //CLEAR
        KeyPadAddHotSpot(3, 1, 197, 5, 19, 17);  //OK
        LCDSetWindow(2, 22, 236, 40);
        SetSigWindow(1, 0, 22, 240, 40);
      }

      SetLCDCaptureMode(2);
    }

  if(KeyPadQueryHotSpot(1) > 0)
    {
      ClearSigWindow(1);
      LcdRefresh(1, 200, 45, 25, 15);

      if(scrn == 2)
      {
        KeyPadClearHotSpotList();
        LcdRefresh(1, 200, 45, 25, 15);
        ClearTablet();
        LcdRefresh(0, 0, 0, 240, 64);

        const data = "These are sample terms and conditions. Please press Continue.";

        parse(data);

        LCDWriteString(0, 2, 15, 45, "9pt Arial", 15, "Continue");

        KeyPadAddHotSpot(0, 1, 12, 40, 40, 15);   //Continue

        scrn = 1;
      }

      SetLCDCaptureMode(2);
    }

   if(KeyPadQueryHotSpot(2) > 0)
   {
     ClearSigWindow(1);
     LcdRefresh(1, 10, 0, 53, 17);

     LcdRefresh(2, 0, 0, 240, 64);
     ClearTablet();
   }

   if(KeyPadQueryHotSpot(3) > 0)
   {
     ClearSigWindow(1);
     LcdRefresh(1, 210, 3, 14, 14);

     if(NumberOfTabletPoints() > 0)
     {
       LcdRefresh(0, 0, 0, 240, 64);
       LCDWriteString(0, 2, 35, 25, "9pt Arial", 15, "Signature capture complete.");
       var CryptoData = "";
       CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
       CryptoData = CryptoData + "Concatenate all this data into a single variable.";
       AutoKeyAddANSIData(CryptoData); //PASS THE DATA IN TO BE USED FOR AUTOKEY
       SetEncryptionMode(2);
       SetSigCompressionMode(1);

       document.FORM1.sigString.value += GetSigString();
       clearInterval(eventTmr);
       setTimeout(endDemo, 2000);
     }
     else
     {
       LcdRefresh(0, 0, 0, 240, 64);
       LCDSendGraphicUrl(0, 2, 4, 20, "http://www.sigplusweb.com/SigWeb/please.bmp");
       ClearTablet();
       LcdRefresh(2, 0, 0, 240, 64);
       SetLCDCaptureMode(2);
     }
   }

   ClearSigWindow(1);
 }

 //function processPenUp()
 //{
 //ClearSigWindow(1);
 //}

function parse(textData)
{
  var words = textData.split(" ");
  var writeData = "";
  var tempData = "";
  var xSize = 0;
  var ySize = 0;
  var i = 0;
  var yPos = 0;

  for(i=0; i < words.length; i++)
  {
    tempData += words[i];

    xSize = LCDStringWidth("9pt Arial", tempData);

    if (xSize < lcdX)
    {
      writeData = tempData;
      tempData += " ";

      xSize = LCDStringWidth("9pt Arial", tempData);

      if (xSize < lcdX)
      {
        writeData = tempData;
      }
    }
    else
    {
      ySize = LCDStringHeight("9pt Arial", tempData);

      LCDWriteString(0, 2, 0, yPos, "9pt Arial", 15, writeData);

      tempData = "";
      writeData = "";
      yPos += ySize;
      i--;
    }
  }

  if(writeData != "")
  {
    LCDWriteString(0, 2, 0, yPos, "9pt Arial", 15, writeData);
  }
}

function endDemo()
{
  LcdRefresh(0, 0, 0, 240, 64);
  LCDSetWindow(0, 0, 240, 64);
  SetSigWindow(1, 0, 0, 240, 64);
  KeyPadClearHotSpotList();
  SetLCDCaptureMode(1);
  SetTabletState(0, tmr);
  ClearTablet();
}
function close(){
  if(resetIsSupported){
    Reset();
  } else{
    endDemo();
  }
}

export const listener = () => {  
  window.onload = () => {
    console.log('load')
    if(IsSigWebInstalled()){
      resetIsSupported = GetResetSupported();
      console.log('sigWebInstalled')
      if(!resetIsSupported){
        var sigweb_link = document.createElement("a");
        sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
        sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

        var note = document.getElementById("sigWebVrsnNote");
        note.innerHTML = "There is a newer version of SigWeb available here: ";
        note.appendChild(sigweb_link);
      }
    }
    else{
      alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
    }
  }

  window.onbeforeunload = evt => {
    close();
    clearInterval(tmr);
    evt.preventDefault(); //For Firefox, needed for browser closure
  };

  

}

function GetResetSupported(){
  var minSigWebVersionResetSupport = "1.6.4.0";

  if(isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)){
    console.log("Old SigWeb version installed.");
    return false;
  }
  return true;
}

function isOlderSigWebVersionInstalled(cmprVer){
  var sigWebVer = GetSigWebVersion();
  if(sigWebVer != ""){
    return isOlderVersion(cmprVer, sigWebVer);
  } else{
    return false;
  }
}

function isOlderVersion (oldVer, newVer) {
  const oldParts = oldVer.split('.')
  const newParts = newVer.split('.')
  for (var i = 0; i < newParts.length; i++) {
    const a = parseInt(newParts[i]) || 0
    const b = parseInt(oldParts[i]) || 0
    if (a < b) return true
    if (a > b) return false
  }
  return false;
}
