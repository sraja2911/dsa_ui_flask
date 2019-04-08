config = {}
//config.BASE_URL = "http://candygram.neurology.emory.edu:8080/api/v1"
config.BASE_URL = "http://digitalslidearchive.emory.edu:8080/girder_root/api/v1"


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
    //url: config.BASE_URL + "/item?folderId=5bd2222ee62914004e463a54&limit=50&sort=lowerName&sortdir=1&height=" + thumbHeight,
    url: config.BASE_URL + "/item?folderId=5ae351e792ca9a0020d95e50&limit=100&sort=lowerName&sortdir=1&height=" + thumbHeight, 
    type: "smallThumb",

    "select": true,
    "multiselect": true,
    "on": {
        'onAfterSelect': function(id) {
            // var ar_selected = $$('slideDataview').select();
            // multi_select(ar_selected);  
            var ar_selected = $$("slideDataview").getSelectedItem(true);
                if (ar_selected.length == 1) {
                    single_select(ar_selected[0])
                } else {
                    multi_select(ar_selected)
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
    return new webix.promise(function(success, fail) {
        webix.ajax(url, function(text) {
            if (text) success(text);
            else fail(text.error)
        })
    })
}

function single_select(item) {
    id = item._id;
    var airbubble = []
    var blood = []
    var ink = []

    if ("meta" in item) {
        var tags = item.meta.tags;
        var Stain_Types = item.meta.Stain_Types;
        var Blood_Red_Percentage = item.meta.Blood_Red_Percentage;
        var White_Blood_Cell_Count = item.meta.White_Blood_Cell_Count;
        var Cancer_Grading = item.meta.Cancer_Grading;

        patientID = item.name.substring(0,12);
        sampleID = item.name.substring(0,15); 

        var airbubble = tags['AirBubble'];        
        var blood = item.meta.tags['Blood'];              
        var ink = item.meta.tags['Ink'];       
        
        
        sliderTemplate = "<div>SlideName:#name#<br>SlideID:#id#<br>tags:#meta.tags#<br>Bubble:#airbubble#<br>Blood:#blood#<br>Ink:#ink#<br> " +
           "WBC:#meta.White_Blood_Cell_Count#<br>PatientID:#patientID#<br>SampleID:#sampleID#</div>"        
                
        //studyID=Cancer_Grading.substring(0,3);      
        $("#maindialog").dialog({
            autoOpen: true,
            buttons: {
                clinical_Data_4_patient: function() {
                    clinical_Data_4_patient(patientID);                    
                    $(this).dialog("close");
                },
                clinical_Data_4_study: function() {
                    clinical_Data_4_study(studyID);                    
                    $(this).dialog("close");
                },
                clinical_Data_4_sample_studyID: function() {
                    clinical_Data_4_sample_studyID(studyID);                    
                    $(this).dialog("close");
                },
                clinical_Events: function() {
                    clinical_Events(patientID);
                    $(this).dialog("close");
                },
                copy_number_segments: function() {
                    copy_number_segments(sampleID);                    
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
                sampleList_in_sampleId: function() {
                    sampleList_in_sampleId();                    
                    $(this).dialog("close");
                },
                all_sampleIDs_in_samplelist: function() {
                    all_sampleIDs_in_samplelist();                    
                    $(this).dialog("close");
                },                
                samplelist_in_study: function() {
                    samplelist_in_study();                    
                    $(this).dialog("close");
                },
                allcaselists_in_study: function(){
                    allcaselists_in_study();                    
                    $(this).dialog("close");
                },
                allsamples_patient_in_study: function() {
                    allsamples_patient_in_study(patientID);                    
                    $(this).dialog("close");
                },
                all_samples_in_study: function() {
                    all_samples_in_study();                    
                    $(this).dialog("close");
                },
                sample_in_study: function() {
                    sample_in_study(patientID);                    
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
                all_available_studies: function() {
                    all_available_studies();                    
                    $(this).dialog("close");
                },
                single_study: function() {
                    single_study();                    
                    $(this).dialog("close");
                },
                tags_of_study: function() {
                    tags_of_study();                    
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
    var update = []
    var name = []
    var patientID = []
    var geneID
    var sampleID = []
    
    var tags = []

    var airbubble = [];
    var blood = [];
    var ink = [];
    var geneexp_5728 = [];
    var geneexp_1956 = [];
    var geneexp_5156 = [];
    var geneexp_7157 = [];
    slideRecords.each(function(obj) {        
        name.push(obj.name);
        patientID.push(obj.name.substring(0,12));        
        sampleID.push(obj.name.substring(0,15));        

        tags.push(obj.meta.tags);        
        airbubble.push(obj.meta.tags['AirBubble']);        
        blood.push(obj.meta.tags['Blood']);        
        ink.push(obj.meta.tags['Ink']);        
        
        sliderTemplate = "<div>SlideName:#name#<br>SlideID:#id#<br>tags:#meta.tags#<br>Bubble:#airbubble#<br>Blood:#blood#<br>Ink:#ink#<br> " +
           "WBC:#meta.White_Blood_Cell_Count#<br>PatientID:#patientID#<br>SampleID:#sampleID#</div>" 

        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_rna_seq_v2_mrna_median_Zscores"; 
        pten_3d_charts(samplelistid, molecularprofileid, patientID,airbubble,blood,ink);      
        //blood_multigeneexp_charts(samplelistid, molecularprofileid, sampleID,airbubble,blood,ink)
        //blood_combinedgeneexp_charts(samplelistid, molecularprofileid, patientID,airbubble,blood,ink)
        // geneid1='5728';
        // geneid2='1956';
        // geneid3='5156';
        // geneid4='7157';                
        // geneexp_5728 = geneexp_data(molecularprofileid, samplelistid, geneid1, patientID);
        // geneexp_1956 = geneexp_data(molecularprofileid, samplelistid, geneid2, patientID);
        // geneexp_5156 = geneexp_data(molecularprofileid, samplelistid, geneid3, patientID);
        // geneexp_7157 = geneexp_data(molecularprofileid, samplelistid, geneid4, patientID);       
   } )//end of slideRecords

// Charts classification per geneexp and bloody slides
// var PTEN_gene = {
//   x: patientID,
//   y: geneexp_5728,
//   type: 'scatter',
//   name: 'PTEN_bloody',
//   mode: 'lines+markers',
//   transforms: [{
//     type: 'groupby',
//     groups: blood
//   }]
// };

// var PDGFRA_gene = {
//   x: patientID,
//   y: geneexp_7157,
//   xaxis: 'x2',
//   yaxis: 'y2',
//   type: 'scatter',
//   name: 'PDGFRA_bloody',
//   mode: 'lines+markers',
//   transforms: [{
//     type: 'groupby',
//     groups: blood
//   }]

// };

// var EGFR_gene = {
//   x: patientID,
//   y: geneexp_5156,
//   xaxis: 'x3',
//   yaxis: 'y3',
//   type: 'scatter',
//   name: 'EGFR_bloody',
//   mode: 'lines+markers',
//   transforms: [{
//     type: 'groupby',
//     groups: blood
//   }]

// };

// var TP53_gene = {
//   x: patientID ,
//   y: geneexp_7157,
//   xaxis: 'x4',
//   yaxis: 'y4',
//   type: 'scatter',
//   name: 'TP53_bloody',
//   mode: 'lines+markers',
//   transforms: [{
//     type: 'groupby',
//     groups: blood
//   }]
// };

// var data = [PTEN_gene, PDGFRA_gene, EGFR_gene, TP53_gene];

// var layout = {
//   grid: {rows: 2, columns: 2, pattern: 'independent'},
// };

// Plotly.newPlot("plotly_div", data, layout);

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
pt1URL = "http://www.cbioportal.org/api/studies/gbm_tcga/patients/TCGA-02-0006/clinical-data?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"

pt2URL = "http://www.cbioportal.org/api/studies/lgg_ucsf_2014/patients/P24/clinical-events?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"

explistDT = {
                view: "datatable",
                autoConfig: true,
                css: "checkbox_style",
                id: "explist",
                editable: true,
                checkboxRefresh: true, 
                spans:true,
                select:"cell",
                scrollX:false,               
                url: ""
            };

explist = {
            gravity: 5,
            rows: [ 

                    {
                        cols: [
                                {view:"button", label:"EmptyGrid", click:function(){$$("explist").clearAll()}},
                                {view:"button", label:"Available GenePanels for study", click:function(){
                                    $$("explist").clearAll()
                                    $$("explist").config.columns ={}
                                    $$("explist").refreshColumns();                                    
                                    genepanelurl = "http://www.cbioportal.org/api/gene-panels?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
                                    $$("explist").load(genepanelurl);
                                }},
                                {view:"button", label:"Specific genepaneldata", click:function(){

                                    function show_geneId(obj, common, value, colId, index){ 
                                        return obj.genes[index].entrezGeneId      
                                    }
                                    function show_geneSymbol(obj, common, value, colId, index){ 
                                        return obj.genes[index].hugoGeneSymbol      
                                    }                                      
                                    $$("explist").clearAll();  
                                    //$$("explist").config.columns ={}                                  
                                    $$("explist").config.columns=[
                                        {id: "Description", map:"#description#"},
                                        {id: "GeneId", isGroupItem: true, header:[{"text":"genes", colspan:"2"},{"text":"entrezGeneId"}], template:show_geneId},
                                        {id: "GeneSymbol", isGroupItem: true, header:[null,{"text":"GeneSymbol"}], template:show_geneSymbol},
                                        {id: "PanelId", map:"#genePanelId#"}                                        
                                    ];                                                                        
                                    $$("explist").refreshColumns();
                                    try{
                                        var cancerstudyID = prompt("Please enter Gene PanelID ", "IMPACT341")

                                        if (cancerstudyID == null || cancerstudyID == "") {
                                            throw new Error("User cancelled the prompt.");
                                        }else {
                                            cancerstudyID = cancerstudyID;
                                        }
                                    }
                                    catch(e){
                                        alert(e.message);
                                    }
                                    genepanelidurl = "http://www.cbioportal.org/api/gene-panels/"+cancerstudyID
                                    console.log(genepanelidurl)
                                    $$("explist").load(genepanelidurl);                                    
                                }},
                                {view:"button", label:"MutationData for CancerStudy", click:function(){
                                //Add a clearall if you don't want it to append to the current list..
                                    $$("explist").clearAll();
                                    $$("explist").config.columns ={}
                                    $$("explist").refreshColumns();

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
                                        var cancerstudyID = prompt("Please enter Cancer Study ID for the mutations profiles", "acc_tcga_all")

                                        if (cancerstudyID == null || cancerstudyID == "") {
                                            throw new Error("User cancelled the prompt.");            
                                        }else {
                                            cancerstudyID = cancerstudyID;
                                        }    
                                    }
                                    catch(e){
                                        alert(e.message);
                                    }
                                    mutationurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularProfileId+"/mutations?sampleListId="+cancerstudyID+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
                                    $$("explist").load(mutationurl);
                                }},
                                {view:"button", label:"CopyNumber Regions", click:function(){                                    
                                    $$("explist").clearAll();
                                    $$("explist").config.columns ={}
                                    $$("explist").refreshColumns();                                    
                                    try{
                                        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

                                        if (cancerstudyID == null || cancerstudyID == "") {
                                            throw new Error("User cancelled the prompt.");
                                        }else {
                                            cancerstudyID = cancerstudyID;
                                        }
                                    }
                                    catch(e){
                                        alert(e.message);
                                    }
                                    CNVurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/significant-copy-number-regions?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"
                                    console.log(CNVurl);
                                    $$("explist").load(CNVurl);
                                }},
                                {view:"button", label:"CopyNumberSegments-Patient", click:function(){
                                    $$("explist").clearAll();
                                    $$("explist").config.columns ={}
                                    $$("explist").refreshColumns();

                                    try{
                                        var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")

                                        if (studyID == null || studyID == "") {
                                            throw new Error("User cancelled the prompt.");
                                        }else {
                                            studyID = studyID;
                                        }
                                    }
                                    catch(e){
                                        alert(e.message);
                                    }

                                    try{
                                        var sampleID = prompt("Please enter the Patient ID", "TCGA-02-0001-01")

                                        if (sampleID == null) {
                                            throw new Error("User cancelled the prompt.");
                                        }else if (sampleID == "") {
                                            sampleID = patientID
                                        }else{
                                            sampleID = sampleID;
                                        }
                                    }
                                    catch(e){
                                        alert(e.message);
                                    }
                                    copynumberurl = "http://www.cbioportal.org/api/studies/"+studyID+"/samples/"+sampleID+"/copy-number-segments?projection=SUMMARY&pageSize=20000&pageNumber=0&direction=ASC";
                                    $$("explist").load(copynumberurl);
                                }},
                    ]},
                    explistDT
                  ]

        }


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
                                template: sliderTemplate,
                                id: "sliderdata",
                                gravity: 0.2
                            }
                        ]
                    },
                    { view: "resizer" },
                    explist,
                    { view: "resizer"},
                    { view: "template", content: "plotly_div" },
                    { view: "resizer"}                             
                ]
            },
        ]
    })

});

function clinical_Data_4_sample_studyID(patientID){

try{
        var studyID = prompt("Please enter the Cancer StudyID", "lgg_ucsf_2014")

        if (studyID == null || studyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            studyID = studyID;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var sampleID = prompt("Please enter the PatientID or leave blank for selected Patient ID", "TCGA-OR-A5J2-01")

        if (sampleID == null) {
            throw new Error("User cancelled the prompt.");
        }else if (sampleID == "") {
            sampleID = patientID
        }else {
            sampleID = sampleID;
        }
    }
    catch(e){
        alert(e.message);
    }
    

    filename = "clinical_Data_4_sample_"+ sampleID + "studyID_" + studyID;

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/samples/"+sampleID+"/clinical-events?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function clinical_Data_4_patient(patientID){     

    filename = patientID +"_Clinical_Data"

    try{
        var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")

        if (studyID == null || studyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            studyID = studyID;
        }
        
    }
    catch(e){
        alert(e.message);
    }

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/patients/"+patientID+"/clinical-data?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;
            //console.log(items);
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
                console.log("pre-dynamic columns")
                console.log(result);
                var jsdata = JSON.parse(result);
                console.log(jsdata);
                // Dynamically adding up columns to webix datatable
                columnNames = Object.keys(jsdata.data[0]);

                var columns = [];
                for (var i=0; i<columnNames.length; i++)
                  columns.push({jsdata:columnNames[i], title:columnNames[i]});
          
                console.log(columns);

                this.dtable = new webix.ui({
                                container: "box",
                                view: "datatable",
                                autoheight: true,
                                autoConfig: true,
                                css: "checkbox_style",
                                id: "explist",
                                editable: true,
                                checkboxRefresh: true,
                                columns: columns,
                                data: jsdata,
                                datatype:"jsarray"                
                            });

                $$("explist").clearAll();
                $$("explist").parse(data);                
                $$("explist").refresh();

                /**$$("cbiodatatable").clearAll();
                $$("cbiodatatable").parse(data);                
                $$("cbiodatatable").refresh();**/
                console.log("datatable displayed");                          
                return
            }, function(err) {
            console.log(err);
            });    
        }
}

function clinical_Events(patientID){     
    
    try{
        var studyID = prompt("Please enter the Cancer StudyID", "lgg_ucsf_2014")

        if (studyID == null || studyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            studyID = studyID;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var sampleID = prompt("Please enter the PatientID or leave blank for selected Patient ID", "TCGA-OR-A5J2-01")

        if (sampleID == null) {
            throw new Error("User cancelled the prompt.");
        }else if (sampleID == "") {
            sampleID = patientID
        }else {
            sampleID = sampleID;
        }
    }
    catch(e){
        alert(e.message);
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
                patients_all: function() {
                    patients_all();
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
                gene_panelID: function() {
                    gene_panelID();                    
                    $(this).dialog("close");
                },
                main_CBioportal_Dialog: function() {
                    $("#maindialog").dialog("open"); 
                    $(this).dialog("close");                   
                }
            },
            width: "600px"             
            

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

function all_sampleIDs_in_samplelist(){
    try{
        var samplelistID = prompt("Please enter the Sample listid", "gbm_tcga")
        
        if (samplelistID == null || samplelistID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            samplelistID = samplelistID;
        }    
    }
    catch(e){
        alert(e.message);       
    }
        
    console.log(samplelistID);
    filename = "all_sampleIds_" + samplelistID    
    
    downloadurl = "http://www.cbioportal.org/api/sample-lists/"+ samplelistID+"/sample-ids?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

function clinical_attributes_studyID(){
    
    try{
        var studyID = prompt("Please enter the Cancer StudyID", "gbm_tcga")
        
        if (studyID == null || studyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            studyID = studyID;
        }    
    }
    catch(e){
        alert(e.message);       
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

function copy_number_segments(sampleID){
    try{
        var studyID = prompt("Please enter the Cancer StudyID", "acc_tcga")

        if (studyID == null || studyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            studyID = studyID;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var studysampleID = prompt("Please enter the study sample ID or leave blank for selected sampleID", "TCGA-OR-A5J2-01")
        

        if (studysampleID == null) {
            throw new Error("User cancelled the prompt.");
        }else if (studysampleID == "") {
            studysampleID = sampleID            
        }else{
            studysampleID = sampleID;            
        }
    }
    catch(e){
        alert(e.message);
    }
   

    filename = patientID +"_Copy_number_Segments"

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyID+"/samples/"+studysampleID+"/copy-number-segments?projection=SUMMARY&pageSize=20000&pageNumber=0&direction=ASC";

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
    try{
        var molecularProfileId = prompt("Please enter Molecular Profile ID", "acc_tcga_gistic")

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
        var sampleListId = prompt("Please enter Sample List ID", "acc_tcga_all")

        if (sampleListId == null || sampleListId == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            sampleListId = sampleListId;
        }    
    }
    catch(e){
        alert(e.message);
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

    try{
        var gene_panelID = prompt("Please enter Gene Panel ID", "NSCLC_UNITO_2016_PANEL")

        if (gene_panelID == null || gene_panelID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            gene_panelID = gene_panelID;
        }
    }
    catch(e){
        alert(e.message);
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

    try{
        var molecularProfileId = prompt("Please enter Molecular Profile ID", "acc_tcga_rna_seq_v2_mrna")

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
        var sampleListId = prompt("Please enter Study Sample List ID", "acc_tcga_all")

        if (sampleListId == null || sampleListId == "") {
            txt = "User cancelled the prompt.";
        }else {
            sampleListId = sampleListId;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var entrezGeneId = prompt("Please enter numeric Entrez Gene Id", "1")
        if (entrezGeneId == null || entrezGeneId == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            entrezGeneId = entrezGeneId;
        }
    }
    catch(e){
        alert(e.message);
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

function sampleList_in_sampleId(){
    try{
        var sampleListId = prompt("Please enter Sample ListId", "acc_tcga_mutations")

        if (sampleListId == null || sampleListId == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            sampleListId = sampleListId;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "Samplelist_4_"+ sampleListId 

    downloadurl = "http://www.cbioportal.org/api/sample-lists/" + sampleListId+"/sample-ids?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

    try{
        var molecularProfileId = prompt("Please enter Molecular Profile ID", "acc_tcga_mutations")

        if (molecularProfileId == null || molecularProfileId == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            molecularProfileId = molecularProfileId;
        }
    }
    catch(e){
        alert(e.message);
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

    try{
        var cancerstudyID = prompt("Please enter Cancer Study ID for the molecular profiles", "acc_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }
    }
    catch(e){
        alert(e.message);
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

function allcaselists_in_study(){
    try{
        var cancerStudyId = prompt("Please enter Cancer StudyId ", "gbm_tcga")

        if (cancerStudyId == null || cancerStudyId == "") {
            throw new Error("User cancelled the prompt.");            
        }else {
            cancerStudyId = cancerStudyId;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "allcaselists_in_study_"+ cancerStudyId    
    downloadurl = "https://www.cbioportal.org/webservice.do?cmd=getCaseLists&cancer_study_id="+cancerStudyId;
    console.log(downloadurl);
                  
    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;            
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



function samplelist_in_study(){
    try{
        var cancerStudyId = prompt("Please enter Cancer StudyId ", "gbm_tcga")

        if (cancerStudyId == null || cancerStudyId == "") {
            throw new Error("User cancelled the prompt.");            
        }else {
            cancerStudyId = cancerStudyId;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "samplelist_in_study_"+ cancerStudyId

    downloadurl = "https://www.cbioportal.org/api/studies/"+cancerStudyId+"/sample-lists?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
                  
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

function allsamples_patient_in_study(patientId){
    try{
        var cancerStudyId = prompt("Please enter Cancer StudyId ", "acc_tcga_mutations")

        if (cancerStudyId == null || cancerStudyId == "") {
            throw new Error("User cancelled the prompt.");            
        }else {
            cancerStudyId = cancerStudyId;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var sampleID = prompt("Please enter the PatientID or leave blank for selected Patient ID", "TCGA-OR-A5J2-01")

        if (sampleID == null) {
            throw new Error("User cancelled the prompt.");
        }else if (sampleID == "") {
            sampleID = patientID
        }else {
            sampleID = sampleID;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "allsamples_patient_in_study_"+ cancerStudyId +"_patientId_" + sampleID

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerStudyId+"/patients/"+sampleID+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
                  
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
        var cancerstudyID = prompt("Please enter Cancer Study ID for the mutations profiles", "acc_tcga_all")

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

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }    
    }
    catch(e){
        alert(e.message);
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

    try{
        var sampleID = prompt("Please enter the study patient ID or leave blank for selected Patient ID", "TCGA-02-0001")

        if (sampleID == null) {
            throw new Error("User cancelled the prompt.");
        }else if (sampleID == "") {
            sampleID = patientID
        }else {
            sampleID = sampleID;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }    
    }
    catch(e){
        alert(e.message);
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

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga_all")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }
    }
    catch(e){
        alert(e.message);
    }
    
    filename = "sampleList_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/sample-lists";

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

function sample_in_study(patientID){

    try{
        var sampleID = prompt("Please enter the study patient ID or leave blank for selected Patient ID", "TCGA-02-0001")

        if (sampleID == null) {
            throw new Error("User cancelled the prompt.");
        }else if (sampleID == "") {
            sampleID = patientID
        }else {
            sampleID = sampleID;
        }
    }
    catch(e){
        alert(e.message);
    }

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }    
    }
    catch(e){
        alert(e.message);
    }
  
    
    filename = "sample_in_Cancerstudy_"+ sampleID

    downloadurl = "http://www.cbioportal.org/api/studies/"+ cancerstudyID+ "/samples/"+ sampleID+"?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga_all")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }    
    }
    catch(e){
        alert(e.message);
    }
    
    filename = "all_samples_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/samples";

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

function tags_of_study(){
    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "tags_of_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/tags?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }
    }
    catch(e){
        alert(e.message);
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

function clinical_Data_4_study(){

    try{
        var studyId = prompt("Please enter cancer study ID", "gbm_tcga")

        if (studyId == null || studyId == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            studyId = studyId;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "clinical_Data_4_"+ studyId 

    downloadurl = "http://www.cbioportal.org/api/studies/"+studyId+"/clinical-data?clinicalDataType=SAMPLE&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";

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

    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }
    }
    catch(e){
        alert(e.message);
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

function geneExp_PTEN_EGFR_PDGFRA_TP53(){
    try{
        var genetic_profile_id = prompt("Please enter genetic_profile_id ", "gbm_tcga_mrna_U133_Zscores")

        if (genetic_profile_id == null || genetic_profile_id == "") {
            throw new Error("User cancelled the prompt.");            
        }else {
            genetic_profile_id = genetic_profile_id;
        }
    }
    catch(e){
        alert(e.message);
    }

    filename = "allcaselists_in_study_"+ cancerStudyId    
    downloadurl = "https://www.cbioportal.org/webservice.do?cmd=getCaseLists&cancer_study_id="+cancerStudyId;
    console.log(downloadurl);
                  
    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;            
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

function mutated_genes_in_study(){
    try{
        var cancerstudyID = prompt("Please enter Cancer StudyID ", "gbm_tcga")

        if (cancerstudyID == null || cancerstudyID == "") {
            throw new Error("User cancelled the prompt.");
        }else {
            cancerstudyID = cancerstudyID;
        }    
    }
    catch(e){
        alert(e.message);
    }

    filename = "mutated_genes_in_study_"+ cancerstudyID  

    downloadurl = "http://www.cbioportal.org/api/studies/"+cancerstudyID+"/significantly-mutated-genes?projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"
    console.log(downloadurl);
                  
    if (confirm('Do you want to download CSV data?')) {
        $(document).ready(function() {
        var JSONData = $.getJSON(downloadurl, function(data) {
            var items = data;            
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

function blood_multigeneexp_charts(samplelistid, molecularprofileid, sampleID,airbubble,blood,ink){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_rna_seq_v2_mrna_median_Zscores";   
        //entrezGeneId = "5728"; //1956=EGFR, 5728=PTEN, PDGFRA=5156, TP53=7157    
        PTEN_gene='5728';
        EGFR_gene='1956';
        PDGFRA_gene='5156';
        TP53_gene='7157';
        EPHB3_gene='2049';
        TLR2_gene = '7097';
        airbubble = airbubble;
        blood=blood;
        ink=ink;                
        geneexp_5728 = geneexp_data(molecularprofileid, samplelistid, PTEN_gene, sampleID);
        geneexp_1956 = geneexp_data(molecularprofileid, samplelistid, EGFR_gene, sampleID);
        geneexp_5156 = geneexp_data(molecularprofileid, samplelistid, PDGFRA_gene, sampleID);
        geneexp_7157 = geneexp_data(molecularprofileid, samplelistid, TP53_gene, sampleID);
        geneexp_2049 = geneexp_data(molecularprofileid, samplelistid, EPHB3_gene, sampleID);
        geneexp_7097 = geneexp_data(molecularprofileid, samplelistid, TLR2_gene, sampleID);

        var PTEN_gene = {
          x: blood,
          y: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097,
          type: 'scatter',
          name: 'bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]
        };

        var data =[PTEN_gene];

        var layout = {title: "PTEN-PDGFRA-EGFR-TP53-EPHB3-TLR2 combined GeneExpressions for TCGA Bloody slides",
          xaxis: {
                title: {
                  text: 'Blood',
                  font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                  }
                },
              },
          yaxis: {
                title: {
                  text: 'PTEN TP53 PDGFRA EGFR EPHB3 TLR2 Gene Expression',
                  font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                  }
                }
              },
        };
        
        Plotly.newPlot("plotly_div", data, layout);

}

function geneexp_data(molecularprofileid,sampleid,entrezGeneId,patientID){

    molecularProfileId = molecularprofileid;
    sampleListId = sampleid;
    entrezGeneId = entrezGeneId

    downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularProfileId+"/molecular-data?sampleListId="+sampleListId+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
    promise = makePromise(downloadurl);
    promise.then(function(result){        
        var JSONData = $.getJSON(downloadurl, function(data){
        var items = data;    
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(items[0]);
        let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')));
        csv.unshift(header.join(','));
        csv = csv.join('\r\n');

        lines = csv.split(/\r\n|\n/);

        var uniqueSampleKey = [];
        var uniquePatientKey = [];
        var entrezGeneId = [];
        var molecularprofileid = [];
        var sampleId = [];
        var patientId = [];
        var studyId=[];
        var geneexp = [];

        var headings = lines[0].split('');

        for (var j=1; j<lines.length; j++) {
        var values = lines[j].split(''); // Split up the comma seperated values
           // We read the key,1st, 2nd and 3rd rows 
           uniqueSampleKey.push(parseFloat(values[0]));
           uniquePatientKey.push(parseFloat(values[1])); 
           entrezGeneId.push(parseFloat(values[2]));
           molecularprofileid.push(parseFloat(values[3]));
           sampleId.push(parseFloat(values[0]));
           patientId.push(parseFloat(values[1])); 
           studyId.push(parseFloat(values[2]));
           geneexp.push(parseFloat(values[3]));
        }
        
        if (patientId = patientID){
            geneexp = geneexp;
            return geneexp;
        }
        
    })
    
    })

}

function blood_combinedgeneexp_charts(samplelistid, molecularprofileid, patientID,airbubble,blood,ink){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_rna_seq_v2_mrna_median_Zscores";   
        //entrezGeneId = "5728"; //1956=EGFR, 5728=PTEN, PDGFRA=5156, TP53=7157    
        PTEN_gene='5728';
        EGFR_gene='1956';
        PDGFRA_gene='5156';
        TP53_gene='7157';
        EPHB3_gene = '2049';
        TLR2_gene = '7097';
        airbubble = airbubble;
        blood=blood;
        ink=ink;                
        geneexp_5728 = geneexp_data(molecularprofileid, samplelistid, PTEN_gene, patientID);
        geneexp_1956 = geneexp_data(molecularprofileid, samplelistid, EGFR_gene, patientID);
        geneexp_5156 = geneexp_data(molecularprofileid, samplelistid, PDGFRA_gene, patientID);
        geneexp_7157 = geneexp_data(molecularprofileid, samplelistid, TP53_gene, patientID);
        geneexp_2049 = geneexp_data(molecularprofileid, samplelistid, EPHB3_gene, patientID);
        geneexp_7097 = geneexp_data(molecularprofileid, samplelistid, TLR2_gene, patientID);


        var PTEN_gene = {
          x: blood,
          y: geneexp_5728,          
          type: 'scatter',
          name: 'PTEN_bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]
        };

        var PDGFRA_gene = {
          x: blood,
          y: geneexp_7157,
          xaxis: 'x2',          
          yaxis: 'y2',                              
          type: 'scatter',
          name: 'PDGFRA_bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]

        };

        var EGFR_gene = {
          x: blood,
          y: geneexp_5156,
          xaxis: 'x3',  
          yaxis: 'y3',
          type: 'scatter',
          name: 'EGFR_bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]

        };

        var TP53_gene = {
          x: blood,
          y: geneexp_7157,
          xaxis: 'x4',
          yaxis: 'y4',         
          type: 'scatter',
          name: 'TP53_bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]        };

        var EPHB3_gene = {
          x: blood,
          y: geneexp_2049,
          xaxis: 'x5',  
          yaxis: 'y5',
          type: 'scatter',
          name: 'EPHB3_bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]

        };

        var TLR2_gene = {
          x: blood ,
          y: geneexp_7097,
          xaxis: 'x6',
          yaxis: 'y6',         
          type: 'scatter',
          name: 'TLR2_bloody',
          mode: 'markers',
          transforms: [{
            type: 'aggregate',
            groups: geneexp_5728, geneexp_7157, geneexp_5156, geneexp_1956, geneexp_2049,geneexp_7097, sampleID,
             aggregations: [
                  {target: 'y', func: 'avg', enabled: true},
                ]
            }]
        };

        var data = [PTEN_gene, PDGFRA_gene, EGFR_gene, TP53_gene, EPHB3_gene, TLR2_gene];

        var layout = {
          grid: {rows: 2, columns: 3, pattern: 'independent'},
          yaxis: {title:'PTEN Expresson'},
          yaxis2: {title: 'PDGFRA Expression'},
          yaxis3: {title: 'EGFR Expression'},
          yaxis4: {title: 'TP53 Expression'},
          yaxis5: {title: 'EPHB3 Expression'},
          yaxis6: {title: 'TLR2 Expression'}           
        
        };

        Plotly.newPlot("plotly_div", data, layout);

}

function pten_3d_charts(samplelistid, molecularprofileid, patientID,airbubble,blood,ink){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_rna_seq_v2_mrna_median_Zscores";   
        //entrezGeneId = "5728"; //1956=EGFR, 5728=PTEN, PDGFRA=5156, TP53=7157    
        PTEN_gene='5728';
        EGFR_gene='1956';
        PDGFRA_gene='5156';
        TP53_gene='7157';
        EPHB3_gene = '2049';
        TLR2_gene = '7097';
        airbubble = airbubble;
        blood=blood;
        ink=ink;                
        geneexp_5728 = geneexp_data(molecularprofileid, samplelistid, PTEN_gene, patientID);
        geneexp_1956 = geneexp_data(molecularprofileid, samplelistid, EGFR_gene, patientID);
        geneexp_5156 = geneexp_data(molecularprofileid, samplelistid, PDGFRA_gene, patientID);
        geneexp_7157 = geneexp_data(molecularprofileid, samplelistid, TP53_gene, patientID);
        geneexp_2049 = geneexp_data(molecularprofileid, samplelistid, EPHB3_gene, patientID);
        geneexp_7097 = geneexp_data(molecularprofileid, samplelistid, TLR2_gene, patientID);


        // var PTEN_gene = {
        //     x:patientID, y: geneexp_5728, z: blood,
        //     mode: 'markers',
        //     marker: {
        //         size: 12,
        //         line: {
        //         color: 'rgba(217, 217, 217, 0.14)',
        //         width: 0.5},
        //         opacity: 0.8},
        //     type: 'scatter3d'
        // };

        // var EGFR_gene = {
        //     x:patientID, y: geneexp_1956, z: blood,
        //     mode: 'markers',
        //     marker: {
        //         color: 'rgb(127, 127, 127)',
        //         size: 12,
        //         symbol: 'circle',
        //         line: {
        //         color: 'rgb(204, 204, 204)',
        //         width: 1},
        //         opacity: 0.8},
        //     type: 'scatter3d'
        // };

        // console.log("crossed plotting");

        // var data = [PTEN_gene, EGFR_gene];
        // var layout = {margin: {
        //     l: 0,
        //     r: 0,
        //     b: 0,
        //     t: 0
        //   }};

        Plotly.newPlot('plotly_div', [{
          type: 'scatter3d',
          mode: 'lines',
          x:patientID, y: geneexp_1956, z: blood * 5,
          opacity: 1,
          line: {
                width: 6,                
                reversescale: false
                }
            }], {
          height: 640
        });



        // var layout = {
        //   grid: {rows: 2, columns: 3, pattern: 'independent'},
        //   yaxis: {title:'PTEN Expresson'},
        //   yaxis2: {title: 'PDGFRA Expression'},
        //   yaxis3: {title: 'EGFR Expression'},
        //   yaxis4: {title: 'TP53 Expression'},
        //   yaxis5: {title: 'EPHB3 Expression'},
        //   yaxis6: {title: 'TLR2 Expression'}           
        
        // };

    //    Plotly.newPlot("plotly_div", data, layout);
        console.log("plotting done");
}