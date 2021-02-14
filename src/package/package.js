import React, {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import { url } from '../KEY';
import swal from 'sweetalert';

class Package extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkProcess: false,
            package_park: [],
        }
    }

    componentDidMount() {
        if ((Boolean(localStorage.getItem('token')) && Boolean(localStorage.getItem('status'))) && (typeof localStorage.status !== "undefined")) {
            this.updateData();
        } else {
            window.location.href = "/login";
        }
    }

    updateData = async () => {
        this.setState({ checkProcess: true });

        try {
            console.log('try')
            let response = await fetch(`${url}/api/backend/getPackage`, {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.ok)
            if (response.ok) {
                let result = await response.json();
                console.log(result)
    
                this.setState({ package_park: result.result });
                this.setState({ checkProcess: false });
            }
            else {
                this.setState({ checkProcess: false });
                swal("", "Please refresh page", "warning");
            }
        } catch (err) {
            console.log(err)
        }
    }

    menuAction = (cell, row) => {
        let link_edit = `/package/editPackage/${cell}?id=${cell}`;
        return(
            <div>
                <Link to={link_edit}>
                    <button 
                        className="btn btn-info" 
                        style={{
                            padding: "10px",
                            fontSize: "14px"
                        }}
                    >
                        Edit
                    </button>
                    &nbsp;
                </Link>
                    <button className="btn btn-danger" value={cell} style={{padding: "10px", fontSize: "14px"}} onClick={ () => {
                        swal({
                            title: "",
                            text: "You want delete this package?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                        .then((willDelete) => {
                            if (willDelete) {
                                fetch(`${url}/api/backend/deletePackage`, {
                                    method: "DELETE",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body: JSON.stringify({
                                        id_package: cell,
                                        status: localStorage.getItem('status')
                                    })
                                })
                                .then(response => response.json())
                                .then(result => {
                                if (result.status === 1) {
                                    this.updateData();
                                } else {
                                    swal("", "Delete fail!", "error");
                                }
                            })
                            .catch(err => {
                                localStorage.clear();
                                swal("", "Please try agin", "warning");
                            })
                        }
                    })
                }} >Delete</button>
            </div>
        );
    }

    render() {
        if (this.state.checkProcess) {
            return <LinearProgress />
        }
        else {
            return(
                <div className="container mt-5" style={{
                    borderRadius: '25px',
                    border: '1px solid #39b1fa'
                }}>
                    <div className="mt-4" style={{
                        marginLeft: '2%',
                        fontWeight: 'bold'
                    }}>
                        Package
                    </div>
                    <CardBody>
                        <div style={{
                            textAlign: "right",
                            margin: "25px"
                        }}>
                            <Link to="/package/addPackage">
                                <button className="btn btn-primary">
                                    <i className="fa fa-plus"></i>
                                    <span style={{ padding: "0 5px" }}>Add</span>
                                </button>
                            </Link>
                        </div>
                        <BootstrapTable data={this.state.package_park} version="4" striped hover pagination search>
                            <TableHeaderColumn isKey dataField="no" width="100" dataSort>No.</TableHeaderColumn>
                            <TableHeaderColumn dataField="package_name" width="200" dataSort>Package Name</TableHeaderColumn>
                            <TableHeaderColumn dataField="package_detail" width="200" dataSort>Package Details</TableHeaderColumn>
                            <TableHeaderColumn dataField="id_package" width="150" dataFormat={this.menuAction}>Action</TableHeaderColumn>
                        </BootstrapTable>
                    </CardBody>
                </div>
            );
        }
    }
}

export default Package;