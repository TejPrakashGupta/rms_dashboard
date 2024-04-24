import React from "react";
import WaitersHeader from "../../src/layouts/WaitersHeader";
import "react-tabs/style/react-tabs.css";
import Link from "next/link";

export default class Tables_Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {table_open:'',table_reserved:'',table_occupied:'',selected:[], table_data:[],table_data1:[],zone_combo:[], dashboard:[], user:{},
    isTableStatusModalOpen:false, info_data:{}};
  }

  componentDidMount() { 
    this.getassignedtable(); 
    this.gettable();
    this.getselectedzone();
    // this.getdates();
    var date= new Date();
    date.setDate(date.getDate()+7);
    // console.log("Date: ", date)
  }

  async getassignedtable() {
    var res = await app.get("/dashboard/dashboard-table-assign");
    if (res.status) {
      this.setState({ dashboard: res.data.all_dashboards });
      this.setState({user:res.data.login_info})
      console.log("User_Info: ", res.data.login_info)
    }
  }

  async gettable() {
    var res = await app.get("/dashboard-table-manage/tables");
    if (res.status) {
      this.setState({ table_open: res.data.tbl_status_cnt.Open});
      this.setState({ table_reserved: res.data.tbl_status_cnt.Reserved});
      this.setState({ table_occupied: res.data.tbl_status_cnt.Running});
      this.setState({ table_data: res.data.table_data });
      this.setState({ table_data1: res.data.table_data });
      this.setState({ zone_combo: res.data.zone_combo });
    }
  }

  getselectedzone(){
    const selectedzone= this.state.zone_combo.filter((user)=>user.id==='all').map(({id,name})=>({id,name}));
    this.setState({selected:selectedzone})
  }

  selectzone=(e)=>{
    var table_info_data = []
    const{name, value} = e.target
    const value_parse = JSON.parse(value)
    // console.log("value_parse",value_parse)
    this.setState({selected:value_parse.zone_name})
    
    if(value_parse.zone_id==='all'){
      table_info_data= this.state.table_data1
    }
    else {
      table_info_data = this.state.table_data1.filter((table)=>table.zone_id===value_parse.zone_id)
    }
    this.setState({table_data: table_info_data})
	  }  

    get_data=(value)=>{
      this.setState({isTableStatusModalOpen: false})
      if(value==="status Updated"){
        this.gettable();
      }
    }

  render() {
    const{table_open,table_reserved,table_occupied, table_data,zone_combo,dashboard,user,selected, isTableStatusModalOpen, info_data}= this.state
    
    return (
        <>
          <div className="container-fluid">
            <div className='row'>
            <WaitersHeader dashboard={dashboard} user_info={user}/>
            </div>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='waiters-nav'>
                  <div className='d-flex justify-content-between'>
                      <div className='table-midle'>
                        <li className='waiters-haeder-li'>
                          <select className="form-select waiter-select"  value={selected.length>0?selected[0].name:''} onChange={this.selectzone} >
                            {zone_combo.map((zone,index) => (									
                                    <option key={index} value={JSON.stringify({zone_id:zone.id, zone_name:zone.name})} >{zone.name}</option>
                            ))};                                    
                          </select>
                        </li>
                      </div>
                      
                      <div className="btn_table ">
                        <button type="button" className="btn-radius btn-table vived-red border-0 table-link text-white">Occupied: {table_occupied}</button>
                        <button type="button" className="btn-radius btn-table side-table-btn dark-sky-bg border-0 table-link text-white">Reserved: {table_reserved}</button>
                        <button type="button" className="btn-radius btn-table side-table-btn Navy-Blue border-0 table-link text-white">Open: {table_open}</button>
                      </div>
                  </div>                    
                  <div className="d-flex flex-wrap align-content-start">
                  {table_data.length>0 && table_data.map((table_info,table_index)=>
                  <>
                    <div key={table_index} className="dashboard-card border border-0 d-flex" >
                      <div className='table-waiters-card table-management ' style={{backgroundColor:table_info.table_status_color}} >
                        <h4 className='profile-location text-white' >{table_info.name}<br/>{table_info.zone_name}<br/>{table_info.status_name}</h4>
                        <div className='create-price'>
                          <i className="fa fa-warning waring-icon text-white"></i>
                        </div>
                      </div>                
                    </div>
                  </>
                  )}          
                      
                  </div>
                </div>
              </div>
            </div>
          </div>
         

      
        
      </>
    );
  }
}
