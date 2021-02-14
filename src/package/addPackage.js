import React, {Component} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';
import { url } from '../KEY';

class AddPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkProcess: false,
            package_name: '',
            package_detail: '',
            main_img: '',
            sub_imgs: '',
        }
    }

    componentDidMount() {

    }

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({ checkProcess: true });
        if (this.state.sub_imgs.length > 30) {
            swal("", "Images limit 30 files", "warning")
        }
        else {
            const formData = new FormData();

            for(let i = 0; i < this.state.sub_imgs.length; i++) {
                formData.append("sub_imgs", this.state.sub_imgs[i]);
            }

            formData.append("package_name", this.state.package_name);
            formData.append("package_detail", this.state.package_detail);
            formData.append("main_img", this.state.main_img);

            try {
                let response = await fetch(`${url}/api/backend/insertPackage`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });
                console.log(response)
                if (response.ok) {
                    this.props.history.goBack();
                } else {
                    this.setState({ checkProcess: false });
                    swal("Add package fail!");
                }
            } catch (err) {
                this.setState({ checkProcess: false });
                swal("", "Plese try again", "error")
            }
        }
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
                        <h3>Add Package</h3>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="row mb-4 d-flex justify-content-center">
                            <label htmlFor="packageName" className="col-md-2 col-form-label">Package Name : </label>
                            <div className="col-md-8">
                                <input type="text" id="packageName" className="form-control" required onChange={e => this.setState({ package_name: e.target.value })} />
                            </div>
                        </div>
                        <div className="row mb-4 d-flex justify-content-center">
                            <label htmlFor="inventory" className="col-md-2 col-form-label">Package Detail : </label>
                            <div className="col-md-8">
                                <input type="text" id="inventory" className="form-control" required onChange={e => this.setState({ package_detail: e.target.value })} />
                            </div>
                        </div>
                        <div className="row mb-4 d-flex justify-content-center">
                            <label htmlFor="main_img" className="col-md-2 col-form-label">Main Image : </label>
                            <div className="col-md-8">
                                <input type="file" id="main_img" className="form-control" required onChange={e => this.setState({ main_img: e.target.files[0] })} />
                            </div>
                        </div>
                        <div className="row mb-4 d-flex justify-content-center">
                            <label htmlFor="images" className="col-md-2 col-form-label">Images : </label>
                            <div className="col-md-8">
                                <input type="file" id="images" className="form-control" multiple onChange={ e => this.setState({ sub_imgs: e.target.files }) } required />
                            </div>
                        </div>
                        <div className="text-center">
                            <input type="submit" className="btn btn-success mb-4" value="Save" />
                        </div>
                    </form>
                </div>
            );
        }
    }
}

export default AddPackage;