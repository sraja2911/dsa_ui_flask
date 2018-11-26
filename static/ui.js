config = {}
config.BASE_URL = "http://candygram.neurology.emory.edu:8080/api/v1"

thumbHeight = 200;

function closeWindow() {
    $$("my_win").hide();
}

var window = webix.ui({
    view: "window",
    id: "my_win",
    modal: true,
    head: "DSA - Slide Properties",
    position: "center",
    height: 350,
    width: 350,
    body: {
        rows: [
            { view: "button", value: "", click: closeWindow },
            { view: "template", id: "templateWin", template: "My box" }
        ]
    }
})

sliderTemplate = ""


webix.type(webix.ui.dataview, {
    name: "smallThumb",
    template: "<br>#slideAbbrev# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail?width=128' >",
    width: 140,
    height: 140
});

webix.type(webix.ui.dataview, {
    name: "bigThumb",
    template: "<br>#name# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail?width=256' >",
    width: 260,
    height: 360
});

var rajsFirstDataView = {
    view: "dataview",
    id: "slideDataview",
    url: config.BASE_URL + "/item?folderId=5bd2222ee62914004e463a54&limit=50&sort=lowerName&sortdir=1&height=" + thumbHeight,
    type: "smallThumb",

    "select": true,
    "multiselect": true,
    "on": {
        'onAfterSelect': function(id) {
            var ar_selected = $$("slideDataview").getSelectedItem(true);

            if (ar_selected.length == 1) {
                single_select(ar_selected[0])
            } else {
                multi_select(ar_selected);
            }
        }
    },
    scheme: {
        $init: function(obj) {
            //create a shorter abbreviation for each item
            obj['slideAbbrev'] = obj['name'].split(".")[0];
        }


    }
}

function makePromise(url) {
    // Sets up a promise in the proper way using webix
    return new webix.promise(function(success, fail) {
        webix.ajax(url, function(text) {
            if (text) success(text);
            else fail(text.error)
        })
    })
}

function single_select(item) {
    id = item._id;
    if ("meta" in item) {
        var Stain_Types = item.meta.Stain_Types;
        var Blood_Red_Percentage = item.meta.Blood_Red_Percentage;
        var White_Blood_Cell_Count = item.meta.White_Blood_Cell_Count;
        var Cancer_Grading = item.meta.Cancer_Grading;
        sliderTemplate = "<div>SlideName:#name#<br>SlideID:#id#<br>StainTypes:#meta.Stain_Types#<br>RBC:#meta.Blood_Red_Percentage#<br>Grade:#meta.Cancer_Grading#<br> " +
           "WBC:#meta.White_Blood_Cell_Count# </div>"
        patientID = item.name.substring(0,12);
        studyID=Cancer_Grading.substring(0,3);

        // Multiple cBioPortal Choices  
        $("#maindialog").dialog({
            autoOpen: true,
            buttons: {
                Clinical_Data: function() {
                    Clinical_Data(patientID);                    
                    $(this).dialog("close");
                },
                Clinical_Events: function() {
                    Clinical_Events(patientID);
                    $(this).dialog("close");
                },
                copy_number_segments: function() {
                    copy_number_segments(patientID);                    
                    $(this).dialog("close");
                },
                discrete_copynumber_alterations: function() {
                    discrete_copynumber_alterations();                    
                    $(this).dialog("close");
                },                
                Other_cBioportal: function() {
                    Other_cBioportal();
                    $(this).dialog("close");
                }

            },
            width: "600px"

        });
    }
    $$("sliderdata").define("template", sliderTemplate);
    $$("sliderdata").parse(item);
    $$("sliderdata").refresh();    
}

var layout = {
    title: 'Digital Slides Plot, Digital Slide Archive Platform, Emory University',
    xaxis: {
        title: 'Slide Name',
        titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
        }
    },
    height: 600,
    width: 600,
    showlegend: true,
    yaxis: {
        title: 'Slide Values',
        titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
        }
    }
};

slideText =""

function multi_select(ar_selected) {
    var slideRecords = webix.toArray(ar_selected);
    data = []
    var update = {}
    var name = []
    var perc = []
    var wb_count = []
    var Stain_Types = []
    var Cancer_Grading = []
    var Associated_Genes = []
    var slideText = []
    slideRecords.each(function(obj) {        
        name.push(obj.name);
        perc.push(obj.meta.Blood_Red_Percentage);
        wb_count.push(obj.meta.White_Blood_Cell_Count);        
        Stain_Types.push(obj.meta.Stain_Types);
        Cancer_Grading.push(obj.meta.Cancer_Grading);
        // Associated_Genes.push(obj.meta.Associated_Genes);
        nextSlideText = "SlideID: " + obj._id +
            "\\n" + "Stain_Types: " + obj.meta.Stain_Types +
            "\\n " + "Blood_Red_Percentage: " + obj.meta.Blood_Red_Percentage +
            "\\n" + "White_Blood_Cell_Count: " + obj.meta.White_Blood_Cell_Count +
            "\\n" + "Cancer_Grading: " + obj.meta.Cancer_Grading +
            // "\\n" + "Associated_Genes: " + obj.meta.Associated_Genes +
            "\\n" + "Slide Name: " + obj.name;

        slideText = slideText + "\\n" + nextSlideText
        // slideText = obj; //FIX THIS.. nt sure what your trying to render
    });
    var data = [
        { x: name, y: perc, mode: 'lines+markers', name: "BRC Percentage" },
        { x: name, y: wb_count, mode: 'lines+markers', name: "WBC Count" }
    ]
    
    // $$("caseListTable").clearAll();
    // $$("caseListTable").parse(slideText);
    // $$("caseListTable").refresh();

    
    Plotly.newPlot("plotly_div", data, layout);
}

var dataViewControls = {
    cols: [{
            view: "button",
            id: "btnSmallThumb",
            label: "smallThumbs",
            click: function(id) {
                webix.message("small Raj")
                $$('slideDataview').define('type', 'smallThumb');
                $$('slideDataview').render();

            }
        },
        {
            view: "button",
            id: "btnLargeThumb",
            label: "largeThumbs",
            click: function(id) {

                webix.message("large Raj")
                $$('slideDataview').define('type', 'bigThumb');
                $$('slideDataview').render();
            }
        }
    ]
}

// meta.Blood_Red_Percentage;
//             var White_Blood_Cell_Count = item.meta.White_Blood_Cell_Count
// sliderTemplate = "<div>SlideName:#name#<br>SlideID:#id#<br>StainTypes:#Stain_Types#<br>RBC:#Blood_Red_Percentage#<br>Grade:#Cancer_Grading#<br> " +
//            "WBC:#White_Blood_Cell_Count# </div>"

webix.ready(function() {
    webix.ui({
        container: "main_layout",
        rows: [{
                "cols": [{
                        rows: [
                            { view: "template", template: "DV Controls", type: "header" },
                            dataViewControls,
                            rajsFirstDataView,
                            {
                                view: "template",
                                //template: "Footer",
                                template: sliderTemplate,
                                id: "sliderdata",
                                gravity: 0.2
                            }
                        ]
                    },
                    { view: "resizer" },
                    { view: "template", content: "plotly_div" },
                    // {
                    //     view:"dataview",
                    //     id:"caseListTable",
                    //     height:800,                        
                    //     type:{
                    //       width: 261,
                    //       height: 90,
                    //       template:"<div>SlideName:#name#<br>SlideID:#id#<br>StainTypes:#meta.Stain_Types#<br>RBC:#meta.Blood_Red_Percentage#<br>Grade:#meta.Cancer_Grading#<br> " +
                    //         "WBC:#meta.White_Blood_Cell_Count# </div>"
                    //     },
                         
                    // }
                    { view:"datatable", 
                      id:"caseListTable", 
                      on:{
                            onBeforeLoad:function(){
                            this.showOverlay("Loading...");
                        },
                            onAfterLoad:function(){
                                console.log("onAfterLoad");
                                if (!this.count()){
                                    this.showOverlay("Sorry, there is no data");                                    
                                } else {
                                    this.hideOverlay();
                                }
                                
                            }
                        },
                      columns: [
                          {id:"No: ", header:"No.", width:35},
                          {id:"Id: ", header:"ID", width:120},
                          {id:"Stain: ", header:"StainTypes", width:60},
                          {id:"BRC: ", header:"Blood_Red_Percentage", width:65},
                          {id:"WBC: ", header:"White Blood Cell Count", width:65},
                          {id:"Grade: ", header:"Cancer Grading", width:65},
                          {id:"Name: ", header:"Slide Name", width:80},
                      ],
                      autoConfig: true,
                      data: slideText                      
                    }
                ]
            },
            // {
            //     view: "template",
            //     template: "Footer",
            //     id : "Footer",
            //     height : 250,
            //     width : 261
            // }           
        ]
    })
});

function Clinical_Data(patientID){     

    filename = patientID +"_Clinical_Data"

    var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")

    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }    

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/patients/"+patientID+"/clinical-data?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            console.log(items);
            const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
}

function Clinical_Events(patientID){     
    
    var studyID = prompt("Please enter the Cancer StudyID", "lgg_ucsf_2014")

    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }

    var patientID = prompt("Please enter the PatientID", "P01")

    if (patientID == null || patientID == "") {
        txt = "User cancelled the prompt.";
    }else {
        patientID = patientID;
    }

    filename = "Clinical_Events_4_"+ patientID + "_" + studyID;

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/patients/"+patientID+"/clinical-events?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            //const key_replacer = (key, value) => key === null ? "" : key; // specify how you want to handle null keys here
            const replacer = (key, value) => value === null ? "" : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
}

function Other_cBioportal(){
    $("#othercbiodialog").dialog({
            autoOpen: true,
            buttons: {
                cancer_types_all: function() {
                    cancer_types_all();
                    $(this).dialog("close");
                },
                clinical_attributes:function(){
                    clinical_attributes();
                    $(this).dialog("close");
                },
                clinical_attributes_studyID:function(){
                    clinical_attributes_studyID();
                    $(this).dialog("close");
                },
                get_all_gene_panel:function(){
                    get_all_gene_panel();
                    $(this).dialog("close");
                },                
                Other_cBioportal: function() {
                    alert("Maybe!");
                    $(this).dialog("close");
                }

            },
            width: "400px"

        });    
}

function cancer_types_all(){

    filename = "Cancer_Types_all"
    downloadurl = "http://www.cbioportal.org/api/cancer-types?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            console.log(items);
            //const key_replacer = (key, value) => key === null ? "" : key; // specify how you want to handle null keys here
            const replacer = (key, value) => value === null ? "" : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
    
}

function clinical_attributes(){

    filename = "clinical_attributes"
    downloadurl = "http://www.cbioportal.org/api/clinical-attributes?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            //const key_replacer = (key, value) => key === null ? "" : key; // specify how you want to handle null keys here
            const replacer = (key, value) => value === null ? "" : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
    
}

function clinical_attributes_studyID(){
    
    var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")
    
    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }        

    console.log(studyID);
    filename = "clinical_attributes_" + studyID    
    
    downloadurl = "http://www.cbioportal.org/api/studies/"+ studyID+"/clinical-attributes?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            //const key_replacer = (key, value) => key === null ? "" : key; // specify how you want to handle null keys here
            const replacer = (key, value) => value === null ? "" : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            console.log(studyID);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }

    
}

function copy_number_segments(patientID){

    filename = patientID +"_Copy_number_Segments"

    var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")

    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }    

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/samples/"+patientID+"/copy-number-segments?projection=SUMMARY&pageSize=20000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            console.log(items);
            const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
}

function discrete_copynumber_alterations(){

    var molecularProfileId = prompt("Please enter Molecular Profile ID", "acc_tcga_gistic")

    if (molecularProfileId == null || molecularProfileId == "") {
        txt = "User cancelled the prompt.";
    }else {
        molecularProfileId = molecularProfileId;
    }

    var sampleListId = prompt("Please enter Sample List ID", "acc_tcga_all")

    if (sampleListId == null || sampleListId == "") {
        txt = "User cancelled the prompt.";
    }else {
        sampleListId = sampleListId;
    }    

    filename = "discrete_copynumber_alterations_4_"+ molecularProfileId +"_"+ sampleListId

    downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularProfileId+"/discrete-copy-number?sampleListId="+sampleListId+"&discreteCopyNumberEventType=HOMDEL_AND_AMP&projection=SUMMARY";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            console.log(items);
            const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
}

function get_all_gene_panel(){

    filename = "all_gene_panel"
    downloadurl = "http://www.cbioportal.org/api/gene-panels?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            //const key_replacer = (key, value) => key === null ? "" : key; // specify how you want to handle null keys here
            const replacer = (key, value) => value === null ? "" : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }

}

function gene_panelID(){

    var gene_panelID = prompt("Please enter Gene Panel ID", "NSCLC_UNITO_2016_PANEL")

    if (gene_panelID == null || gene_panelID == "") {
        txt = "User cancelled the prompt.";
    }else {
        gene_panelID = gene_panelID;
    }
    
    filename = "GenePanelID_4_"+ gene_panelID

    downloadurl = "http://www.cbioportal.org/api/gene-panels/"+ gene_panelID;

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            console.log(items);
            const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');

            //Download the file as CSV
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\ufeff", csv]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;

            downloadLink.download = filename + ".csv";  //Name the file here
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
           })
        })
    }
    else {
            promise = makePromise(downloadurl);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }

}