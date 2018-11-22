config = {}
config.BASE_URL = "http://candygram.neurology.emory.edu:8080/api/v1"

thumbHeight = 200;

// // Function initializing dialogs
// $(function () {
//   $("#dialog").dialog({
//     autoOpen: false
//   });
  
//   $("#opener").click(function() {
//     $("#dialog").dialog('open');
//   });
// });

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
    //    template: "<br>#name# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail' >",

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
        $("#dialog").dialog({
            autoOpen: true,
            buttons: {
                Clinical_Data: function() {
                    Clinical_Data(studyID,patientID);
                    $(this).dialog("close");
                },
                Clinical_Events: function() {
                    Clinical_Events(patientID);
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
                          {id:"No: ", header:"Sl.No.", width:35},
                          {id:"Id: ", header:"SlideID", width:100},
                          {id:"Stain: ", header:"Stain Types", width:35},
                          {id:"BRC: ", header:"Blood_Red_Percentage", width:45},
                          {id:"WBC: ", header:"White Blood Cell Count", width:45},
                          {id:"Grade: ", header:"Cancer Grading", width:45},
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

function Clinical_Data(studyID,patientID){     
    filename = patientID +"_Clinical_Data"
    studyID=Cancer_Grading+"_tcga";
    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/patients/"+patientID+"/clinical-data?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
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
            promise = makePromise(url);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
}

function Clinical_Events(patientID){     
    filename = patientID +"_Clinical_Events"
    
    var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")
    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }
    console.log(studyID);
    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/patients/"+patientID+"/clinical-events?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            const key_replacer = (key, value) => key === null ? "" : key; // specify how you want to handle null keys here
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
            promise = makePromise(url);
            promise.then(function(result) {
            console.log(result);        
            return
            }, function(err) {
            console.log(err);
            });    
        }
}

function Other_cBioportal(){
    $("#dialog").dialog({
            autoOpen: true,
            buttons: {
                cancer_types_all: function() {
                    cancer_types_all();
                    $(this).dialog("close");
                },
                cancer_types:function(){
                    cancer_types();
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
