A webix/Flask UI pulling data from cBioportal, with Girder/DSA data view:

To run:
1. Git clone the entire repository
2. Ensure the folder structure is not changed as needed by Flask app
3. Run dsa_ui_flask->python app.py


Commands to Pull data from cBioPortal for the following Genomic queries

'Cancer_Types_list',             : list of all the clinical types of cancer

'Meta_data_all_cancer_studies',  : meta-data of all cancer studies

'Genetic_Profiles_Cancer_Study', : All Genetic profiles for a specific study (argument: Cancer_Study)

'All_Case_lists',                : All Case Lists of a specific study (argument: Cancer_Study)

'Single_Genomic_Profiles_4_Genes',: Single Genomic Profile data for 1 or more genes (arguements: Cancer_Study, Genes)

'Multi_Genomic_Profiles_4_aGene',: Multi Genomic Profile data for 1 gene (arguements: Cancer_Study, Gene)

'MutationData_4_Genes',          : MutationData for gene(s) (arguments: Cancer_study, Genes)

'ClinicalData_4_CancerStudy'     : ClinicalData for specific Cancer (argument: Cancer_Study)

'Protein_Array_Info'             : Antibodies used by reverse-phase protein arrays (RPPA) (argument:Cancer_Study)

'Phospho_Protein_Array_Info'     : Phospho protein Antibodies used by reverse-phase protein arrays (RPPA) (argument: Cancer_Study)

'Protein_Array_Data'             : Get RPPA-based Proteomics Data (argument: Cancer_Study                                 )



------------------------------------------
To run the Application docker:

docker run -it --rm -p5000:5000 sraja2911/dsa_ui_flask:latest 
