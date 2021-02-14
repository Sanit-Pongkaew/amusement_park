import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import { url } from '../KEY';
import swal from 'sweetalert';
import Select from 'react-select';

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkProcess: false,
            package_name: [],
            id_package: '',
            start_date: '',
            to_date: '',
            arr_date_compare: [],
            list_date_set_period: [],
            arr_date_compare: [],
            namePackage: '',
            arr_data_calendar: [],
            data_calendar_in_tbody: [],
        }
    }

    componentDidMount() {
        if ((Boolean(localStorage.getItem('token')) && Boolean(localStorage.getItem('status'))) && (typeof localStorage.status !== "undefined")) {
            this.fetchData();
        } else {
            window.location.href = "/login";
        }
    }

    fetchData = async () => {
        this.setState({ checkProcess: true });
        let response = await fetch(`${url}/api/backend/getPackageList`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        let result = await response.json();
        console.log(result)
        if (result.status === 1) {
            this.setState({ package_name: result.result });
            this.setState({ checkProcess: false });
        }
        else {
            this.setState({ checkProcess: false });
            swal("", "Please try agin", "warning");
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        let arr_date_split = [];
        let arr_date_compare_for_set_state = [];
        let split_start_date = this.state.start_date.split("-");
        let split_to_date = this.state.to_date.split("-");
        let dates = this.getDates(new Date(split_start_date[0],(split_start_date[1] - 1),split_start_date[2]), new Date(split_to_date[0],(split_to_date[1] - 1),split_to_date[2]));
        this.setState({ arr_date_compare: [] });
        dates.map((date) => {
            let date_split_for_compare = date.toString().substring(0, 16) + "24:00:00 GMT+0700 (Indochina Time)";
            let format_date_for_compare = new Date(date_split_for_compare).toString();
            let date_for_compare = format_date_for_compare.split("T", 1);
            arr_date_compare_for_set_state.push(date_for_compare[0]);

            let date_split = date.toString().split(" ", 4);
            arr_date_split.push(`${date_split[0]} ${date_split[2]} ${date_split[1]} ${date_split[3]}`);
        });
        this.setState({ list_date_set_period: arr_date_split });
        this.setState({ arr_date_compare: arr_date_compare_for_set_state });

        this.fetchCalendar();
    }

    packageName = () => {
        var options = [];
        for (let i = 0; i < this.state.package_name.length; i++) {
            if (i === this.state.package_name.length-1) {
                return <Select options={options} onChange={e => this.setState({ id_package: e.value })} />
            } else {
                options.push({value: `${this.state.package_name[i].id_package}`, label: `${this.state.package_name[i].package_name}`})
            }
        }
    }

    fetchCalendar = async () => {
        console.log('*')
        console.log(this.state.id_package);
        this.setState({ checkProcess: true });
        try {
            const response = await fetch(`${url}/api/backend/getCalendar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id_package: this.state.id_package,
                    start_date: this.state.start_date,
                    to_date: this.state.to_date
                }),
            });

            if (response.ok) {
                const data_list = await response.json();
                console.log('++')
                console.log(data_list.result)
                data_list.result.push({
                    date_no_of_ticket: 'false',
                    inventory_update: '',
                    promotion_code: '',
                    price_child: '',
                    price_adult: '',
                })

                this.setState({ arr_data_calendar: data_list.result });
                console.log('123')
                console.log(this.state.arr_data_calendar[0].date_no_of_ticket)
                let count = 0;
                this.setState({ data_calendar_in_tbody: [] });

                for (let i = 0; i < this.state.arr_date_compare.length; i++) {
                    console.log('44')
                    console.log(data_list.result[0].date_no_of_ticket)
                    if (this.state.arr_date_compare[i] === this.state.arr_data_calendar[count].date_no_of_ticket) {
                        this.state.data_calendar_in_tbody.push({
                            date_no_of_ticket: data_list.result[count].date_no_of_ticket,
                            inventory_update: data_list.result[count].inventory_ticket,
                            promotion_code: data_list.result[count].promotion_code,
                            price_child: data_list.result[count].price_child,
                            price_adult: data_list.result[count].price_adult,
                        });
                        count++;
                    } else {
                        this.state.data_calendar_in_tbody.push({
                            date_no_of_ticket: 'NULL',
                            inventory_update: 'NULL',
                            promotion_code: 'NULL',
                            price_child: 'NULL',
                            price_adult: 'NULL',
                        });
                    }
                }

                this.setState({ checkProcess: false });
            }
            else {
                this.setState({ checkProcess: false });
                swal("", "Please try agin", "warning");
            }
        } catch (err) {
            this.setState({ checkProcess: false });
            swal("", "Please refresh page", "warning")
            console.log(err);
        }
    }

    getDates = (startDate, endDate) => {
        console.log(startDate)
        console.log(endDate)
        let dates = [],
            currentDate = startDate,
            addDays = function(days) {
                let date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    }

    dataCalendar = () => {
        if (this.state.list_date_set_period.length > 0 && this.state.id_package !== "") {
            return (
                <div>
                    <div style={{ position: 'relative', overflow: 'auto' }}>
                        <table border="1" style={{ textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <td colSpan='2' width="600" style={{ fontWeight: 'bold', backgroundColor: '#E67E22', color: '#FFFFFF', height: '100px' }}>Table</td>
                                    {this.state.list_date_set_period.map((value, index) => {
                                        return <td style={{ fontWeight: 'bold', backgroundColor: '#BDC3C7' }} key={index} >{value}</td>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan='2' style={{ fontWeight: 'bold', padding: '10px' }}>Inventory Ticket</td>
                                    {this.state.data_calendar_in_tbody.map((value, index) => {
                                        if (value.inventory_update === 'NULL') {
                                            return <td style={{ backgroundColor: '#00B3FF' }} key={index} >{value.inventory_update}</td>
                                        } else {
                                            return <td key={index} >{value.inventory_update}</td>
                                        }
                                    })}
                                </tr>
                                <tr>
                                    <td colSpan='2' style={{ fontWeight: 'bold', padding: '10px' }}>Promotion code</td>
                                    {this.state.data_calendar_in_tbody.map((value, index) => {
                                        if (value.promotion_code === 'NULL') {
                                            return <td style={{ backgroundColor: '#00B3FF' }} key={index} >{value.promotion_code}</td>
                                        } else {
                                            return <td key={index} >{value.promotion_code}</td>
                                        }
                                    })}
                                </tr>
                                <tr>
                                    <td colSpan='2' style={{ fontWeight: 'bold', padding: '10px' }}>Price Adult</td>
                                    {this.state.data_calendar_in_tbody.map((value, index) => {
                                        if (value.price_child === 'NULL') {
                                            return <td style={{ backgroundColor: '#00B3FF' }} key={index} >{value.price_child}</td>
                                        } else {
                                            return <td key={index} >{value.price_child}</td>
                                        }
                                    })}
                                </tr>
                                <tr>
                                    <td colSpan='2' style={{ fontWeight: 'bold', padding: '10px' }}>Price Child</td>
                                    {this.state.data_calendar_in_tbody.map((value, index) => {
                                        if (value.price_adult === 'NULL') {
                                            return <td style={{ backgroundColor: '#00B3FF' }} key={index} >{value.price_adult}</td>
                                        } else {
                                            return <td key={index} >{value.price_adult}</td>
                                        }
                                    })}
                                </tr>
                            </tbody>
                            <tfoot></tfoot>
                        </table>

                    </div>
                </div>
            )
        }
    }

    render() {
        if (this.state.checkProcess) {
            return <LinearProgress />
        }
        else {
            return(
                <div className="container mt-4">
                    <div className="row d-flex justify-content-center mb-4">
                        <h3>Calendar Package</h3>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <div className="row d-flex justify-content-center mb-4">
                            <label class="col-md-2 form-label">Package Name</label>
                            <div className="col-md-4">
                            {this.packageName()}
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center mb-4">
                            <label htmlFor="start_date" className="col-md-2 col-form-label">From Date : </label>
                            <div className="col-md-4">
                                <input type="date" id="start_date" className="form-control" required onChange={e => this.setState({ start_date: e.target.value })} />
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center mb-4">
                            <label htmlFor="to_date" className="col-md-2 col-form-label">To Date : </label>
                            <div className="col-md-4">
                                <input type="date" id="to_date" className="form-control" required onChange={e => this.setState({ to_date: e.target.value })} />
                            </div>
                        </div>
                        <div className="text-center mb-3">
                            <input type="submit" className="btn btn-success" value="Set period" />
                        </div>
                    </form>
                    {this.dataCalendar()}
                </div>
            );
        }
    }
}

export default Calendar;