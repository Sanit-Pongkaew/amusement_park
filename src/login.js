import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { url } from './KEY';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkProcess: false,
            email: '',
            password: '',
        }
    }

    componentDidMount() {

    }

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({ checkProcess: true })
        try {
            const response = await fetch(`${url}/api/backend/authentication/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result)
            
                if (result.status_fetch === 1) {
                    localStorage.setItem('status', result.status);
                    localStorage.setItem('id_amusement', result.id_amusement);
                    localStorage.setItem('token', result.token);
                    this.setState({ checkProcess: false });
                    this.props.history.push("/");
                    window.location.reload(false);
                } else {
                    this.setState({ checkProcess: false });
                    swal("", "Please refresh page", "warning");
                }
            }
        } catch (err) {
            this.setState({ checkProcess: false });
            swal("", "Plese try again", "error")
        }
    }

    render() {
        if (this.state.checkProcess) {
            return <LinearProgress />
        }
        else {
            return(
                <div>
                    <div className="mt-5" style={{
                        border: '1px solid #00b3ff',
                        paddingLeft: '7%',
                        paddingRight: '7%',
                        marginRight: '30%',
                        marginLeft: '30%',
                        borderRadius: '25px'
                    }}>
                        <form onSubmit={this.onSubmit}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-3 mt-3">
                                        <label htmlFor="email" className="form-label">Email : </label>
                                        <input type="email" className="form-control" id="email" required onChange={e => this.setState({ email: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-3 mt-3">
                                        <label htmlFor="password" className="form-label">Password : </label>
                                        <input type="password" className="form-control" id="password" required onChange={e => this.setState({ password: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mb-3 mt-3">
                                <input type="submit" value="Sign In" style={{
                                    padding: '5px',
                                    width: '100%',
                                    borderRadius: '25px',
                                    backgroundColor: '#39b1fa',
                                    border: '1px solid #39b1fa',
                                    color: 'white'
                                }} />
                            </div>
                        </form>
                    </div>
                    <div className="mt-4" style={{
                        marginLeft: '30%',
                        marginRight: '30%'
                    }}>
                        <div className="row" style={{fontWeight: 'bold'}}>
                            <div className="col-md-12">
                                <p>Username & Password Super Admin</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <p>Username: </p>
                            </div>
                            <div className="col-md-10">
                                <p>admin@admin.com</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <p>Password: </p>
                            </div>
                            <div className="col-md-10">
                                <p>admin</p>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        marginLeft: '30%',
                        marginRight: '30%'
                    }}>
                        <div className="row" style={{fontWeight: 'bold'}}>
                            <div className="col-md-12">
                                <p>Username & Password Admin</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <p>Username: </p>
                            </div>
                            <div className="col-md-10">
                                <p>user@user.com</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <p>Password: </p>
                            </div>
                            <div className="col-md-10">
                                <p>user</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Login;