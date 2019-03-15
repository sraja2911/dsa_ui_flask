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
---------------------------------------------------------------------
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

    // Cancer_Study = 'gbm_tcga';
    // Genes = 'TP53+EGFR+BRCA1+BRCA2'
    // Gene = 'EGFR'

    // var genomic_pipeline = 'Cancer_Types_list' ;
    // cBioresultsdisplay(genomic_pipeline);

    // var genomic_pipeline = 'Meta_data_all_cancer_studies';
    // cBioresultsdisplay(genomic_pipeline);

    // var genomic_pipeline = 'Genetic_Profiles_Cancer_Study'
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

    // Following query retrieves all case lists (eg. tcga_sequenced, tcga_methylation all, Tumor samples with CNA data) for Cancer_Study='gbm_tcga'              
    // var genomic_pipeline = 'All_Case_lists';
    // cBioresultsdisplay(genomic_pipeline, Cancer_Study);

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