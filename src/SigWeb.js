


var tmr;
var eventTmr;

var resetIsSupported = false;
let lcdSize, lcdX, lcdY, scrn;
let ctx, x = 500, y = 100;

export function onSign(setStartDisable)
{
  if(IsSigWebInstalled()){
    ctx = document.getElementById('cnv').getContext('2d');
    document.FORM1.sigStringData.value = "SigString: ";
    document.FORM1.sigImageData.value = 'Base64 String: ';
    SetDisplayXSize( x );
    SetDisplayYSize( y );
    SetTabletState(0, tmr);
    SetJustifyMode(0);

    SetKeyString("0000000000000000");
    SetEncryptionMode(0);
    tmr = SetTabletState(1, ctx, 50) || tmr;
    eventTmr = setInterval( SigWebEvent, 20 );

    SetImageXSize(x);
    SetImageYSize(y);
    
    
    ClearSigWindow(1);
    SetLCDCaptureMode(2);
    LCDSendGraphicUrl(1, 2, 0, 20, "http://www.sigplusweb.com/SigWeb/Sign.bmp"); //240x45
    LCDSendGraphicUrl(1, 2, 207, 4, "http://www.sigplusweb.com/SigWeb/OK.bmp");
    LCDSendGraphicUrl(1, 2, 15, 4, "http://www.sigplusweb.com/SigWeb/CLEAR.bmp");
    LcdRefresh(2, 0, 0, 240, 64);
    ClearTablet();
    KeyPadClearHotSpotList();
    KeyPadAddHotSpot(2, 1, 10, 5, 53, 17);   //CLEAR
    KeyPadAddHotSpot(3, 1, 197, 5, 19, 17);  //OK
    LCDSetWindow(2, 22, 236, 40);
    SetSigWindow(1, 0, 22, 240, 40);

    SetLCDCaptureMode(2);
    //while(1) {
      if(KeyPadQueryHotSpot(2) > 0) {
        onClear();
      } else if (KeyPadQueryHotSpot(3) > 0) {
        onDone(setStartDisable)
        //break;
      }
    //}
    //SetLCDCaptureMode(1);


  } else{
    alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
  }
}

function processPenUp()
{
  while(1){
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
      }
      else
      {
        LcdRefresh(0, 0, 0, 240, 64);
        LCDWriteString(0, 2, 4, 20, "9pt Arial", 15, "Please");
        //LCDSendGraphicUrl(0, 2, 4, 20, "http://www.sigplusweb.com/SigWeb/please.bmp");
        ClearTablet();
        LcdRefresh(2, 0, 0, 240, 64);
        SetLCDCaptureMode(2);
        break;
      }
    }
  }
  ClearSigWindow(1);
}

export function onClear()
{
  ClearTablet();      
  ClearSigWindow(1);
  LcdRefresh(2, 0, 0, 240, 64);
  ClearTablet();
  
  document.FORM1.sigStringData.value = "SigString: ";
  document.FORM1.sigImageData.value = 'Base64 String: ';
  ctx.clearRect(0,0, x, y);
}

export function onDone(setStartDisable)
{
  if(NumberOfTabletPoints() == 0)
  {
    alert("Please capture signature before continuing");
  }
  else
  {
    LcdRefresh(0, 0, 0, 240, 64);
    LCDWriteString(0, 2, 35, 25, "9pt Arial", 15, "Signature capture complete.");
    SetTabletState(0, tmr); //deactivate connection

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
    CryptoData += "Concatenate all this data into a single variable.";
    AutoKeyAddANSIData(CryptoData); //PASS THE DATA IN TO BE USED FOR AUTOKEY
    SetEncryptionMode(2);
    //*******END AUTOKEY SECTION

    //NOTE THAT THE AUTOKEY SECTION ABOVE IS NOT REQUIRED TO RETURN A TOPAZ SIGSTRING
    //BUT IT IS STRONGLY RECOMMENDED IF YOU REQUIRE eSIGN COMPLIANCE
    //RETURN THE TOPAZ-FORMAT SIGSTRING
    SetSigCompressionMode(1);
    //alert("KEYSTRING:" + GetKeyString());
    //document.FORM1.bioSigData.value=GetSigString();
    document.FORM1.sigStringData.value = GetSigString();
    //THIS RETURNS THE SIGNATURE IN TOPAZ'S OWN FORMAT WITH BIOMETRIC INFORMATION

    //TO RETURN THIS SIGSTRING LATER TO A NEW WEB PAGE USING SIGWEB, REPEAT THE CODE FROM THIS FUNCTION ABOVE STARTING AFTER SetTabletState(0, tmr)
    //BUT AT THE END USE SetSigString() INSTEAD OF GetSigString()
    //NOTE THAT SetSigString() TAKES 2 ARGUMENTS
    //SetSigString(str SigString, context canvas)

    //TO RETURN A BASE64-ENCODED PNG IMAGE OF THE SIGNATURE
    SetImageXSize(500);
    SetImageYSize(100);
    SetImagePenWidth(5);
    GetSigImageB64(SigImageCallback); //PASS IN THE FUNCTION NAME SIGWEB WILL USE TO RETURN THE FINAL IMAGE
    setStartDisable(false);
  }
}


function SigImageCallback( str )
{
  document.FORM1.sigImageData.value = str; //OBTAIN FINAL IMAGE HERE
}

function SigClearImageCallback( str )
{
  document.FORM1.sigImageData.value = ''; //OBTAIN FINAL IMAGE HERE
}

function endDemo()
{
  ClearTablet();
  SetTabletState(0, tmr);
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
  };

  window.onbeforeunload = function(evt){
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