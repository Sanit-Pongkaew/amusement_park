import React, {Component} from 'react';
import swal from 'sweetalert';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { url } from './KEY';

class Nav extends Component {

    logout = async () => {
        try {
            let response = await fetch(`${url}/api/backend/authentication/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.token
                })
            });

            if (response.ok) {
                console.log('ok')
                let result = await response.json();
                localStorage.clear();
                window.location.href = "/login";
            }
        } catch (err) {
            swal("", "Plese try again", "error")
        }
    }

    render() {
        return (
            <div>
                {
                    parseInt(localStorage.status) === 2078987349 ? 
                    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                        <Link to='/'>
                        <a className="navbar-brand" href="#">Logo</a>
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to='/package' style={{textDecoration: 'none'}}>
                                    <a className="nav-link" href="#">Package</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/calendar' style={{textDecoration: 'none'}}>
                                    <a className="nav-link">Calendar</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    {/* <Link to='/logout' style={{textDecoration: 'none'}} > */}
                                    <a className="nav-link" href="#" onClick={this.logout}>Logout</a>
                                    {/* </Link> */}
                                </li>
                            </ul>
                        </div>
                    </nav>
                    : parseInt(localStorage.status) === 1 ?
                    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                        <Link to='/'>
                        <a className="navbar-brand" href="#">Logo</a>
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to='/package' style={{textDecoration: 'none'}}>
                                    <a className="nav-link" href="#">Package</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/calendar' style={{textDecoration: 'none'}}>
                                    <a className="nav-link">Calendar</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    {/* <Link to='/logout' style={{textDecoration: 'none'}}> */}
                                    <a className="nav-link" onClick={this.logout}>Logout</a>
                                    {/* </Link> */}
                                </li>
                            </ul>
                        </div>
                    </nav>
                    :''
                }
            </div>
        );
    }
}

export default Nav;