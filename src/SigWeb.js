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
  Reset,
  GetSigWebVersion,
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
  LCDStringHeight,
  SetImagePenWidth, //<--
  GetSigImageB64, //<--
  SetKeyString,//<--
 } from "./SigWebTablet";


var tmr;
var eventTmr;

var resetIsSupported = false;
let lcdSize, lcdX, lcdY, scrn;


export function startTablet()
{
  try
  {
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

      lcdSize = LCDGetLCDSize();
      lcdX = lcdSize & 0xffff;
      lcdY = (lcdSize >> 16) & 0xffff;

      const data = "These are sample terms and conditions. Please press Continue.";

      parse(data);

      LCDWriteString(0, 2, 15, 45, "9pt Arial", 15, "Continue");

      KeyPadAddHotSpot(0, 1, 12, 40, 40, 15);   //Continue

      ClearTablet();

      LCDSetWindow(0, 0, 1, 1);
      SetSigWindow(1, 0, 0, 1, 1);
      SetLCDCaptureMode(2);

      scrn = 1;

      processPenUp();

      //onSigPenUp = function ()
      //{
      //processPenUp();
      //};

      SetLCDCaptureMode(2);
    }
    else
    {
      alert("You do not have the appropriate signature pad plugged in to use this demo.");
    }
  }
  catch (e)
  {
    alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
  }

}



function processPenUp()
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

      //NOW, EXTRACT THE SIGNATURE IN THE TOPAZ BIOMETRIC FORMAT -- SIGSTRING
      //OR AS A BASE64-ENCODED PNG IMAGE
      //OR BOTH

      //********************USE THIS SECTION IF YOU WISH TO APPLY AUTOKEY TO YOUR TOPAZ SIGNATURE
      //READ ABOUT AUTOKEY AND THE TOPAZ SIGNATURE FORMAT HERE: http://topazsystems.com/links/robustsignatures.pdf
      //AUTOKEY IS CRITICAL TO SAVING AN eSIGN-COMPLIANT SIGNATURE
      //AUTOKEY ONLY APPLIES TO THE TOPAZ-FORMAT SIGSTRING AND DOES NOT APPLY TO AN IMAGE OF THE SIGNATURE
      //AUTOKEY ALLOWS THE DEVELOPER TO CRYPTOGRAPHICALLY BIND THE TOPAZ SIGNATURE TO A SET OF DATA
      //THE PURPOSE OF THIS IS TO SHOW THAT THE SIGNATURE IS BEING APPLIED TO THE DATA YOU PASS IN USING AutoKeyAddData()
      //IN GENERAL TOPAZ RECOMMENDS REPLICATING A TRADITIONAL 'PAPER AND PEN' APPROACH
      //IN OTHER WORDS, IF YOU WERE TO PRINT OUT ON PAPER THE TERMS/INFORMATION THE SIGNER IS SUPPOSED TO READ AND AGREE WITH
      //THE DATA ON THIS PAPER IS WHAT SHOULD IN WHOLE BE PASSED INTO AUTOKEYADDANSIDATA() DIGITALLY
      //THE TOPAZ SIGSTRING IS THEN BOUND TO THIS DATA, AND CAN ONLY BE SUCCESSFULLY DECRYPTED LATER USING THIS DATA
      //AUTOKEYADDDATA IS DEPRECATED AND REPLACED BY AUTOKEYADDANSIDATA
      var CryptoData = "";
      CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
      CryptoData = CryptoData + "Concatenate all this data into a single variable.";
      AutoKeyAddANSIData(CryptoData); //PASS THE DATA IN TO BE USED FOR AUTOKEY
      SetEncryptionMode(2);
      //*******END AUTOKEY SECTION

      //NOTE THAT THE AUTOKEY SECTION ABOVE IS NOT REQUIRED TO RETURN A TOPAZ SIGSTRING
      //BUT IT IS STRONGLY RECOMMENDED IF YOU REQUIRE eSIGN COMPLIANCE
      //RETURN THE TOPAZ-FORMAT SIGSTRING
      SetSigCompressionMode(1);
      //alert("KEYSTRING:" + GetKeyString());

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

//function processPenUp()
//{
//ClearSigWindow(1);
//}

export const listener = () => {

  console.log('listen')
  window.onload = () => {

    if(IsSigWebInstalled()){
      console.log('installed')
      resetIsSupported = GetResetSupported();
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



  if(navigator.userAgent.search("Firefox") >= 0){
    //Perform the following actions on
    //	1. Browser Closure
    //	2. Tab Closure
    //	3. Tab Refresh
    window.addEventListener("beforeunload", evt => {
      close();
      clearInterval(tmr);
      clearInterval(eventTmr);
      evt.preventDefault(); //For Firefox, needed for browser closure
    });
  }
  else {
    //Perform the following actions on
    //	1. Browser Closure
    //	2. Tab Closure
    //	3. Tab Refresh
    window.onbeforeunload = evt => {
      close();
      clearInterval(tmr);
      clearInterval(eventTmr);
      evt.preventDefault(); //For Firefox, needed for browser closure
    };

    window.addEventListener("beforeunload", evt => {
      close();
      clearInterval(tmr);
      clearInterval(eventTmr);
      evt.preventDefault(); //For Firefox, needed for browser closure
    });

    window.addEventListener("unload", evt => {
      close();
      clearInterval(tmr);
      clearInterval(eventTmr);
      evt.preventDefault(); //For Firefox, needed for browser closure
    });

    //Perform the following actions on
    //	1. Browser Closure
    //	2. Tab Closure
    //	3. Tab Refresh
    window.addEventListener("beforeunload", close());

    window.addEventListener("unload", close());
  }
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