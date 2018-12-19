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
        $("#maindialog").dialog({
            autoOpen: true,
            buttons: {
                clinical_Data: function() {
                    clinical_Data(patientID);                    
                    $(this).dialog("close");
                },
                clinical_Events: function() {
                    clinical_Events(patientID);
                    $(this).dialog("close");
                },
                copy_number_segments: function() {
                    copy_number_segments(patientID);                    
                    $(this).dialog("close");
                },
                molecular_data:function(){
                    molecular_data();
                    $(this).dialog("close");
                },
                all_patients_in_study:function(){
                    all_patients_in_study();
                    $(this).dialog("close");
                },                
                patient_in_study:function(){
                    patient_in_study(patientID);
                    $(this).dialog("close");
                },
                cBio_SamplesList: function() {
                    cBio_SamplesList();                    
                    $(this).dialog("close");
                },
                sampleList_in_study: function() {
                    sampleList_in_study();                    
                    $(this).dialog("close");
                },                
                mutated_genes_in_study: function() {
                    mutated_genes_in_study();                    
                    $(this).dialog("close");
                },
                copynumberregions_in_study: function() {
                    copynumberregions_in_study();                    
                    $(this).dialog("close");
                },
                all_samples_in_study: function() {
                    all_samples_in_study();                    
                    $(this).dialog("close");
                },
                all_available_studies: function() {
                    all_available_studies();                    
                    $(this).dialog("close");
                },
                single_study: function() {
                    single_study();                    
                    $(this).dialog("close");
                },  
                generic_cBioportal: function() {
                    generic_cBioportal();
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
        ]
    })
});

function clinical_Data(patientID){     

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

function clinical_Events(patientID){     
    
    var studyID = prompt("Please enter the Cancer StudyID", "lgg_ucsf_2014")

    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }

    var sampleID = prompt("Please enter the PatientID or leave blank for selected Patient ID", "TCGA-OR-A5J2-01")

    if (sampleID == null) {
        txt = "User cancelled the prompt.";
    }else if (sampleID == "") {
        sampleID = patientID
    }else {
        sampleID = sampleID;
    }

    filename = "Clinical_Events_4_"+ sampleID + "_" + studyID;

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/patients/"+sampleID+"/clinical-events?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function generic_cBioportal(){
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
                molecular_profiles_all:function(){
                    molecular_profiles_all();
                    $(this).dialog("close");
                },
                molecular_profile_id:function(){
                    molecular_profiles_id();
                    $(this).dialog("close");
                },
                molecular_profiles_4_cancerstudyid:function(){
                    molecular_profiles_4_cancerstudyid()();
                    $(this).dialog("close");
                },
                molecular_mutations_profiles_4_cancerstudyid:function(){
                    molecular_mutations_profiles_4_cancerstudyid();
                    $(this).dialog("close");
                },
                discrete_copynumber_alterations: function() {
                    discrete_copynumber_alterations();                    
                    $(this).dialog("close");
                },
                previous_menu: function() {
                    history.back();                     
                }
            },
            width: "500px"

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

    var studyID = prompt("Please enter the Cancer StudyID", "acc_tcga")

    if (studyID == null || studyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        studyID = studyID;
    }    

    var sampleID = prompt("Please enter the study sample ID or leave blank for selected Patient ID", "TCGA-OR-A5J2-01")

    if (studyID == null) {
        txt = "User cancelled the prompt.";
    }else if (studyID == "") {
        studyID = patientID
    }else {
        studyID = studyID;
    }

    filename = patientID +"_Copy_number_Segments"

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

function molecular_data(){

    var molecularProfileId = prompt("Please enter Molecular Profile ID", "acc_tcga_rna_seq_v2_mrna")

    if (molecularProfileId == null || molecularProfileId == "") {
        txt = "User cancelled the prompt.";
    }else {
        molecularProfileId = molecularProfileId;
    }

    var sampleListId = prompt("Please enter Study Sample List ID", "acc_tcga_all")

    if (sampleListId == null || sampleListId == "") {
        txt = "User cancelled the prompt.";
    }else {
        sampleListId = sampleListId;
    }

    var entrezGeneId = prompt("Please enter numeric Entrez Gene Id", "1")

    if (entrezGeneId == null || entrezGeneId == "") {
        txt = "User cancelled the prompt.";
    }else {
        entrezGeneId = entrezGeneId;
    }    

    filename = "MolecularProfiles_4_"+ molecularProfileId +"_"+ sampleListId +"_"+ entrezGeneId

    downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularProfileId+"/molecular-data?sampleListId="+sampleListId+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";

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

function molecular_profiles_all(){

    filename = "MolecularProfiles_all"

    downloadurl = "http://www.cbioportal.org/api/molecular-profiles?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function molecular_profiles_id(){

    var molecularProfileId = prompt("Please enter Molecular Profile ID", "acc_tcga_mutations")

    if (molecularProfileId == null || molecularProfileId == "") {
        txt = "User cancelled the prompt.";
    }else {
        molecularProfileId = molecularProfileId;
    }

    filename = "MolecularProfiles_4_"+ molecularProfileId 

    downloadurl = "http://www.cbioportal.org/api/molecular-profiles/" + molecularProfileId;

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

function molecular_profiles_4_cancerstudyid(){

    var cancerstudyID = prompt("Please enter Cancer Study ID for the molecular profiles", "acc_tcga")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }

    filename = "MolecularProfiles_4_Cancerstudy_"+ cancerstudyID 

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/molecular-profiles?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function molecular_mutations_profiles_4_cancerstudyid(){

    try{
        var molecularProfileId = prompt("Please enter molecular profilesID ", "acc_tcga_mutations")

        if (molecularProfileId == null || molecularProfileId == "") {
            throw new Error("User cancelled the prompt.");            
        }else {
            molecularProfileId = molecularProfileId;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var cancerstudyID = prompt("Please enter Cancer Study ID for the mutations profiles", "acc_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");            
        }else {
            cancerstudyID = cancerstudyID;
        }    
    }
    catch(e){
        alert(e.message);
    }

    filename = "Mutations_in_MolecularProfile_4_Cancerstudy_"+ cancerstudyID +"_molecularprofiles_" + molecularProfileId

    downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularProfileId+"/mutations?sampleListId="+cancerstudyID+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
                  
    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            console.log(items);
            const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
            //let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
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

function all_patients_in_study(){

    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "All_patients_4_Cancerstudy_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/patients?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function patient_in_study(patientID){

    var sampleID = prompt("Please enter the study patient ID or leave blank for selected Patient ID", "TCGA-02-0001")

    if (sampleID == null) {
        txt = "User cancelled the prompt.";
    }else if (sampleID == "") {
        sampleID = patientID
    }else {
        sampleID = sampleID;
    }


    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "patient_in_Cancerstudy_"+ sampleID

    downloadurl = "http://www.cbioportal.org/api/studies/"+ cancerstudyID+ "/patients/"+ sampleID;

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

function cBio_SamplesList(){

    filename = "cBioSamplesList" 

    downloadurl = "http://www.cbioportal.org/api/sample-lists?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function sampleList_in_study(){

    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga_all")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "sampleList_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/sample-lists/"+cancerstudyID;

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

function all_samples_in_study(){

    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga_all")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "all_samples_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/sample-lists/"+cancerstudyID+"/sample-ids";

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

function all_available_studies(){

    filename = "all_available_studies" 

    downloadurl = "http://www.cbioportal.org/api/studies?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function single_study(){

    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "single_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID;

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

function copynumberregions_in_study(){

    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "copynumberregions_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/significant-copy-number-regions?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"

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

function mutated_genes_in_study(){

    var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

    if (cancerstudyID == null || cancerstudyID == "") {
        txt = "User cancelled the prompt.";
    }else {
        cancerstudyID = cancerstudyID;
    }
    
    filename = "mutated_genes_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/significantly-mutated-genes?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"

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