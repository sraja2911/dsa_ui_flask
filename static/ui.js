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
        //var Associated_Genes = item.meta.Associated_Genes;            
    }
    var item_name = item.name;

    // $$("sliderdata").define("template", slideText);
    $$("sliderdata").parse(item);
    $$("sliderdata").refresh();


    /*Fetch data from cBioPortal for the following Genomic Pipelines
    genomic_pipeline = ('Cancer_Types_list',             : list of all the clinical types of cancer
                        'Meta_data_all_cancer_studies',  : meta-data of all cancer studies
                        'Genetic_Profiles_Cancer_Study', : All Genetic profiles for a specific study (argument: Cancer_Study)
                        'All_Case_lists',                : All Case Lists of a specific study (argument: Cancer_Study)
                        'Single_Genomic_Profiles_4_Genes',: Single Genomic Profile data for 1 or more genes (arguements: Cancer_Study, Genes)
                        'Multi_Genomic_Profiles_4_aGene',: Multi Genomic Profile data for 1 gene (arguements: Cancer_Study, Gene)
                        'MutationData_4_Genes',          : MutationData for gene(s) (arguments: Cancer_study, Genes)
                        'ClinicalData_4_CancerStudy'     : ClinicalData for specific Cancer (argument: Cancer_Study)
                        'Protein_Array_Info'             : Antibodies used by reverse-phase protein arrays (RPPA) (argument: Cancer_Study)
                        'Phospho_Protein_Array_Info'     : Phospho protein Antibodies used by reverse-phase protein arrays (RPPA) (argument: Cancer_Study)
                        'Protein_Array_Data'             : Get RPPA-based Proteomics Data (argument: Cancer_Study)
                       ) **/

    Cancer_Study = 'gbm_tcga';
    Genes = 'TP53+EGFR+BRCA1+BRCA2'
    Gene = 'EGFR'

    // var genomic_pipeline = 'Cancer_Types_list' ;
    // cBioresultsdisplay(genomic_pipeline);

    // var genomic_pipeline = 'Meta_data_all_cancer_studies';
    // cBioresultsdisplay(genomic_pipeline);

    // var genomic_pipeline = 'Genetic_Profiles_Cancer_Study'
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

    //Following query retrieves all case lists (eg. tcga_sequenced, tcga_methylation all, Tumor samples with CNA data) for Cancer_Study='gbm_tcga'              
    var genomic_pipeline = 'All_Case_lists';
    cBioresultsdisplay(genomic_pipeline, Cancer_Study);

    // var genomic_pipeline = 'Single_Genomic_Profiles_4_Genes'
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study, Genes);

    // var genomic_pipeline = 'Multi_Genomic_Profiles_4_aGene';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study, Gene);

    // var genomic_pipeline = 'MutationData_4_Genes';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study, Genes);

    // var genomic_pipeline = 'ClinicalData_4_CancerStudy';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

    // var genomic_pipeline = 'Protein_Array_Info';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

    // var genomic_pipeline = 'Phospho_Protein_Array_Info';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

    // var genomic_pipeline = 'Protein_Array_Data';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

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
        console.log(this.length);
        console.log(obj.name);
        console.log(obj._id);
        name.push(obj.name);
        perc.push(obj.meta.Blood_Red_Percentage);
        wb_count.push(obj.meta.White_Blood_Cell_Count);
        Stain_Types.push(obj.meta.Stain_Types);
        Cancer_Grading.push(obj.meta.Cancer_Grading);
        Associated_Genes.push(obj.meta.Associated_Genes);
        nextSlideText = "SlideID: " + obj._id +
            "\\n" + "Stain_Types: " + obj.meta.Stain_Types +
            "\\n " + "Blood_Red_Percentage: " + obj.meta.Blood_Red_Percentage +
            "\\n" + "White_Blood_Cell_Count: " + obj.meta.White_Blood_Cell_Count +
            "\\n" + "Cancer_Grading: " + obj.meta.Cancer_Grading +
            "\\n" + "Associated_Genes: " + obj.meta.Associated_Genes +
            "\\n" + "Slide Name: " + obj.name;

        slideText = slideText + "\\n" + nextSlideText
        slideText = obj; //FIX THIS.. nt sure what your trying to render
    });
    var data = [
        { x: name, y: perc, mode: 'lines+markers', name: "BRC Percentage" },
        { x: name, y: wb_count, mode: 'lines+markers', name: "WBC Count" }
    ]
    // $$("sliderdata").define("template", slideText);
    // $$("sliderdata").refresh();    
    $$("sliderdata").parse(slideText)

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

sliderTemplate = "<div>#name#<br>#id# #Stain_Types# <br>RBC:#meta.Blood_Red_Percentage# Grade:#meta.Cancer_Grading# " +
    "WBC: #meta.White_Blood_Cell_Count# </div>"

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
                                template: "Footer",
                                template: sliderTemplate,
                                id: "sliderdata",
                                gravity: 0.2
                            }


                        ]
                    },
                    { view: "resizer" },

                    { view: "template", content: "plotly_div" },
                    { view:"datatable", id:"caseListTable", autoConfig: true}
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

function cBioresultsdisplay(genomic_pipeline, Cancer_Study, Genes, Gene) {
    // Retrieves all case lists (eg. tcga_sequenced, tcga_methylation all, Tumor samples with CNA data) of GBM cancer study
    // promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getCaseLists&cancer_study_id=' + Cancer_Study)

    // promise.then(function(result){
    //     console.log(result);            
    //     download(result, "genomic_results.txt", 'text/json')
    //     // //To view tab delimited object in the console box
    //     // var promise_data = [];        
    //     // var promise_line_split = result.split("\n");
    //     // for (var i = 0; i < promise_line_split.length; i++) {
    //     //   var w = promise_line_split[i].split("\t");
    //     //   promise_data.push({
    //     //     case_list_id: w[0],
    //     //     case_list_name: w[1],
    //     //     case_list_description: w[2],
    //     //     cancer_study_id: w[3],
    //     //     case_ids: w[4],
    //     //     line_delimiter: '\n'
    //     //   });
    //     // }
    //     // console.log(promise_data);            
    //     return 
    // }, function(err){
    //     console.log(err);
    // });

    switch (genomic_pipeline) {
        case 'Cancer_Types_list':
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getTypesOfCancer')
            promise.then(function(result) {
                console.log(result);
                //download(result, "cancertypes_List.txt", 'text/json')     

                console.table( tsvJSON(result));

                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Meta_data_all_cancer_studies':
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getCancerStudies')
            promise.then(function(result) {
                console.log(result);
                //download(result, "all_cancerstudies_metadata.txt", 'text/json')                
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Genetic_Profiles_Cancer_Study':
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getGeneticProfiles&cancer_study_id=' + Cancer_Study)
            promise.then(function(result) {
                console.log(result);
                //download(result, "all_geneticprofiles_metadata.txt", 'text/json')                
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'All_Case_lists':
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getCaseLists&cancer_study_id=' + Cancer_Study)
            promise.then(function(result) {

                    //result.split("\n").forEach(function(row,idx){ console.log(row,idx)})


                //download(result, "all_caselists_4_cancer.txt", 'text/json')                
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Single_Genomic_Profiles_4_Genes':
            Case_Set_Id = Cancer_Study;
            Genes = Genes;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getProfileData&case_set_id=' + Case_Set_Id + '_all&genetic_profile_id=' + Case_Set_Id + '_mutations&gene_list=' + Genes)
            promise.then(function(result) {
                console.log(result);
                download(result, "genomicProfiles_4_cancer.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Multi_Genomic_Profiles_4_aGene':
            Case_Set_Id = Cancer_Study;
            Gene = Gene;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getProfileData&case_set_id=' + Case_Set_Id + '_all&genetic_profile_id=' + Case_Set_Id + '_mutations,' + Case_Set_Id + '_gistic&gene_list=' + Gene)
            promise.then(function(result) {
                console.log(result);
                download(result, "Multi_Genomic_Profiles_4_aGene.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'MutationData_4_Genes':
            Case_Set_Id = Cancer_Study;
            Gene = Gene;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getMutationData&case_set_id=' + Case_Set_Id + '&genetic_profile_id=' + Case_Set_Id + '_mutations&gene_list=' + Genes)
            promise.then(function(result) {
                console.log(result);
                download(result, "MutationData_4_Genes.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'ClinicalData_4_CancerStudy':
            Case_Set_Id = Cancer_Study;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getClinicalData&case_set_id=' + Case_Set_Id + '_all')
            promise.then(function(result) {
                console.log(result);
                download(result, "ClinicalData_4_CancerStudy.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Protein_Array_Info':
            Case_Set_Id = Cancer_Study;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getProteinArrayInfo&cancer_study_id=' + Case_Set_Id)
            promise.then(function(result) {
                console.log(result);
                download(result, "Protein_Array_CancerStudy.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Phospho_Protein_Array_Info':
            Case_Set_Id = Cancer_Study;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getProteinArrayInfo&cancer_study_id=' + Case_Set_Id + '&protein_array_type=phosphorylation')
            promise.then(function(result) {
                console.log(result);
                download(result, "Phospho_protein_Array_Info_CancerStudy.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
        case 'Protein_Array_Data':
            Case_Set_Id = Cancer_Study;
            promise = makePromise('http://www.cbioportal.org/webservice.do?cmd=getProteinArrayData&case_set_id=' + Case_Set_Id + '_RPPA&array_info=1')
            promise.then(function(result) {
                console.log(result);
                download(result, "Protein_Array_Data_CancerStudy.txt", 'text/json')
                return
            }, function(err) {
                console.log(err);
            });
            break;
    }

}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}