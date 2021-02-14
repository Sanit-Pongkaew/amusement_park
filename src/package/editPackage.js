import React, {Component} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';
import { url } from '../KEY';

class EditPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkProcess: false,
            id_package: '',
            package_name: '',
            package_detail: '',
            main_img: '',
            sub_imgs: '',
        }
    }

    componentDidMount() {
        let id_split = this.props.location.search.split('id=');
        this.setState({ id_package: parseInt(id_split[1]) });
        this.fetchData();
    }

    fetchData = async () => {
        this.setState({ checkProcess: true });
        try {
            let response = await fetch(`${url}/api/backend/editPackage`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id_package: this.state.id_package
                })
            });
            this.setState({ checkProcess: false });
            console.log(response)
            if (response.status === 1) {
                this.setState({ package_name: response.package_name });
                this.setState({ package_detail: response.package_detail });
                this.setState({ checkProcess: false });
            } else {
                this.setState({ checkProcess: false });
                swal("Add package fail!");
            }
        } catch (err) {
            this.setState({ checkProcess: false });
            swal("", "Plese try again", "error")
        }
    }

    onSubmit = async (e) => {

    }

    render() {
        if (this.state.checkProcess) {
            return <LinearProgress />
        }
        else {
            return(
                <div 
                    className="container mt-5" 
                    style={{border: '1px solid #d3d6db'}}
                >
                    <div className="row d-flex justify-content-center mb-4 mt-4">
                        <h3>Edit Package</h3>
                    </div>
                    <div className="row mb-4 d-flex justify-content-center">
                        <label htmlFor="packageName" className="col-md-2 col-form-label">Package Name : </label>
                        <div className="col-md-8">
                            <input type="text" id="packageName" className="form-control" required onChange={e => this.setState({ package_name: e.target.value })} value={this.state.package_name} />
                        </div>
                    </div>
                    <div className="row mb-4 d-flex justify-content-center">
                        <label htmlFor="package_detail" className="col-md-2 col-form-label">Package Detail : </label>
                        <div className="col-md-8">
                            <input type="text" id="package_detail" className="form-control" required onChange={e => this.setState({ inventory_ticket: e.target.value })} value={this.state.package_detail} />
                        </div>
                    </div>
                </div>
            );
        }   
    }
}

export default EditPackage;