config = {}
//config.BASE_URL = "http://candygram.neurology.emory.edu:8080/api/v1"
config.BASE_URL = "http://digitalslidearchive.emory.edu:8080/girder_root/api/v1"

var rnd_selected = [];
var nb_selected = [];
var blood_selected = [];

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
    url: config.BASE_URL + "/item?folderId=5ae351e792ca9a0020d95e50&limit=150&sort=lowerName&sortdir=1&height=" + thumbHeight, 
    type: "smallThumb",    
    "select": true,
    "multiselect": true,
    "on": {
        'onAfterSelect': function(id) {
            var ar_selected = $$("slideDataview").getSelectedItem(true);
                if (ar_selected.length == 1) {
                    single_select(ar_selected[0])
                } else {                                                              
                    multi_select(ar_selected)                    
                }
             },
        'onItemClick': function(id) {
            console.log(this.getSelectedItem(id))  
        }
    },       
    scheme: {
        $init: function(obj) {
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
                        
        //studyID=Cancer_Grading.substring(0,3);      
        $("#maindialog").dialog({
            autoOpen: false,
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
    $("#maindialog").dialog("close");    
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
    var nb_selection = []
    slideRecords.each(function(obj) {        
        name.push(obj.name);
        patientID.push(obj.name.substring(0,12));        
        sampleID.push(obj.name.substring(0,15));        

        tags.push(obj.meta.tags);        
        airbubble.push(obj.meta.tags['AirBubble']);        
        blood.push(obj.meta.tags['Blood']);        
        ink.push(obj.meta.tags['Ink']);                
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mrna"; 
        entrezGeneId = $$("gene_options").getValue();       
    } )//end of slideRecords

   
    $("#genedialog").dialog({
        autoopen: true,
        wait:300,
        buttons: {
            mutations_forpatients_charts: function(){
                var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");                
                mutations_forpatients_charts(samplelistid, molecularprofileid, patientID, sampleID, entrezGeneId);
                $(this).dialog("close");                    
            },
            mrna_expressions_forpatients_charts:function(){
                var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");
                mrna_forpatients_charts(samplelistid, molecularprofileid, patientID, sampleID, entrezGeneId)
                $(this).dialog("close");                    
            },
            cna_forpatients_charts: function(){
                var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");
                dis_cna_forpatients_charts(samplelistid, molecularprofileid, patientID, sampleID, entrezGeneId)        
                $(this).dialog("close");                    
            }
        },
        width: "600px"
    })
}

// function nb_select(){       
//      var nb_selection = prompt("Do you want to include Non Blood Slides?", "1 for Yes, 0 for No?")
//        try{
//            if (nb_selection == "1"){
//             $$("slideDataview").filter(function(obj) { if(obj.meta.tags.Blood =="No") return true;  } )
//             var nb_selected = $$("slideDataview").getSelectedItem(true);
//             $("#maindialog").dialog("close");            
//             return nb_selected            
//             }          
//        } // end try
//        catch(e){
//         alert(e.message);
//        }
// }

slideDataDT = {
                view: "datatable",
                autoConfig: true,
                css: "checkbox_style",
                id: "slidelist",
                editable: true,
                checkboxRefresh: true, 
                spans:true,
                select:"row",
                multiselect: true,
                scrollX:false,                                               
                url : config.BASE_URL + "/item?folderId=5ae351e792ca9a0020d95e50&limit=200&sort=lowerName&sortdir=1&height=" + thumbHeight,                
            };

var dataViewControls = {
    cols: [{
            view: "button",
            id: "btnBloodySlides",
            label: "Bloody Slides",           
            click: function(id) {                
                $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="Yes") return true;  });
                var blood_selected = $$("slideDataview").getSelectedItem(true);

            }
        },
        {
            view: "button",
            id: "btnNonBloodySlides",
            label: "Non Bloody Slides",            
            click: function(id) {            
                $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="No") return true;  } );
                var nb_selected = $$("slideDataview").getSelectedItem(true);           
            }          
        },
        {
            view: "button",
            id: "btnRandomSlides",
            label: "Random Slides",
            click: function(id) {                      
                $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="Not Sure") return true;});
                var rnd_selected = $$("slideDataview").getSelectedItem(true);                          
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
                             {   
                               view:"combo", 
                                id:"gene_options", 
                                label:"Gene Name", 
                                value:"5156", 
                                options:[   
                                    {id:5156, value:"PDGFRA"}, 
                                    {id:1956, value:"EGFR"}, 
                                    {id:5728, value:"PTEN"},
                                    {id:7157, value:"TP53"}        
                                ]                                
                             },
                            {   
                                view:"combo", 
                                id:"gene_functions", 
                                label:"Genetic Functions", 
                                value:"1", 
                                options:[   
                                    {id:1, value:"mRNA Expression"}, 
                                    {id:2, value:"Mutations"},
                                    {id:3, value:"Discrete Copy Number Alterations"}        
                                ] 
                            },
                            {   
                                view:"combo", 
                                id:"grp_cmp_functions", 
                                label:"Group Comparisons Functions", 
                                value:"1", 
                                options:[   
                                    {id:1, value:"mRNA Expression-lgg vs gbm"}, 
                                    {id:2, value:"Mutations-lgg vs gbm"},
                                    {id:3, value:"Discrete Copy Number Alterations-lgg vs gbm"}        
                                ] 
                            },
                            {   
                                view:"combo", 
                                id:"graphing_functions", 
                                label:"Various Graph Functions", 
                                value:"1", 
                                options:[   
                                    {id:1, value:"bloody_nonbloody_geneexp_charts"}, 
                                    {id:2, value:"mrna_combinedgeneexp_charts"}                                                                    
                                ] 
                            },
                            //slidelist,                           
                            dataViewControls,
                            rajsFirstDataView,
                            {
                                view: "template",
                                template: sliderTemplate,
                                id: "sliderdata",
                                gravity: 0.2
                            },                            
                        ]
                    },
                    // { view: "resizer" },
                    // explist,
                    { view: "resizer"},
                    { view: "template", content: "plotly_div" },
                    { view: "resizer"}                             
                ]
            },
        ]
})

$$("gene_options").attachEvent("onChange", function(newv,oldv){
    genefunctions = $$("gene_functions").getInputNode().value 
    entrezGeneId = $$("gene_options").getValue();    
    GeneName = $$("gene_options").getInputNode().value  

    if (genefunctions == "mRNA Expression"){
        mrna_forgenes_charts(entrezGeneId, GeneName);            
    } else if(genefunctions == "Discrete Copy Number Alterations"){
        dis_cna_forgenes_charts(entrezGeneId, GeneName);
    } else { 
        mutations_forgenes_charts(entrezGeneId, GeneName);
    }
});

$$("grp_cmp_functions").attachEvent("onChange", function(newv,oldv){
    genefunctions = $$("gene_functions").getInputNode().value 
    entrezGeneId = $$("gene_options").getValue();    
    GeneName = $$("gene_options").getInputNode().value 
    grp_cmp_functions = $$("grp_cmp_functions").getInputNode().value

    if (grp_cmp_functions == "mRNA Expression-lgg vs gbm"){        
        mrna_forgenes_charts_grouped(entrezGeneId, GeneName);            
    } else if(grp_cmp_functions == "Discrete Copy Number Alterations-lgg vs gbm"){
        console.log("am in the CNA group")
        dis_cna_forgenes_charts_grouped(entrezGeneId, GeneName);
    } else if(grp_cmp_functions == "Mutations-lgg vs gbm") { 
        console.log("am in mutations group")
        mutations_forgenes_charts_grouped(entrezGeneId, GeneName);
    }
});

$$("gene_functions").attachEvent("onChange", function(newv,oldv){        
    genefunctions = $$("gene_functions").getInputNode().value 
    entrezGeneId = $$("gene_options").getValue();    
    GeneName = $$("gene_options").getInputNode().value

    if (genefunctions == "mRNA Expression"){
        mrna_forgenes_charts(entrezGeneId, GeneName);            
    } else if(genefunctions == "Discrete Copy Number Alterations"){
        dis_cna_forgenes_charts(entrezGeneId, GeneName);
    } else { 
        mutations_forgenes_charts(entrezGeneId, GeneName);
    }   
        
});

$$("graphing_functions").attachEvent("onChange", function(newv,oldv){        
    genefunctions = $$("gene_functions").getInputNode().value 
    entrezGeneId = $$("gene_options").getValue();    
    GeneName = $$("gene_options").getInputNode().value
    graphing_functions = $$("graphing_functions").getInputNode().value

    if (graphing_functions == "bloody_nonbloody_geneexp_charts"){
        console.log("in blood")        
       $("#genedialog").dialog({
            autoopen: true,
            wait:300,
            buttons: {
                mutations_forpatients_charts: function(){
                    var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");                
                    mutations_forblood_charts(entrezGeneId);                    
                    $(this).dialog("close");                    
                },
                mrna_expressions_forpatients_charts:function(){
                    var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");
                    mrna_forblood_charts(entrezGeneId)
                    $(this).dialog("close");                    
                },
                cna_forpatients_charts: function(){
                    var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");
                    dis_cna_forblood_charts(entrezGeneId)        
                    $(this).dialog("close");                    
                }
            },
            width: "600px"
        })
    }else {        
            var entrezGeneId = prompt("Please enter the entrezGeneId", "5728:PTEN,1956:EGFR,7157:TP53,5156:PDGFRA");                
            //$(this).dialog("close");

            $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="Yes") return true;}) 
            $$("slideDataview").selectAll();
            var blood_selected = $$('slideDataview').getSelectedItem(true);        

            $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="No") return true;}) 
            $$("slideDataview").selectAll();
            var nb_selected = $$('slideDataview').getSelectedItem(true);
            
            mRNAcharts_allBloodNonblood(blood_selected, nb_selected, entrezGeneId)
    }
});

});

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

function blood_combinedgeneexp_charts(samplelistid, molecularprofileid, sampleID,airbubble,blood,ink){
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

        console.log(patientID);
        console.log(patientId);
        
        if (patientId == patientID){
            console.log(patientID);
            console.log(patientId);
            geneexp = geneexp;
            console.log(geneexp);
            return geneexp;
        }
        
    })
    
    })

}
         
function mrnaexp_data_for_gene(molecularprofileid,samplelistid,entrezGeneId){
}

function dis_cna_forgenes_charts(entrezGeneId, GeneName){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_gistic";   

        entrezGeneId = entrezGeneId;
        GeneName = GeneName;
          
        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/discrete-copy-number?sampleListId="+samplelistid+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var alterationsvalue = [];
            var sampleID = [];
            var mutationtype = [];
            //var entrezGeneId = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    sampleID[i] = item['sampleId'];
                    alterationsvalue[i] = item['alteration'];
                    entrezGeneId[i] = item['entrezGeneId'];                    
                   }      

            yvalue = alterationsvalue;            
            xvalue = entrezGeneId;            
            //yvalue = sampleID;            

            hovertext = "GBM-Copynumber_alterations, entrezGeneID-wise (GISTIC study)";

            var data = [{
                type: 'bar',
                x: xvalue,
                y: yvalue,                                
                transforms: [{
                    type: 'groupby',
                    groups: xvalue
                }]
            }]

            var layout = {
                title: hovertext,
                barmode: 'relative',
                bargap:0.25,
                bargroupgap:0.1,
                xaxis: {
                        title: {
                            text: 'Entrez GeneID'
                        },   
                        range: [10,77000]                                        
                        },    
                yaxis: {
                    title: {
                        text: 'Genes CNA Values for GBM',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                            }
                        }                
            };
            
            Plotly.newPlot("plotly_div", data, layout);

          })
      })
};

function dis_cna_forgenes_charts_grouped(entrezGeneId, GeneName){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_gistic";   

        //entrezGeneId = entrezGeneId;
        GeneName = GeneName;
          
        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/discrete-copy-number?sampleListId="+samplelistid+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        
        promise = makePromise(downloadurl);

        samplelistidlgg = "lgg_tcga_all";
        molecularprofileidlgg = "lgg_tcga_gistic"
        downloadlgg = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileidlgg+"/discrete-copy-number?sampleListId="+samplelistidlgg+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        promiselgg = makePromise(downloadlgg);


        promise.then(function(result){        
        promiselgg.then(function(result){
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var alterationsvalue = [];
            var sampleID = [];            
            var entrezGeneId = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    sampleID[i] = item['sampleId'];
                    alterationsvalue[i] = item['alteration'];
                    entrezGeneId[i] = item['entrezGeneId'];                    
                   }      

            yvalue = alterationsvalue;            
            xvalue = entrezGeneId;   
            
            var JSONlgg = $.getJSON(downloadlgg, function(data){
            var itemslgg = data;
            var alterationsvaluelgg = [];
            var sampleIDlgg = [];
            var entrezGeneIdlgg = [];

            for (var i = 0; i < itemslgg.length; i++) {
                    itemlgg = itemslgg[i]; 
                    sampleIDlgg[i] = itemlgg['sampleId'];
                    alterationsvaluelgg[i] = itemlgg['alteration'];
                    entrezGeneIdlgg[i] = itemlgg['entrezGeneId'];                    
                   }      

            yvaluelgg = alterationsvaluelgg;            
            xvaluelgg = entrezGeneIdlgg;                        

            hovertext = "Putative copy-number alterations from GISTIC";

            var trace1 = {
              x: xvalue,
              y: yvalue,
              name: 'GBM', 
              type: 'bar',              
              transforms: [{
                    type: 'groupby',
                    groups: xvalue
                }]
            };

            var trace2 = {
              x: xvaluelgg,
              y: yvaluelgg,
              name: 'lgg',
              type: 'bar',              
              transforms: [{
                    type: 'groupby',
                    groups: xvaluelgg
                }]
            };

            var data = [trace1, trace2];

            var layout = {
                title: hovertext,
                barmode: 'group',
                bargap:0.25,
                bargroupgap:0.1,
                barnorm:'percent',
                xaxis: {
                    title: {
                        text: 'Entrez GeneID'
                    },
                yaxis: {
                    title: {
                        text: 'Genes CNA Values',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                            }
                        }
                    }
            };

            Plotly.newPlot('plotly_div', data, layout);

            })

          })
        })
      })
};

function mutations_forpatients_charts(samplelistid, molecularprofileid, patientID, sampleID, entrezGeneId){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mutations";   

        entrezGeneId = entrezGeneId;
        selectedsampleID = sampleID;  
        //GeneName = GeneName;       

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/mutations?sampleListId="+samplelistid+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        
        promise = makePromise(downloadurl);

        promise.then(function(result){
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;

            var mutationtype = []
            var sampleID = []


        for (var i = 0; i < items.length; i++) {
            item = items[i]; 
            for (var j = 0; j<selectedsampleID.length; j++){                                
                if ( (item['sampleId'] == selectedsampleID[j]  && item['entrezGeneId'] == entrezGeneId)) 
                    {
                        sampleID[i] = item['sampleId'];                
                        mutationtype[i] = item['mutationType'];                
                    }
            }                    
        }     

            xvalue = sampleID;                        
            yvalue = mutationtype; 

            hovertext = "EntrezGeneId: "+entrezGeneId + " Mutation Type of GBM";

            var data = [{
                type: 'bar',
                x: xvalue,
                y: yvalue,                
                transforms: [{
                    type: 'sort',
                    target: yvalue
                }]
            }]           

            var layout = {
                title: hovertext,
                barmode: 'relative',
                bargap:0.25,
                bargroupgap:0.1,
                xaxis: {
                    title: {
                        text: 'SampleID'
                    },
                yaxis: {
                    title: {
                        text: 'Mutation Types',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                      }
                }
                }
            };
            
            Plotly.newPlot("plotly_div", data, layout);
        })
    })
}

function mutations_forgenes_charts(entrezGeneId, GeneName){

        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mutations";   

        //entrezGeneId = entrezGeneId;
        GeneName = GeneName;
          
        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/mutations?sampleListId="+samplelistid+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var sampleID = [];
            var mutationtype = [];
            var entrezGeneId = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    sampleID[i] = item['sampleId'];
                    mutationtype[i] = item['mutationType'];
                    entrezGeneId[i] = item['entrezGeneId'];                    
                   }      

            xvalue = mutationtype;            
            yvalue = entrezGeneId;            

            hovertext = "EntrezGeneId: "+ entrezGeneId+" Grouped Gene Mutations, entrezGeneID wise for GBM";

            var data = [{
                type: 'bar',
                x: xvalue,
                y: yvalue,                
                transforms: [{
                    type: 'groupby',
                    groups: xvalue
                }]
            }]

            var layout = {title: hovertext, barmode: 'overlay', bargap:0.25, bargroupgap:0.1, barnorm:'percent',
                xaxis: {
                    title: {
                      text: 'Mutation Types of GBM',
                      font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                      }
                    },
                  },
                  yaxis: {
                    title: {
                      text: 'Entrez GeneID',
                      font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                      }
                    }
                  }};
            
            Plotly.newPlot("plotly_div", data, layout);

          })
      })
}

function mutations_forgenes_charts_grouped(entrezGeneId, GeneName, sampleID){        
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mutations";   

        //entrezGeneId = entrezGeneId;
        GeneName = GeneName;
        
        selectedsampleID = sampleID;  
        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/mutations?sampleListId="+samplelistid+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        
        samplelistidlgg = "lgg_tcga_all";
        molecularprofileidlgg = "lgg_tcga_mutations";
        downloadlgg = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileidlgg+"/mutations?sampleListId="+samplelistidlgg+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC"
        
        promise = makePromise(downloadurl);
        promiselgg = makePromise(downloadlgg);

        promise.then(function(result){        
        promiselgg.then(function(result){

            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var sampleID = [];
            var mutationtype = [];
            var entrezGeneId = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    sampleID[i] = item['sampleId'];
                    mutationtype[i] = item['mutationType'];
                    entrezGeneId[i] = item['entrezGeneId'];                    
                   }      

            xvalue = mutationtype;            
            //yvalue = entrezGeneId;            
            yvalue = sampleID;            

            var JSONlgg = $.getJSON(downloadlgg, function(data){
            var itemslgg = data;
            
            var sampleIDlgg = [];
            var mutationtypelgg = [];
            var entrezGeneIdlgg = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    sampleIDlgg[i] = item['sampleId'];
                    mutationtypelgg[i] = item['mutationType'];
                    entrezGeneId[i] = item['entrezGeneId'];                    
                   }      

            xvaluelgg = mutationtypelgg;            
            //yvaluelgg = entrezGeneIdlgg;
            yvaluelgg = sampleIDlgg;   

            hovertext = "Grouped Gene Mutations, entrezGeneID wise for GBM vs LGG";
            
            var trace1 = {
              x: xvalue,
              y: yvalue,
              name: 'GBM',
              type: 'bar',                            
              transforms: [{
                    type: 'groupby',
                    groups: xvalue
                }]
            };

            var trace2 = {
              x: xvaluelgg,
              y: yvaluelgg,
              name: 'lgg',
              type: 'bar',              
                transforms: [{
                    type: 'groupby',
                    groups: xvaluelgg
                }]
            };

            //hovertext = GeneName + " Mutations";

            var data = [trace1, trace2];

            var layout = {title: hovertext, barmode: 'group', bargap:0.25, bargroupgap:0.1, barnorm:'percent'};

            Plotly.newPlot('plotly_div', data, layout);

            })
            })

          })
      })
}

function mrna_forgenes_charts(entrezGeneId, GeneName){

        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mrna";   
        entrezGeneId = entrezGeneId;
        GeneName = GeneName;        
        var mrna_exp = []
   
        //mrna_exp = mrnaexp_data_for_gene(molecularprofileid, samplelistid, entrezGeneId); 

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/molecular-data?sampleListId="+samplelistid+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var mrnavalue = [];
            var sampleID = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    sampleID[i] = item['sampleId'];
                    mrnavalue[i] = item['value'];                
                   }      

            xvalue = sampleID;            
            yvalue = mrnavalue;

            hovertext = GeneName + " mRNA Expression";

            var data = [{
                type: 'bar',
                x: xvalue,
                y: yvalue,                
                transforms: [{
                    type: 'sort',
                    target: yvalue
                }]
            }]

            var layout = {
                title: hovertext,
                barmode: 'relative',
                bargap:0.25,
                bargroupgap:0.1,
                xaxis: {
                    title: {
                        text: 'SampleID'
                    },
                yaxis: {
                    title: {
                        text: 'mRNA expression',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                      }
                }
                }
            };
            
            Plotly.newPlot("plotly_div", data, layout);

          })
      })
};

function mrna_forpatients_charts(samplelistid, molecularprofileid, patientID, sampleID, entrezGeneId, GeneName){ 
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mrna";   
        entrezGeneId = entrezGeneId;
        GeneName = GeneName;    
        selectedsampleID = sampleID;    
        var mrna_exp = []               

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/molecular-data?sampleListId="+samplelistid+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var mrnavalue = [];
            var sampleID = [];
            

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                        for (var j = 0; j<selectedsampleID.length; j++){    
                            //console.log(item['sampleId']);                        
                            if ((selectedsampleID[j] == item['sampleId']) && item['entrezGeneId'] == entrezGeneId) 
                                {
                                    sampleID[i] = item['sampleId'];
                                    mrnavalue[i] = item['value']; 
                                }                           
                        }                    
                }      

            xvalue = sampleID;            
            yvalue = mrnavalue; 

            hovertext = "EntrezGeneId: "+entrezGeneId + " mRNA Expression for GBM";

            var data = [{
                type: 'bar',
                x: xvalue,
                y: yvalue,                
                transforms: [{
                    type: 'sort',
                    target: yvalue
                }]
            }]           

            var layout = {
                title: hovertext,
                barmode: 'relative',
                bargap:0.25,
                bargroupgap:0.1,
                xaxis: {
                    title: {
                        text: 'SampleID'
                    },
                yaxis: {
                    title: {
                        text: 'mRNA expression',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                      }
                }
                }
            };
            
            Plotly.newPlot("plotly_div", data, layout);
          })
      })
};

function dis_cna_forpatients_charts(samplelistid, molecularprofileid, patientID, sampleID, entrezGeneId){ 
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_gistic";   

        entrezGeneId = entrezGeneId;
        //GeneName = GeneName;
        selectedsampleID = sampleID;    
          
        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/discrete-copy-number?sampleListId="+samplelistid+"&projection=SUMMARY&pageSize=10000000&pageNumber=0&direction=ASC";
        
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var alterationsvalue = [];
            var sampleID = [];
            
            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                        for (var j = 0; j<selectedsampleID.length; j++){                                
                            if ((selectedsampleID[j] == item['sampleId']  && item['entrezGeneId'] == entrezGeneId )) 
                            {
                                sampleID[i] = item['sampleId'];
                                alterationsvalue[i] = item['alteration']
                            };                            
                                                        
                        }                    
                }      

            xvalue = sampleID;
            yvalue = alterationsvalue;             

            hovertext = "EntrezGeneId: "+entrezGeneId + " CNV value for GBM";

            var data = [{
                type: 'bar',
                x: xvalue,
                y: yvalue,                
                transforms: [{
                    type: 'sort',
                    target: yvalue
                }]
            }]           

            var layout = {
                title: hovertext,
                barmode: 'relative',
                bargap:0.25,
                bargroupgap:0.1,
                xaxis: {
                    range: [0,10],
                    title: {
                        text: 'SampleID'
                        },
                    },                                                            
                yaxis: {
                    range: [0,7],
                    title: {
                        text: 'CNV values',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                      },
                      
                }
                }

                Plotly.newPlot("plotly_div", data, layout);
            });
            
            
          })
      //})
};

function blood_mrna_exp_charts(entrezGeneId, GeneName){                
        //var bloodyslides = $$("slideDataview").queryView(function(view){return (view.meta.tags.Blood == "No")});
        $$("slideDataview").filter(function(obj) {if(obj.meta.tags.Blood =="Yes") return true;  } )
        $$("slideDataview").select();
        var bloodyslides = $$("slideDataview").getSelectedItem(true);
        var bloodyslides = webix.toArray(bloodyslides);
        
        var blood_sampleID = []
        var blood_patientID = []
        var blood_name = []
        bloodyslides.each(function(obj) {        
            blood_name.push(obj.name);
            blood_patientID.push(obj.name.substring(0,12));        
            blood_sampleID.push(obj.name.substring(0,15));                         
        })
        //console.log(bloodyslides);
        
        $$("slideDataview").filter(function(obj) {if(obj.meta.tags.Blood =="No") return true;  } )
        $$("slideDataview").select();
        var nb_slides = $$("slideDataview").getSelectedItem(true);

        var nb_slides = webix.toArray(nb_slides);
        var nb_sampleID = []
        var nb_patientID = []
        var nb_name = []
        nb_slides.each(function(obj) {        
            nb_name.push(obj.name);
            nb_patientID.push(obj.name.substring(0,12));        
            nb_sampleID.push(obj.name.substring(0,15));                         
        })
     
     
        //console.log(nb_slides);

        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mrna";   
        entrezGeneId = entrezGeneId;
        GeneName = GeneName;        
        var mrna_exp = []

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/molecular-data?sampleListId="+samplelistid+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var mrnavalue = [];
            var sampleID = [];         
            var samplenb =[];
            var mrnavaluenb = [];   

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                        for (var j = 0; j<bloodyslides.length; j++){                                
                            if (bloodyslides[j].blood_sampleID == item['sampleId']) {sampleID[i] = item['sampleId']};
                            mrnavalue[i] = item['value'];                            
                        }                 
                }

            xvalue = sampleID;
            //console.log(xvalue);
            yvalue = mrnavalue;
            //console.log(yvalue);
    

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                        for (var j = 0; j<nb_slides.length; j++){                                
                            if (nb_slides[j].nb_sampleID == item['sampleId']) {samplenb[i] = item['sampleId']};
                            mrnavaluenb[i] = item['value'];                            
                        }                    
                }

            samplenb = samplenb;
            //console.log(samplenb);
            mrnavaluenb = mrnavaluenb;   
            //console.log(mrnavaluenb);

            hovertext = "EntrezGeneId:" + entrezGeneId + ": Blood vs NonBlood mRNA Expression";

            var trace1 = { 
                x: xvalue,
                y: yvalue,
                name: 'Agilent microarray mRNA expression - GBM - Blood',
                type: 'bar',
                transforms: [{
                    type: 'sort',
                    target: yvalue,
                    order: 'ascending'
                }]
            };

            var trace2 = {
                x: samplenb,                
                y: mrnavaluenb,
                name: 'Agilent microarray mRNA expression - Non Blood',
                type: 'bar',
                transforms: [{
                    type: 'sort',
                    target: mrnavaluenb,
                    order: 'ascending'
                }]

            };

            var layout = {
                title: hovertext,
                xaxis: {
                    title: {
                        text: 'SampleID'
                    },
                yaxis: {
                    title: {
                        text: 'mRNA expression',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                      }
                }
                }
            };


            var data = [trace1, trace2]            

            Plotly.newPlot("plotly_div", data, layout);
           
           }) 
          })
};              

function mrna_forgenes_charts_grouped(entrezGeneId, GeneName){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mrna";   
        entrezGeneId = entrezGeneId;
        GeneName = GeneName;        
        var mrna_exp = []

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/molecular-data?sampleListId="+samplelistid+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
        promise = makePromise(downloadurl);

        samplelistid1 = "lgg_tcga_all";        
        molecularprofileid1 = "lgg_tcga_mrna"; //"lgg_tcga_pan_can_atlas_2018_rna_seq_v2_mrna";
        downloadlgg = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid1+"/molecular-data?sampleListId="+samplelistid1+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY"
        promiselgg = makePromise(downloadlgg)

        promise.then(function(result){        

        promiselgg.then(function(result){

            var JSONData = $.getJSON(downloadurl, function(data){
            var items = data;
            
            var mrnavalue = [];
            var sampleID = [];

            for (var i = 0; i < items.length; i++) {
                    item = items[i]; 
                    if (entrezGeneId == item['entrezGeneId']){
                        sampleID[i] = item['sampleId'];
                        mrnavalue[i] = item['value']; 
                    }               
                   }      

            xvalue = sampleID;
            console.log(xvalue);            
            yvalue = mrnavalue;
            console.log(yvalue);

            var JSONlgg = $.getJSON(downloadlgg, function(data){
            var itemslgg = data;
            
            var mrnavaluelgg = [];
            var sampleIDlgg = [];

            for (var i = 0; i < itemslgg.length; i++) {
                    itemlgg = itemslgg[i]; 
                    if(entrezGeneId == item['entrezGeneId']){
                        sampleIDlgg[i] = itemlgg['sampleId'];
                        mrnavaluelgg[i] = itemlgg['value'];      
                    }          
                   }      

            xvaluelgg = sampleIDlgg;
            yvaluelgg = mrnavaluelgg;

            hovertext = GeneName + ": GBM vs LGG - mRNA Expression";

            var trace1 = { 
                x: xvalue,
                y: yvalue,
                name: 'Agilent microarray mRNA expression - GBM',
                type: 'bar',
                transforms: [{
                    type: 'sort',
                    target: yvalue,
                    order: 'ascending'
                }]
            };

            var trace2 = {
                x: xvaluelgg,
                y: yvaluelgg,
                name: 'Agilent microarray mRNA expression - lgg',
                type: 'bar',
                transforms: [{
                    type: 'sort',
                    target: yvaluelgg,
                    order: 'ascending'
                }]

            };

            var layout = {
                title: hovertext,
                xaxis: {
                    title: {
                        text: 'SampleID'
                    },
                yaxis: {
                    title: {
                        text: 'mRNA expression',
                        font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                              }
                      }
                }
                }
            };


            var data = [trace1, trace2]            

            Plotly.newPlot("plotly_div", data, layout);
           
           }) 
          })
         })
      })
};

// function bloodslidesClick(){
//     $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="Yes") return true;}) 
//     var blood_selected = $$("slideDataview").getSelectedItem(true);
// }

// function nbloodslidesClick(){
//     $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="No") return true;  } )                                                  
//     var nb_selected = $$("slideDataview").getSelectedItem(true);   
// }

function mrna_forblood_charts(blood_selected, nb_selected, entrezGeneId){
        blood_selected = blood_selected;
        nb_selected = nb_selected;
        entrezGeneId = entrezGeneId;   

        // var blood_btn = document.createElement('button');
        // blood_btn.id = 'bloodBtn';
        // blood_btn.innerHTML = "Blood Slides Select Button";
        // blood_btn.style.background = '#4FFF8F';        
        // document.body.appendChild(blood_btn); 
        // document.getElementById("bloodBtn").style.display="block";
        
        // var btn = document.getElementById('bloodBtn');
        // btn.onClick = function(){
        //     $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="Yes") return true;}) 
        //     var blood_selected = $$("slideDataview").getSelectedItem(true);
        //     $('#blood_btn').attr('disabled', true);        
        // }

        // var nonblood_btn = document.createElement('button');
        // nonblood_btn.id = 'nbloodBtn';
        // nonblood_btn.innerHTML = "Non Blood Slides Select Button";
        // nonblood_btn.style.background = '#4FFF8F';        
        // document.body.appendChild(nonblood_btn);        
        // document.getElementById("nbloodBtn").style.display="block";        

        // var btn = document.getElementById('nbloodBtn');
        // btn.onClick = function(){
        //    $$("slideDataview").filter( function(obj) { if(obj.meta.tags.Blood =="No") return true;  } )                                                  
        //    var nb_selected = $$("slideDataview").getSelectedItem(true);
        //    $('#nbloodBtn').attr('disabled', true);
        // }

        mRNA_bloodvsnonblood_charts(blood_selected, nb_selected, entrezGeneId);        
}

function mRNA_bloodvsnonblood_charts(blood_selected, nb_selected, entrezGeneId){
        samplelistid = "gbm_tcga_all";        
        molecularprofileid = "gbm_tcga_mrna";
        entrezGeneId = entrezGeneId;

        var blood_selected = blood_selected;
        var nb_selected = nb_selected;

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/molecular-data?sampleListId="+samplelistid+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
        promise = makePromise(downloadurl);

        var blood_selected = webix.toArray(blood_selected);
        var nb_selected = webix.toArray(nb_selected);
        var bxvalue = []
        var byvalue = []
        var nbxvalue = []
        var nbyvalue = []

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
                var items = data;

                console.log("Blood vs Non Blood")

            blood_selected.each(function(obj) {        
                name.push(obj.name);
                patientID.push(obj.name.substring(0,12));        
                sampleID.push(obj.name.substring(0,15));        
                tags.push(obj.meta.tags);                
                var mrnavalue = [];
                for (var i = 0; i < items.length; i++) {
                        item = items[i]; 
                        for (var j = 0; j<sampleID.length; j++){    
                            console.log("blood sample");
                            console.log(item['sampleId']);                        
                            if (sampleID[j] == item['sampleId']) {sampleID[i] = item['sampleId']};
                            mrnavalue[i] = item['value'];                            
                        }                    
                }      
                bxvalue = sampleID; 
                console.log(bxvalue)           
                byvalue = mrnavalue;
                console.log(byvalue);
            } )//end of blood slideRecords

            nb_selected.each(function(obj) {        
                name.push(obj.name);
                patientID.push(obj.name.substring(0,12));        
                sampleID.push(obj.name.substring(0,15));        
                tags.push(obj.meta.tags);                            
      
                for (var i = 0; i < items.length; i++) {
                        item = items[i]; 
                        for (var j = 0; j<sampleID.length; j++){    
                            console.log("non blood sample");
                            console.log(item['sampleId']);                        
                            if (sampleID[j] == item['sampleId']) {sampleID[i] = item['sampleId']};
                            mrnavalue[i] = item['value'];                            
                        }                    
                }      

                nbxvalue = sampleID; 
                console.log(nbxvalue);           
                nbyvalue = mrnavalue;
                console.log(nbyvalue);
            } )//end of non blood slideRecords

                
                hovertext = "EntrezGeneId: "+entrezGeneId + ": Blood vs Non-Blood mRNA Expression";
                var trace1 = { 
                    x: bxvalue,
                    y: byvalue,
                    name: 'Agilent microarray mRNA expression - GBM - Blood',
                    type: 'bar',
                    transforms: [{
                        type: 'sort',
                        target: byvalue,
                        order: 'ascending'
                    }]
                };
                var trace2 = {
                    x: nbxvalue,
                    y: nbyvalue,
                    name: 'Agilent microarray mRNA expression - GBM - Non Blood',
                    type: 'bar',
                    transforms: [{
                        type: 'sort',
                        target: byvalue,
                        order: 'ascending'
                    }]
                };
                var layout = {
                    title: hovertext,
                    xaxis: {title: {text: 'SampleID'} },
                    yaxis: {
                        title: {
                            text: 'mRNA expression',
                            font: {
                                    family: 'Courier New, monospace',
                                    size: 18,
                                    color: '#7f7f7f'
                                  }
                                }
                            }                    
                };
                var data = [trace1, trace2]            
                Plotly.newPlot("plotly_div", data, layout);            
            }) //End of Json data
        }) //End of Promise
};  

function mRNAcharts_allBloodNonblood(blood_selected, nb_selected, entrezGeneId){
        samplelistid = "gbm_tcga_all";   //gbm_tcga_all, gbm_tcga      
        molecularprofileid = "gbm_tcga_mrna"; //gbm_tcga_mrna, gbm_tcga_rna_seq_v2_mrna
        entrezGeneId = entrezGeneId;
        console.log(entrezGeneId);

        var blood_selected = blood_selected;
        var nb_selected = nb_selected;       

        var blood_selected = webix.toArray(blood_selected);
        var nb_selected = webix.toArray(nb_selected);
        
        var nb_sampleID = [];
        var blood_name = [];
        var blood_patientID = [];
        var blood_sampleID = [];
        var nb_name = [];
        var nb_patientID = [];
        var nb_sampleID = [];

        blood_selected.each(function(obj){
            blood_name.push(obj.name);
            blood_patientID.push(obj.name.substring(0,12));
            blood_sampleID.push(obj.name.substring(0,15));            
        }) //end of blood slideRecords
        

        nb_selected.each(function(obj){
            nb_name.push(obj.name);
            nb_patientID.push(obj.name.substring(0,12));
            nb_sampleID.push(obj.name.substring(0,15));            
        })//end of non blood slideRecords   

        var bxvalue = []
        var byvalue = []
        var nbxvalue = []
        var nbyvalue = []               

        downloadurl = "http://www.cbioportal.org/api/molecular-profiles/"+molecularprofileid+"/molecular-data?sampleListId="+samplelistid+"&entrezGeneId="+entrezGeneId+"&projection=SUMMARY";
        promise = makePromise(downloadurl);

        promise.then(function(result){        
            var JSONData = $.getJSON(downloadurl, function(data){
                var items = data;              
                var bld_mrnavalue = [];
                var bld_sampleID = [];
                var nbld_mrnavalue = [];
                var nbld_sampleID=[];
                
                for (var i = 0; i < items.length; i++) {                        
                        item = items[i];                        
                        for (var j = 0; j<blood_sampleID.length; j++){                                                            
                            if (blood_sampleID[j] == item['sampleId'] && item['entrezGeneId'] == entrezGeneId) 
                                {
                                    bld_sampleID[i] = item['sampleId'];
                                    bld_mrnavalue[i] = item['value'];
                                };                                                            
                        }                    
                }; // End of Blood for loop                     

                bxvalue = bld_sampleID;                
                byvalue = bld_mrnavalue;
                
                for (var i = 0; i < items.length; i++) {                        
                        item = items[i];
                        //console.log(item['sampleId']);                         
                        for (var j = 0; j<nb_sampleID.length; j++){
                            //console.log(nb_sampleID[j]);                            
                            if (nb_sampleID[j] == item['sampleId'] && item['entrezGeneId'] == entrezGeneId) 
                                {
                                    nbld_sampleID[i] = item['sampleId'];
                                    nbld_mrnavalue[i] = item['value'];
                                };                                                            
                        }                    
                }; // End of non Blood for loop
                
                nbxvalue = nbld_sampleID;                
                nbyvalue = nbld_mrnavalue;
                
                hovertext = "EntrezGeneId: "+ entrezGeneId + ": Blood vs Non-Blood mRNA Expression";
               
                var trace1 = { 
                    x: bxvalue,
                    y: byvalue,
                    name: 'Agilent microarray mRNA expression - GBM - Blood',
                    type: 'scatter',                    
                    mode: 'markers',
                    marker: {size:12}                
                };

                var trace2 = {
                    x: nbxvalue,
                    y: nbyvalue,
                    name: 'Agilent microarray mRNA expression - GBM - Non Blood',
                    type: 'scatter',                    
                    mode: 'markers',
                    marker: { size:12}                    
                };

                var data = [trace1, trace2];

                var layout = { title: hovertext};

                Plotly.newPlot("plotly_div", data, layout);                
                    
            }) //End of Json data

        }) //End of Promise

        
};