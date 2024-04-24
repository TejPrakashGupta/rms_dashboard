import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import WaitersHeader from "../../src/layouts/WaitersHeader";

Chart.register(...registerables)

export default class App extends React.Component {
    constructor(props){
        super(props)
        const colors = ['rgba(153, 126, 241, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)', 
                        'rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)', 'rgba(219, 79, 142, 1)', 'rgba(75, 75, 192, 1)', 'rgba(192, 75, 75, 1)', 
                        'rgba(126, 241, 153, 1)', 'rgba(240, 128, 128, 1)', 'rgba(128, 128, 240, 1)'];
        this.state={ dashboard:[], user:{}, select_datatype:1,
                    my_order:{labels:[], datasets:[{ data: [],}]}, my_order_max:0,my_order_step_size:0,  total_order:0,
                    my_amount:{labels:[], datasets:[{ data: [],}]}, my_amount_max:0,my_amount_step_size:0,  total_amount:0,
                    top_product:{labels:[], datasets:[{ data: [],}]},top_product_max:0,top_product_step_size:0,
                    top_category:{labels:[], datasets:[{ data: [],}]},top_category_max:0, top_category_step_size:0,
                    top_table:{labels:[], datasets:[{ data: [],}]},top_table_max:0,top_table_step_size:0,
                    top_zone:{labels:[], datasets:[{ data: [],}]}, top_zone_max:0, top_zone_step_size:0,
                    top_waiter_order:{labels:[], datasets:[{ data: [],}]},top_waiter_order_max:0,top_waiter_order_step_size:0,
                    top_waiter_order_value:{labels:[], datasets:[{ data: [],}]},top_waiter_order_value_max:0,top_waiter_order_value_step_size:0,
                    top_waiter_tsco:{labels:[], datasets:[{ data: [],}]},top_waiter_tsco_max:0, top_waiter_tsco_step_size:0,
                    kitchen_tsao:{labels:[], datasets:[{ data: [],}]},kitchen_tsao_max:0, kitchen_tsao_step_size:0,
            data_info: {
                // labels: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                labels: [8,9,10,11,12,13,14,15,16,17,18,19],
                datasets: [    {                                
                                backgroundColor: 'rgba(153 , 126, 241, 1)',
                                borderColor: 'rgba(153 , 126, 241, 1)',
                                borderWidth: 0,
                                data: [38, 47, 19, 20, 40, 50, 39,38, 47, 19, 20, 40],
                                },
                            ],
                        },
            order_data_info: {
                labels: [8,9,10,11,12,13,14,15,16,17,18,19],
                datasets: [    {
                                backgroundColor: colors,
                                borderColor: colors,
                                borderWidth: 0,
                                data: [38, 47, 19, 20, 40, 50, 39,38, 47, 19, 20, 40],
                                },
                            ],
                        },
            sales_data_info: {
                labels: [8,9,10,11,12,13,14,15,16,17,18,19],
                datasets: [    {
                                backgroundColor: 'rgba(153 , 126, 241, 1)',
                                borderColor: 'rgba(153 , 126, 241, 1)',
                                borderWidth: 0,
                                data: [2300, 3600, 3100, 2000, 4000, 5000, 3900,3800, 4700, 1900, 2000, 4000],
                                },
                            ],
                        }
                    }
            }
    componentDidMount(){
        this.getassignedtable();
        this.getgraphinfor(this.state.select_datatype);
    }

    async getgraphinfor(typevalue){
        // console.log("getting value: ", typevalue)
        var res = await app.post("/report/all", {date_type:typevalue})
        if (res.status){
            // console.log("Api Response: ", res.data.my_orders);
            //1. My_orders_data_Information
            const order_hours = res.data.my_orders.orders.map(order => order.hr);
            const order_hours_value = res.data.my_orders.orders.map(order => order.order_count);
            this.setState({ my_order: { labels: order_hours, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:order_hours_value}] } });
            this.setState({my_order_max:res.data.my_orders.max})
            this.setState({my_order_step_size:res.data.my_orders.step_size})
            this.setState({total_order:res.data.my_orders.total_order})
            
            //2. My Sales data information
            const amount_hours = res.data.sale.orders.map(order => order.hr);
            const amount_hours_value = res.data.sale.orders.map(order => order.total_amount);
            this.setState({my_amount: { labels: amount_hours, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:amount_hours_value}] } });
            this.setState({my_amount_max:res.data.sale.max})
            this.setState({my_amount_step_size:res.data.sale.step_size})
            this.setState({total_amount:res.data.sale.total_amount})

            //3. Top Products Information
            const product = res.data.top_products.products.map(order => order.item);
            const product_value = res.data.top_products.products.map(order => order.total_qty);
            this.setState({top_product: { labels: product, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:product_value}] } });
            this.setState({top_product_max:res.data.top_products.max})
            this.setState({top_product_step_size:res.data.top_products.step_size})

            //4. Top Category Information
            const category = res.data.top_categories.categories.map(order => order.name);
            const category_value = res.data.top_categories.categories.map(order => order.cnt);
            this.setState({top_category: { labels: category, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:category_value}] } });
            this.setState({top_category_max:res.data.top_categories.max})
            this.setState({top_category_step_size:res.data.top_categories.step_size})

            //5. Top Tables Information
            const tables = res.data.top_tables.tables.map(order => order.table_name);
            const tables_value = res.data.top_tables.tables.map(order => order.cnt);
            this.setState({top_table: { labels: tables, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:tables_value}] } });
            this.setState({top_table_max:res.data.top_tables.max})
            this.setState({top_table_step_size:res.data.top_tables.step_size})
            
            //6. Top Zones Information
            const zones = res.data.top_zones.zones.map(order => order.name);
            const zones_value = res.data.top_zones.zones.map(order => order.cnt);
            this.setState({top_zone: { labels: zones, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:zones_value}] } });
            this.setState({top_zone_max:res.data.top_zones.max})
            this.setState({top_zone_step_size:res.data.top_zones.step_size})

            //7. Waiter Wise Order Information
            const waiter_order_quantity = res.data.waiter_total_order_quantity.waiter_wise_order.map(order => order.name);
            const waiter_order_quantity_value = res.data.waiter_total_order_quantity.waiter_wise_order.map(order => order.cnt);
            this.setState({top_waiter_order: { labels: waiter_order_quantity, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:waiter_order_quantity_value}] } });
            this.setState({top_waiter_order_max:res.data.waiter_total_order_quantity.max})
            this.setState({top_waiter_order_step_size:res.data.waiter_total_order_quantity.step_size})
               
            //8. Waiter Wise Order Value Information
            const order_value_quantity = res.data.waiter_total_order_value.waiter_wise_amount.map(order => order.name);
            const order_value_quantity_value = res.data.waiter_total_order_value.waiter_wise_amount.map(order => order.cnt);
            this.setState({top_waiter_order_value: { labels: order_value_quantity, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:order_value_quantity_value}] } });
            this.setState({top_waiter_order_value_max:res.data.waiter_total_order_value.max})
            this.setState({top_waiter_order_value_step_size:res.data.waiter_total_order_value.step_size})

            //9. Waiter time spent to collect Order Information
            const waiter_tsco_quantity = res.data.waiter_time_spent_collect_order.waiters.map(order => order.name);
            const waiter_tsco_quantity_value = res.data.waiter_time_spent_collect_order.waiters.map(order => order.cnt);
            this.setState({top_waiter_tsco: { labels: waiter_tsco_quantity, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:waiter_tsco_quantity_value}] } });
            this.setState({top_waiter_tsco_max:res.data.waiter_time_spent_collect_order.max})
            this.setState({top_waiter_tsco_step_size:res.data.waiter_time_spent_collect_order.step_size})

            // //10. Kitchen time spent to accept Order Information
            const kitchen_tsco_quantity = res.data.kitchen_time_spent_accept_order.results.map(order => order.fulfillment_name);
            const kitchen_tsco_quantity_value = res.data.kitchen_time_spent_accept_order.results.map(order => order.time);
            this.setState({kitchen_tsao: { labels: kitchen_tsco_quantity, datasets: [{label:"There is no information to display", backgroundColor: 'rgba(153 , 126, 241, 1)', borderColor: 'rgba(153 , 126, 241, 1)',borderWidth: 0,data:kitchen_tsco_quantity_value}] } });
            this.setState({kitchen_tsao_max:res.data.kitchen_time_spent_accept_order.max})
            this.setState({kitchen_tsao_step_size:res.data.kitchen_time_spent_accept_order.step_size})
        }
        
    }

    async getassignedtable() {
        var res = await app.get("/dashboard/dashboard-table-assign");
        if (res.status) {
            this.setState({ dashboard: res.data.all_dashboards });
            this.setState({user:res.data.login_info})
            // console.log("User_Info: ", res.data.login_info)
        }
        }
    
        handleChange=(e)=>{
            // console.log("dropdownchange: ", e.target.value)
            this.setState({select_datatype:e.target.value})
            this.getgraphinfor(e.target.value)
        }

  render() {
    const {data_info, dashboard, select_datatype,user,order_data_info,sales_data_info,
        my_order,my_order_max,my_order_step_size,total_order,
        my_amount,my_amount_max,my_amount_step_size,  total_amount,
        top_product,top_product_max,top_product_step_size,
        top_category,top_category_max, top_category_step_size,
        top_table,top_table_max,top_table_step_size,
        top_zone, top_zone_max, top_zone_step_size,
        top_waiter_order,top_waiter_order_max,top_waiter_order_step_size,
        top_waiter_order_value,top_waiter_order_value_max,top_waiter_order_value_step_size,
        top_waiter_tsco,top_waiter_tsco_max, top_waiter_tsco_step_size,
        kitchen_tsao,kitchen_tsao_max, kitchen_tsao_step_size} = this.state
    console.log("top_waiter_order: ", top_waiter_order)
    return (
        <div className="container-fluid">
            <div className='row'>
            <WaitersHeader dashboard={dashboard} user_info={user}/>
            </div>
        <div className='waiters-nav'>
            <div className='waiters-dropdown'>
                <ul className='cricle-btn-ul d-flex justify-content-between'>
                    <li className='waiters-haeder-li'>
                        <select className="form-select waiter-select" value={select_datatype} onChange={this.handleChange} >                           
                                <option value='30' >Month</option>
                                <option value='7' >Week</option>
                                <option value='1' >Today</option>
                        </select>
                    </li>
                </ul>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">My Orders</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="/assets/images/resize.png" className="resize" alt="Zoom Action" />
                                </div>
                            </div>
                            <Bar className='data' 
                                data={my_order}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:my_order_max, ticks: {stepSize: my_order_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: my_order_max === 0 ? true : false, text: "There is no information to display"}}
                                        }} />
                            <h6 className="profile-location text-color fw-bold">Total order:<span className='text-dark-sky'> {total_order}</span></h6>
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">My Sales</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>

                            <Bar className='data' 
                                data={my_amount}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:my_amount_max, ticks: {stepSize: my_amount_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                            plugins: { legend: {display: my_amount_max === 0 ? true : false, text: "There is no information to display"}},
                                            
                                }} />
                            <h6 className="profile-location text-color fw-bold">Total order:<span className='text-dark-sky'> {total_amount}</span></h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Top Products</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_product}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_product_max, ticks: {stepSize: top_product_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: top_product_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Top Categories</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_category}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_category_max, ticks: {stepSize: top_category_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: top_category_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />                           

                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Top Tables</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_table}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_table_max, ticks: {stepSize: top_table_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: top_table_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Top Zones</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_zone}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_zone_max, ticks: {stepSize: top_zone_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: top_zone_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Waiters: Total Order Quantity</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_waiter_order}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_waiter_order_max, ticks: {stepSize: top_waiter_order_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                            plugins: { legend: {display: top_waiter_order_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Waiters: Total Order Value</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_waiter_order_value}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_waiter_order_value_max, ticks: {stepSize: top_waiter_order_value_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: top_waiter_order_value_max === 0 ? true : false, text: "There is no information to display"}},                                         

                                }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Waiters: Time spent to collect orders</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={top_waiter_tsco}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:top_waiter_tsco_max, ticks: {stepSize: top_waiter_tsco_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: top_waiter_tsco_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="card data-chart mt-3">
                        <div className="card-body card-item pb-1 pt-2">
                            <div className='d-flex justify-content-between'>
                                <div className='anahistory'>
                                    <h6 className="profile-location text-color fw-bold">Kitchens: Time spent to accept orders</h6>
                                </div>
                                <div className='zoom-arrow'>
                                    <img src="../../assets/images/resize.png" className="resize"/>
                                </div>
                            </div>
                            <Bar className='data' 
                                data={kitchen_tsao}
                                options={{  
                                    scales: {   y: { beginAtZero: true, max:kitchen_tsao_max, ticks: {stepSize: kitchen_tsao_step_size }, },
                                                x:{grid:{display:false}},                                                        
                                            },
                                    plugins: { legend: {display: kitchen_tsao_max === 0 ? true : false, text: "There is no information to display"}},
                                }} />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        
    )
  }
}
