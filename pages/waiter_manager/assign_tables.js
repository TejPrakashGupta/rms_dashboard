import React from "react";
import WaitersHeader from "../../src/layouts/WaitersHeader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ReassigningTableModal from "./reassigningtablemodal";
import ResetAssignTableModal from "./resetassingedtablesmodal";

export default class assign_tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isReassigningTableModalOpen: false, isResetAssignTableModalOpen: false, dashboard: [], waiters: [],
      tables: [], dates:[], selected_waiter_id: "", selected_table_id: "", selected_table_waiter: [], selected_waiter: {}, 
      waiter_name: "", waiterslist:{}, user:{}, schedule_waiter:[], waiter_dates_object:{}, selected_waiter_name:""};
  } 

  componentDidMount() { 
    this.getassignedtable(); 
    this.getdates();
    var date= new Date();
    date.setDate(date.getDate()+7);
    // console.log("Date: ", date)
  }

  async getassignedtable() {
    var res = await app.post("/dashboard/dashboard-table-assign",{"remember_session_table":sessionStorage.getItem("remember_session_table")});
    if (res.status) {
      this.setState({ dashboard: res.data.all_dashboards });
      this.setState({ waiters: res.data.waiters });
      this.setState({ tables: res.data.tables });
      this.setState({ user:res.data.login_info})
    }
  }

  async getdates() {
    var res = await app.get("/dashboard/waiter-schedule");
    if (res.status) {
      this.setState({ dates: res.data.schedule.dates });
      this.setState({ waiterslist: res.data.schedule.waiters });
      this.setState({ waiter_dates_object: res.data.schedule.waiters_date})
    }
  }

  openReassigningTableModal = () => {
    if(this.state.selected_waiter_id)
    {
    this.setState({ isReassigningTableModalOpen: !this.state.isReassigningTableModalOpen});
    }
    else{
      app.toast("Please select waiter", 'warning');
    }
  };

  openResetAssignTableModal = () => {
    this.setState({isResetAssignTableModalOpen: !this.state.isResetAssignTableModalOpen });
  };

  selectwaiter = (e, waiter_id, waiter_short_name) => {
    // console.log("waiter is selected: ", waiter_id)
    this.setState({ selected_waiter_id: waiter_id });
    this.setState({ selected_waiter: {...this.state.selected_waiter, [waiter_id]: waiter_short_name,},});
    this.setState({ selected_waiter_name: waiter_short_name})
  };

  selectassigntable = (e, table_id, waiter_id) => {
    // console.log("Table is selected: ", table_id,waiter_id)
    this.setState({ selected_table_id: table_id });
    if (waiter_id == null) {
      this.setState({selected_table_waiter: {...this.state.selected_table_waiter,[table_id]: this.state.selected_waiter_id,},});
      var waiter_info = this.state.selected_waiter;
      this.setState({waiter_name: waiter_info[this.state.selected_waiter_id], });
    } 
    else if (this.state.selected_waiter_id!=waiter_id) {
      console.log("selected_waiter_id:", this.state.selected_waiter_id)
      console.log("waiter_id:", waiter_id)
      this.openReassigningTableModal();
    }
  };

   senddata = async() => {
    var res = await app.post('/dashboard/waiter-table-assign',{table_with_waiter:JSON.stringify(this.state.selected_table_waiter)})
    if (res.status) {
      // console.log("Success response: ",res.message)
      this.getassignedtable();

    }
  };

  resetalltables=async(value)=>{

    if(value==="Clear") {
    var res = await app.post('/dashboard/assign-all-reset')
    if(res.status)
    {
    this.setState({isResetAssignTableModalOpen: false})
    this.getassignedtable(); 
  }
}
}

  reassigntable=async(value,checked)=>{
    console.log("value checked: ", value,checked)
    console.log("Waiter_id: ", this.state.selected_waiter_id)
    console.log("Table_id: ", this.state.selected_table_id)

    if(checked && value==="ChangeWaiter")
    {
      let existingData = JSON.parse(sessionStorage.getItem("remember_session_table")) || {};
      // Add new data
      existingData[this.state.selected_table_id] = {
        'id': this.state.selected_waiter_id,
        'name': this.state.selected_waiter_name
      };      
      // Update sessionStorage with the modified data
      sessionStorage.setItem("remember_session_table", JSON.stringify(existingData));

      // sessionStorage.setItem("remember_session_table", JSON.stringify({[this.state.selected_table_id]:{'id':this.state.selected_waiter_id, 'name':this.state.selected_waiter_name}}))
      this.setState({ isReassigningTableModalOpen:false})
      // var res = await app.post('/dashboard/waiter-table-re-assign',sessionStorage.getItem("remember_session_table"))
      // if(res.status)
      // {
      //   this.getassignedtable(); 
      //   app.toast(res.message, 'success');
      // }
      // else{
      //   app.toast(res.message, 'warning');
      // }
      this.getassignedtable(); 
      app.toast("Table Reassigned successfully", 'success')
    }
    else{
      this.removesessionkey();
      this.setState({ isReassigningTableModalOpen:false})
      var res = await app.post('/dashboard/waiter-table-re-assign',{table_id:this.state.selected_table_id, waiter_id: this.state.selected_waiter_id})
      if(res.status)
      {
        this.getassignedtable(); 
        app.toast(res.message, 'success');
      }
      else{
        app.toast(res.message, 'warning');
      }
    }

    
  }

  removesessionkey=()=>{
    const existingDataString = sessionStorage.getItem("remember_session_table");
    let existingData = existingDataString ? JSON.parse(existingDataString) : {};
    // Identify the entry you want to remove (replace 'entryToRemove' with your specific logic)
    const entryToRemove = this.state.selected_table_id;
    // Remove the entry from the object
    if (existingData.hasOwnProperty(entryToRemove)) {
      delete existingData[entryToRemove];
    }
    // Convert the modified object back to a JSON string
    const modifiedDataString = JSON.stringify(existingData);
    // Update sessionStorage with the modified JSON string
    sessionStorage.setItem("remember_session_table", modifiedDataString);
  }

  scheduleWaiter = async(e, waiter_id, selected_date) => {
      e.preventDefault();
      var waiter_dates_db = this.state.waiter_dates_object[selected_date.date]?JSON.parse(this.state.waiter_dates_object[selected_date.date]?.waiter_ids):''

      this.setState({
        schedule_waiter: {
            ...this.state.schedule_waiter,
                [selected_date.date]: [waiter_id]
                  }
                  }, () => {
                      this.waiter_schedule_update(this.state.schedule_waiter, {waiter_id, waiter_dates_db, selected_date:selected_date.date});
                      });

  }

    async waiter_schedule_update(schedule_waiter, args){
        var schedule = schedule_waiter
        var schedule_sel_date = schedule[args.selected_date]
        var waiter_id = args.waiter_id

        var arrayToString = ''
        if(args.waiter_dates_db)
        {
            schedule_sel_date = schedule_sel_date.concat(args.waiter_dates_db)
            schedule[args.selected_date] = schedule_sel_date
        }

        var count = schedule[args.selected_date].filter(item => item === waiter_id).length;
        if(count > 1) 
        schedule[args.selected_date] = schedule[args.selected_date].filter(item => item !== waiter_id);
    
        var res = await app.post('/dashboard/waiter-schedule-update', {schedule:JSON.stringify([schedule])})
        if(res.status)
        {
            app.toast(res.message, res.type);
            this.getdates()
        }
        else
        {
            app.toast(res.message, res.type);
        }
    }

  scheduleWaiter_old = async (e, waiter_id, selected_date) => {
    e.preventDefault();

    var waiter_dates_db = this.state.waiter_dates_object[selected_date.date]?JSON.parse(this.state.waiter_dates_object[selected_date.date]?.waiter_ids):''
    // console.log("waiter_dates_db== ", waiter_dates_db)

    this.setState((prevState) => {
      var updatedScheduleWaiter = {...prevState.schedule_waiter,
      [selected_date.date]: [...(prevState.schedule_waiter[selected_date.date] || []), waiter_id,], };

        if(updatedScheduleWaiter[selected_date.date] && waiter_dates_db)
        {
            const arrayToString = waiter_dates_db.join(', ');
            // console.log("arrayToString", arrayToString)
            updatedScheduleWaiter[selected_date.date].push(arrayToString)
        }

      var count = updatedScheduleWaiter[selected_date.date].filter(item => item === waiter_id).length;
        // console.log("count== ", count, updatedScheduleWaiter[selected_date.date])
        if(count > 1) 
        updatedScheduleWaiter[selected_date.date] = updatedScheduleWaiter[selected_date.date].filter(item => item !== waiter_id);

      app.post('/dashboard/waiter-schedule-update', {schedule:JSON.stringify([updatedScheduleWaiter])})
        .then((res) => {

        if (!res.status) {
          app.toast(res.message, 'warning');
        } else {
          app.toast(res.message, 'success');
          // console.log("Received API response");
          this.getdates();
        }
        })
        .catch((error) => {
          console.error('Error sending data to the API:', error);
        });
      
      return { schedule_waiter: updatedScheduleWaiter };
    });
  };
  

  

  render() {
    const { isReassigningTableModalOpen, user, isResetAssignTableModalOpen, dashboard, waiters, selected_table_waiter, tables,
      waiter_name, selected_waiter, selected_waiter_id,selected_table_id,dates,waiterslist,schedule_waiter } = this.state;
    //console.log("schedule_waiter: ",schedule_waiter)
    // console.log("dates: ",dates)
    // if(Object.keys(waiterslist).length > 0) 
    // console.log("waiterslist: ",waiterslist)

    return (
      <>
        <div className="container-fluid">
          <div className="row">
          <WaitersHeader dashboard={dashboard} user_info={user}/>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="waiters-nav">
                <Tabs>
                  <TabList>
                    <Tab>Assign Tables</Tab>
                    <Tab>Schedule Waiters</Tab>
                  </TabList>

                  <TabPanel>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="waiter">
                          <h5 className="table-link text-secondary fw-bold mt-2">Waiters </h5>
                          <hr />
                          <div className="row">
                            <div className="trikolore-middle">
                              {waiters.length > 0 &&
                                waiters.map((waiter, index) => (
                                  <div key={index} className={`card-body schwarz-box dashboard-card d-flex justify-content-between p-1 mt-2 ${selected_waiter_id==waiter.id?"selectedbox":""}`} onClick={(e) =>this.selectwaiter(e,waiter.id,waiter.short_name )}>
                                    <div className="rounded-cricle mt-1">
                                      <div className={`rounded-circle dashboard-cricle-big rounded-pill text-white ${waiter.name_bg_color}`}>
                                        <span className="customer-name-waiter"> {waiter.short_name} </span>
                                      </div>
                                      <h6 className="cricle-heading-waiter text-secondary mt-2" >{waiter.name} <br></br>{waiter.surname}</h6>
                                    </div>
                                    {waiter.assigned_table != 0 && (
                                      <div className="waiter-heading create-price text-center">
                                        <span className="badge waiter-badge bg-light-green">{waiter.assigned_table}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="waiter-name">
                          <h5 className="table-link text-secondary fw-bold">Tables</h5>
                          <hr></hr>
                          <div className="row">
                            <div className="trikolore-middle">
                              {tables.length > 0 && tables.map((table, index) => (
                                
                                  <div key={index} className={`card-body assign-card schwarz-box dashboard-card d-flex justify-content-between p-1 mt-2 ${selected_table_id==table.id?"selectedbox":""}`} onClick={(e) =>this.selectassigntable( e,table.id,table.waiter_id)}>
                                    <div className="rounded-cricle mb-2">
                                      <h6 className="cricle-heading-waiter text-secondary mt-2" >{table.name} <br />{table.zone_name} </h6>
                                      {table.waiter_id != null && (
                                        <span className={`rounded-circle dashboard-cricle text-white mt-3 ${table.waiter_color}`}>
                                          {table.waiter_name}
                                        </span>
                                      )}
                                      {table.waiter_id == null && waiter_name && selected_table_waiter[table.id] && (
                                          <span className="rounded-circle dashboard-cricle bg-light-green  text-white mt-3">{selected_waiter[ selected_table_waiter[table.id]]} </span>
                                        )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="d-flex justify-content-end mt-5">
                          <div className="builder">{" "}
                            <button type = 'submit' className="menu-item right btn-radius green-btn" onClick={this.senddata}> Save </button>
                          </div>
                          <div className="builder ">
                            <button  className="menu-item right btn-radius pink-btn" onClick={this.openResetAssignTableModal} > Reset </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  
                  <TabPanel>
                    <div className="row mait_table">
                      <table className="table">
                        <thead>
                          <tr className="table_row">
                            <th className="table_head table_waiter text-color fw-bold table_border"> Waiters </th>
                            {dates && dates.map((date,index)=>
                              <th key ={index} className="table_head text-color fw-bold table_border">{date}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                        {waiters && waiters.map((waiter,index3)=>
                          <tr key={index3} className="table_row">
                            <td >
                              <button className="btn-waiterManager waiter_button dashboard-card mb d-flex p-1">
                                <div className="rounded-cricle mb-2">
                                  <span className={`rounded-circle dashboard-cricle text-white ${waiter.name_bg_color}`}>{waiter.short_name}</span>
                                </div>
                                <div className="waiter-heading">
                                  <h2 className="heading  main-dashboard-heading mt-3">
                                    <a className="text-color" >{waiter.name}</a>
                                  </h2>
                                </div>
                              </button>
                            </td>

                            
                             {Object.keys(waiterslist).length > 0 && waiterslist[waiter.id]?.dates_wise_present.map((listindex,index1)=>
                            <td key={index1} className="border border-0"> {" "}
                            <button className={`btn-waiterManager ${listindex.date_wise_waiter.includes(waiter.id)?waiterslist[waiter.id].color:''}`} onClick={(e)=>this.scheduleWaiter (e,waiter.id,listindex)} ></button>{" "}
                          </td>
                            )} 
                          </tr>
                        )}

                        </tbody>
                      </table>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        {isReassigningTableModalOpen && (
          <ReassigningTableModal isOpen={isReassigningTableModalOpen} onClose={this.openReassigningTableModal} onSubmitreassign={this.reassigntable}/>
        )}

        {isResetAssignTableModalOpen && ( 
          <ResetAssignTableModal isOpen={isResetAssignTableModalOpen} onClose={this.openResetAssignTableModal} onSubmitreset={this.resetalltables} />
        )}
      </>
    );
  }
}
