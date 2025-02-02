//PlaceMultipagePDFAllDocuments.jsx
//An InDesign JavaScript
/*  
@@@BUILDINFO@@@ "PlaceMultipagePDFAllDocuments.jsx" 1.0.0 02 Febrero 2025
*/
//.
//

main();
function main(){
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
	var myPDFFile = File.openDialog("Choose a PDF File");
	if((myPDFFile != "")&&(myPDFFile != null)){
		var myDocument, myPage;
		if(app.documents.length != 0){
			var myTemp = myChooseDocument();
			myDocument = myTemp[0];
			myNewDocument = myTemp[1];
			allOpened = myTemp[2];
		}
		else{
			myDocument = app.documents.add();
			myNewDocument = false;
			allOpened = false;
		}
	
		var startPage = myChooseStartPage();
		
		if(allOpened){
			for(var i = 0; i < app.documents.length; i++){
				myDocument = app.documents.item(i);
				if(myDocument.pages.length >= startPage){
					myPage = myDocument.pages.item(startPage - 1);
					myPlacePDF(myDocument, myPage, myPDFFile);
				}
				else{
					alert("El documento " + myDocument.name + " no tiene suficientes páginas. Se requiere al menos " + startPage + " páginas.");
				}
			}
		}
		else{
			if(myNewDocument == false){
				if(myDocument.pages.length >= startPage){
					myPage = myDocument.pages.item(startPage - 1);
				}
				else{
					alert("El documento no tiene suficientes páginas. Se requiere al menos " + startPage + " páginas.");
					return;
				}
			}
			else{
				myPage = myDocument.pages.item(0);
			}
			myPlacePDF(myDocument, myPage, myPDFFile);
		}
	}
}
function myChooseDocument(){
    var myDocumentNames = new Array;
    myDocumentNames.push("New Document");
    myDocumentNames.push("All Opened");
    for(var myDocumentCounter = 0; myDocumentCounter < app.documents.length; myDocumentCounter++){
        myDocumentNames.push(app.documents.item(myDocumentCounter).name);
    }
    var myChooseDocumentDialog = app.dialogs.add({name:"Choose a Document", canCancel:false});
    with(myChooseDocumentDialog.dialogColumns.add()){
        with(dialogRows.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Place PDF in:"});
            }
            with(dialogColumns.add()){
                var myChooseDocumentDropdown = dropdowns.add({stringList:myDocumentNames, selectedIndex:0});
            }
        }
    }
	var myResult = myChooseDocumentDialog.show();
	if(myResult == true){
		if(myChooseDocumentDropdown.selectedIndex == 0){
			myDocument = app.documents.add();
			myNewDocument = true;
			allOpened = false;
		}
		else if(myChooseDocumentDropdown.selectedIndex == 1){
			myDocument = null;
			myNewDocument = false;
			allOpened = true;
		}
		else{
			myDocument = app.documents.item(myChooseDocumentDropdown.selectedIndex-2);
			myNewDocument = false;
			allOpened = false;
		}
		myChooseDocumentDialog.destroy();
	}
	else{
		myDocument = "";
		myNewDocument = "";
		allOpened = false;
		myChooseDocumentDialog.destroy();
	}
    return [myDocument, myNewDocument, allOpened];
}
function myChooseStartPage(){
    var myStartPageDialog = app.dialogs.add({name:"Choose Start Page", canCancel:false});
    var startPage = 1;
    with(myStartPageDialog.dialogColumns.add()){
        with(dialogRows.add()){
            with(dialogColumns.add()){
                staticTexts.add({staticLabel:"Start placing PDF from page:"});
            }
            with(dialogColumns.add()){
                var myStartPageField = integerEditboxes.add({editValue:1, minValue:1});
            }
        }
    }
    myStartPageDialog.show();
    startPage = myStartPageField.editValue;
    myStartPageDialog.destroy();
    return startPage;
}
function myPlacePDF(myDocument, myPage, myPDFFile){
	var myPDFPage;
	app.pdfPlacePreferences.pdfCrop = PDFCrop.cropMedia;
	var myCounter = 1;
	var myBreak = false;
	while(myBreak == false){
		if(myCounter > 1){
			myPage = myDocument.pages.add(LocationOptions.after, myPage);
		}
		app.pdfPlacePreferences.pageNumber = myCounter;
		myPDFPage = myPage.place(File(myPDFFile), [0,0])[0];
		if(myCounter == 1){
			var myFirstPage = myPDFPage.pdfAttributes.pageNumber;
		}
		else{
			if(myPDFPage.pdfAttributes.pageNumber == myFirstPage){
				myPage.remove();
				myBreak = true;
			}
		}
		myCounter = myCounter + 1;
	}
}