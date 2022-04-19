import React, { Component } from 'react';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import SinelgResultDisplayComp from './singleresult'
import DsSelectComp from './datasetselect'
import DomainSelectComp from './domainselect'
import ReturnSelectComp from './returnselect'
import ServiceSelectComp from './serviceselect'
import MethodSelectComp from './methodselect'
import SearchBox1Comp from './searchbox1';
import SearchBox2Comp from './searchbox2';

import Grid from '@mui/material/Grid';



class MainComp extends Component {
    state = {
        queryConceptList1: [],
        queryConceptList2: [],
        dataset: "1",
        domain: "phenotypes",
        topN: "25",
        apiService: "frequencies",
        apiMethod: "mostFrequency",
        apiResultsDisplayService: "frequencies",
        apiResultsDisplayMethod: "mostFrequency",
        apiResultsDisplay: false,
        submitError: false,
        submitHelperText: '',
        apiResults: [
            {
                "concept_code_2": "MONDO:0020128",
                "concept_id_2": 80020128,
                "concept_name_2": "motor neuron disease",
                "domain_id_2": "diseases",
                "vocabulary_id_2": "mondo",
                "ws_jaccard_index": 0.058781401498457474,
                "z_details": [
                    {
                        "concept_code_1": "HP:0001324",
                        "concept_id_1": 90001324,
                        "concept_name_1": "Muscle weakness",
                        "concept_pair_count": 1067,
                        "domain_id_1": "phenotypes",
                        "jaccard_index": 0.058781401498457474,
                        "vocabulary_id_1": "hpo",
                        "w": 1
                    }
                ]
            },
            {
                "concept_code_2": "HP:0025406",
                "concept_id_2": 90025406,
                "concept_name_2": "Asthenia",
                "domain_id_2": "phenotypes",
                "vocabulary_id_2": "hpo",
                "ws_jaccard_index": 0.05399218026545941,
                "z_details": [
                    {
                        "concept_code_1": "HP:0001324",
                        "concept_id_1": 90001324,
                        "concept_name_1": "Muscle weakness",
                        "concept_pair_count": 2099,
                        "domain_id_1": "phenotypes",
                        "jaccard_index": 0.05399218026545941,
                        "vocabulary_id_1": "hpo",
                        "w": 1
                    }
                ]
            },
            {
                "concept_code_2": "HP:0001260",
                "concept_id_2": 90001260,
                "concept_name_2": "Dysarthria",
                "domain_id_2": "phenotypes",
                "vocabulary_id_2": "hpo",
                "ws_jaccard_index": 0.05013278413094141,
                "z_details": [
                    {
                        "concept_code_1": "HP:0001324",
                        "concept_id_1": 90001324,
                        "concept_name_1": "Muscle weakness",
                        "concept_pair_count": 925,
                        "domain_id_1": "phenotypes",
                        "jaccard_index": 0.05013278413094141,
                        "vocabulary_id_1": "hpo",
                        "w": 1
                    }
                ]
            },
            {
                "concept_code_2": "MONDO:0004976",
                "concept_id_2": 80004976,
                "concept_name_2": "amyotrophic lateral sclerosis",
                "domain_id_2": "diseases",
                "vocabulary_id_2": "mondo",
                "ws_jaccard_index": 0.04871031746031746,
                "z_details": [
                    {
                        "concept_code_1": "HP:0001324",
                        "concept_id_1": 90001324,
                        "concept_name_1": "Muscle weakness",
                        "concept_pair_count": 982,
                        "domain_id_1": "phenotypes",
                        "jaccard_index": 0.04871031746031746,
                        "vocabulary_id_1": "hpo",
                        "w": 1
                    }
                ]
            }]
    }


    handleSearchBox1SelectChange = (newValue) => {
        this.setState({ queryConceptList1: [...newValue] })
        if (!this.state.queryConceptList1){
            this.setState({queryConceptList2: [], apiService: "frequencies", apiMethod: "mostFrequency"})
        }
    }

    handleSearchBox2SelectChange = (newValue) =>{
        this.setState({ queryConceptList2: [...newValue] })
    }

    handleDatasetSelectChange = (ds) => {
        this.setState({dataset: ds})
    }

    handleDomainSelectChange = (domain) => {
        this.setState({domain: domain})
    }

    handleReturnSelectChange = (topN) => {
        this.setState({topN: topN})
    }

    handleServiceSelectChange = (service) => {
        this.setState({apiService: service})  
    }

    handleMethodSelectChange = (method) => {
        this.setState({apiMethod: method})  
    }

    handleSubmit = async () => {
        var conceptIdList1 = []
        var conceptIdList2 = []
        console.log(this.state.apiMethod)
        // this.setState({
        //     submitHelperText: this.state.apiMethod === '' ? 'No method provided!' : '',
        //     submitError: this.state.apiMethod === '' ? true : false
        // })
        if (this.state.queryConceptList1.length && !this.state.submitError) {
            const queryList1 = this.state.queryConceptList1.map((concept) => concept.id)
            var response1 = await axios.get('https://rare.cohd.io//api/vocabulary/findConceptByCode', {
                params: {
                    q: queryList1.join(';'),
                }
            });
            conceptIdList1 = response1.data.results.map((result) => result.concept_id)
            this.setState({
                submitHelperText: conceptIdList1.length ? '' : 'No concept found in OARD database for query concept 1!',
                submitError: conceptIdList1.length ? false : true
            })
        }
        if (this.state.queryConceptList2.length && !this.state.submitError) {
            const queryList2 = this.state.queryConceptList2.map((concept) => concept.id)
            var response2 = await axios.get('https://rare.cohd.io//api/vocabulary/findConceptByCode', {
                params: {
                    q: queryList2.join(';'),
                }
            });
            conceptIdList2 = response2.data.results.map((result) => result.concept_id)
            this.setState({
                submitHelperText: conceptIdList2.length ? '' : 'No concept found in OARD database for query concept 2!',
                submitError: conceptIdList2.length ? false : true
            })
        }

        if (!this.state.submitError) {
            if (this.state.domain === 'all') {
                var response = await axios.get('https://rare.cohd.io//api/' + this.state.apiService + '/' + this.state.apiMethod, {
                    params: {
                        dataset_id: parseInt(this.state.dataset),
                        concept: conceptIdList1.join(';'),
                        concept_id: conceptIdList1.join(';'),
                        concept_id_1: conceptIdList1.join(';'),
                        concept_id_2: conceptIdList2.join(';'),
                        top_n: parseInt(this.state.topN)
                    }
                });
            } else {
                var response = await axios.get('https://rare.cohd.io//api/' + this.state.apiService + '/' + this.state.apiMethod, {
                    params: {
                        dataset_id: parseInt(this.state.dataset),
                        concept: conceptIdList1.join(';'),
                        concept_id: conceptIdList1.join(';'),
                        concept_id_1: conceptIdList1.join(';'),
                        concept_id_2: conceptIdList2.join(';'),
                        top_n: parseInt(this.state.topN),
                        domain_id: this.state.domain
                    }
                });
            }

            this.setState({
                apiResults: response.data.results,
                apiResultsDisplayService: this.state.apiService,
                apiResultsDisplayMethod: this.state.apiMethod,
                apiResultsDisplay: true
            })
        }
    }


    render() {

        return (
            <Grid container xs={12} spacing={2} justifyContent="center" p={10}>

                {/* form */}
                <Grid container item xs={12} spacing={5}  justifyContent="space-around">
                    {/* search box 1 */}
                    
                    <Grid item xs={12} lg={6} >
                        <SearchBox1Comp handleSearchBox1SelectChange={this.handleSearchBox1SelectChange} />
                    </Grid>

                    {/* search box 2 */}
                    <Grid item xs={12} lg={6}>
                        <SearchBox2Comp handleSearchBox2SelectChange={this.handleSearchBox2SelectChange} queryConceptList1={this.state.conceptList1} />
                    </Grid>

                    {/* dataset selection */}
                    <Grid item xs={12} md={6} lg={2}>
                        <DsSelectComp handleDatasetSelectChange={this.handleDatasetSelectChange} />
                    </Grid>

                    {/* domain selection */}
                    <Grid item xs={12} md={6} lg={2}>
                        <DomainSelectComp handleDomainSelectChange={this.handleDomainSelectChange} queryConceptList1={this.state.queryConceptList1} queryConceptList2={this.state.queryConceptList2} />
                    </Grid>

                    {/* return selection */}
                    <Grid item xs={12} md={6} lg={2}>
                        <ReturnSelectComp handleReturnSelectChange={this.handleReturnSelectChange} />
                    </Grid>

                    {/* service selection */}
                    <Grid item xs={12} md={6} lg={2}>
                        <ServiceSelectComp handleServiceSelectChange={this.handleServiceSelectChange} queryConceptList1={this.state.queryConceptList1}/>
                    </Grid>

                    {/* method selection */}
                    <Grid item xs={12} md={6} lg={2}>
                        <MethodSelectComp handleMethodSelectChange={this.handleMethodSelectChange} apiService={this.state.apiService} queryConceptList1={this.state.queryConceptList1} queryConceptList2={this.state.queryConceptList2}/>
                        
                    </Grid>

                    {/* submit button */}
                    <Grid item container xs={12} md={6} lg={2} justifyContent="center">
                        <FormControl error={this.state.submitError} sx={{ display: 'flex' }}>
                            <Button variant="contained" onClick={this.handleSubmit} size="large">Submit</Button>
                            <FormHelperText>{this.state.submitHelperText}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* results */}
                <Grid item container xs={12}  justifyContent="space-around">
                    <List aria-label="mailbox folders" sx={{ display: 'flex',flexDirection:"column",alignItems:"stretch"}}>
                        {this.state.apiResultsDisplay &&
                            <ListSubheader>
                                {this.state.apiResults.length} Results returned. Please note if the count number is less than ten, no results will be returned.
                            </ListSubheader>
                        }
                        {this.state.apiResultsDisplay &&
                            this.state.apiResults.map((result, i) =>
                                <SinelgResultDisplayComp key={i} result={result} service={this.state.apiResultsDisplayService} method={this.state.apiResultsDisplayMethod}>{i}</SinelgResultDisplayComp>
                            )
                        }
                    </List>
                </Grid>



            </Grid>
        );
    }
}

export default MainComp;