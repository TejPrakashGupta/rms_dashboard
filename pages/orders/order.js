import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React from "react";
import WaitersHeader from "../../src/layouts/WaitersHeader";
import EditItemModal from "./edititemmodal";
import DeleteItemModal from "./deleteitemmodal";
import { start } from "@popperjs/core";
import Link from "next/link";
import Image from "next/image";
export default class Orders extends React.Component {

  constructor(props){
    super(props)
    this.state={isEditItemModalOpen:false, user:{},isDeleteItemModalOpen:false, order_create_time:[], order_preperation_time:[], order_max_preperation_time:[], edit_information:[],order_count:0,
      start_time:0,max_preperation_time:0,preperation_time:0,time_left: 900, dashboard:[], tab:"current", order_info:[], order_item_cnt:{}, order_status:'', timeDifference: 0,formattedTime: '00:00:00'}
    this.timerID = null;
  }

  componentDidMount() {
    this.getassignedtable();
    this.gettable('current');
  }

  async getassignedtable() {
    var res = await app.get("/dashboard/dashboard-table-assign");
    if (res.status) {
      this.setState({ dashboard: res.data.all_dashboards });
      this.setState({user:res.data.login_info});
    }
    else{
      app.toast(res.message, 'warning');
    }
  }

  async gettable(order_status) {
    var res = await app.post("/dashboard-orders/orders",{fulfillment_area: sessionStorage.getItem("fulfillment"), order_status, call_type:"order"});
    if(res.status){
      this.setState({order_info: res.data.order_obj.fulfillment_wise_order})
      this.setState({order_count: res.data.order_obj.order_status_count})
      this.setState({order_item_cnt: res.data.order_obj.order_summary})
      setInterval(()=>{
        const currentDateTime = new Date();
        for (const key in res.data.order_obj.order_summary.order_main_dtl) {
          const orderData = res.data.order_obj.order_summary.order_main_dtl[key];
          if(orderData.order_created_date && orderData.order_item_status ==='Start'){
            const startTime = this.calculateTimeDifference( orderData.order_created_date, orderData.order_created_time,currentDateTime );
            if(startTime){
            this.setState({start_time:startTime})
            this.setState((prevState) => { return {order_create_time: {...prevState.order_create_time,[key]: startTime}} });
            orderData.formattedstartTime = this.formatTime(startTime);
          }
          }
          if(orderData.order_start_date && orderData.order_item_status ==='Complete'){
            const preperationTime = this.calculateTimeDifference(orderData.order_start_date, orderData.order_start_time,currentDateTime);
            if(preperationTime){
            this.setState({preperation_time:preperationTime})
            this.setState((prevState) => { return {order_preperation_time: {...prevState.order_preperation_time,[key]: preperationTime}} });
            orderData.formattedpreperationTime = this.formatTime(preperationTime);
          }
        }
          if(orderData.maximum_response_time){
            const time1=orderData.maximum_response_time.split(':').map(Number);
            const second = (time1[0] * 3600 + time1[1] * 60 + time1[2])*1000
            console.log("Seconds: ", second)
            this.setState((prevState) => { return {order_max_preperation_time: {...prevState.order_max_preperation_time,[key]: second}} });
            this.setState({max_preperation_time: second})
          }
        }  
      // this.setState({ order_item_data: res.data.order_obj.order_summary.order_main_dtl});
      }, 1000)
    }
    else {
      this.setState({order_info:[]})
      this.setState({order_count:0})
      this.setState({order_item_cnt:{}})
      this.setState({start_time:0})
      this.setState({order_create_time:[]})
      this.setState({preperation_time:0})
      this.setState({order_preperation_time:[]})
      
    }
  }

  formatTime(seconds) {
    if(seconds===undefined){
      return '00:00:00'
    }
    else{
    const hours = Math.floor(seconds / 3600000);
    const minutes = Math.floor((seconds % 3600000) / 60000);
    const remainingSeconds = Math.floor((seconds   % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  calculateTimeDifference(date, time, currentDateTime) {
    const orderDateTime = new Date(`${date}T${time}`);
    const timeDifference = currentDateTime - orderDateTime;
    return timeDifference;
  }

  current_order=()=>{
    this.gettable('current')
    this.setState({tab:"current"})
    this.setState({order_info: []})
  }

  previous_order=()=>{
    this.setState({tab:"previous"})
    this.gettable('previous')
    this.setState({order_info: []})
  }

  getordertime=(e)=>{
    const {value}= e.target
  }

  openEditItemModal=(e, order_data)=>{
    this.setState({isEditItemModalOpen:!this.state.isEditItemModalOpen})
    this.setState({edit_information: order_data})
  }

  openDeleteItemModal=(e, order_data)=>{
    this.setState({isDeleteItemModalOpen:!this.state.isDeleteItemModalOpen})
    this.setState({edit_information: order_data})
  }

  ServeOrder=async(e)=>{    
    const{value} = e.target
    const value_parse = JSON.parse(value)
    var res = await app.put("/dashboard-orders/order-status",
    {order_id:value_parse.order_id, item_ids:JSON.stringify(value_parse.order_item_id), fulfillment_by_id:sessionStorage.getItem("fulfillment"), 
    order_created:value_parse.order_created, before_confirm_time:value_parse.before_confirm_time, order_prepare_time: value_parse.order_prepare_time });
    if(res.status){
      this.gettable('current');
    }
  }

  onorderitemremove=(value)=>{
    if(value==="removed"){
      this.gettable('current');
    }
  }

  updatestatus=(value)=>{
    if(value="Updated"){
      this.setState({isEditItemModalOpen:false})
      this.gettable('current');
    }
  }

  render() {
    const {isEditItemModalOpen,isDeleteItemModalOpen, user,dashboard, order_info,order_item_cnt,start_time, order_item_data,edit_information,order_count,tab} = this.state
  
    return (
      <>
      <div className="container-fluid">
        <div className="row">
        <WaitersHeader dashboard={dashboard} user_info={user}/>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Tabs>
              <div className="d-flex justify-content-between waiters-nav">
                <div className="btn_table">
                  <TabList>
                    <Tab onClick={this.current_order}>Current Orders</Tab>
                    <Tab onClick={this.previous_order}>Previous Orders</Tab>                    
                  </TabList>
                </div>
                {/* <h1>Timer: {formattedTime}</h1> */}
                <div className="table-waiters-btn">
                  <button className="btn-radius btn-table yellow-btn border-0 table-link  text-white ">New: {order_count?(order_count.New):"0"}</button>
                  <button className="btn-radius btn-table side-table-btn dark-sky-bg border-0 table-link text-white">Open: {order_count?(order_count.Open):"0"}</button>
                  <button className="btn-radius btn-table side-table-btn Navy-Blue border-0 table-link text-white">Completed: {order_count?(order_count.Completed):"0"}</button>
                </div>
              </div>
              <TabPanel>
                <div className="row bg-light-gray waiters-nav pt-3 pb-5">
                  <div className="order-details">
                    
                    {(order_info!=undefined && order_info!=null)? Object.entries(order_info).map(([key, value]) => (
                      
                    <div key={key} className="item-oredr-details">
                      <div className="modal-pop-card" value = {JSON.stringify({Order_id:key, order_created_date: order_item_cnt.order_main_dtl[key]?.order_created_date, })} onLoad={(e)=>this.getordertime(e)}>
                        <div className="d-flex justify-content-between">
                          <div className="p-1">
                            <div className="order-category">
                              <h6 className="profile-location text-color fw-bold">Table {order_item_cnt.order_main_dtl[key]?.table_no} <br />Order {order_item_cnt.order_main_dtl[key]?.order_no}</h6>
                              <ul className="cricle-dot-ul">
                                <li className="cricle-order-li">
                                  <div className="rounded-cricle">
                                    <Image width={26} height={26} alt="customer_symbol" className="customer-circle " src="/assets/images/Customer_icon.png" /> 
                                       
                                  </div>
                                </li>
                                <li className="cricle-order-li">
                                  <div className="rounded-cricle">
                                    <span className="rounded-circle Navy-Blue p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0">{order_item_cnt.order_main_dtl[key]?.waiter_assigned}</span> 
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-1">
                            <div className="order-category">
                              <h5 className="text-color waiters-datetime text-end">{order_item_cnt.fulfillment_wise_item_cnt[key]}/{order_item_cnt.order_main_dtl[key]?.order_wise_total_items}</h5>
                              <h5 className="profile-location order-text text-pink fw-bold p-0 m-0 pt-2">-{this.state.max_preperation_time>this.state.preperation_time && order_item_cnt.order_main_dtl[key].order_item_status === 'Complete'?(this.formatTime(this.state.order_max_preperation_time[key] - this.state.order_preperation_time[key])):(this.formatTime(this.state.max_preperation_time))} </h5> 
                              <h5 className="profile-location order-text text-color fw-bold order-line-height text-end">{order_item_cnt.order_main_dtl[key]?.order_item_status === 'Complete' && this.state.order_preperation_time?(this.formatTime(this.state.order_preperation_time[key])):"00:00:00"}</h5>
                            </div>
                          </div>
                        </div>
                        <hr className="order-line m-0"></hr> 
                        <div className="create-price d-flex justify-content-center">
                          <h3 className="over-text text-pink fw-bold">{order_item_cnt.order_main_dtl[key]?.order_item_status === 'Start' && this.state.order_create_time?(this.formatTime(this.state.order_create_time[key])):""}</h3> </div>
                        
                        
                        <div className="orderDetailHeight">
                        {value.map((item,index) => 
                            
                        <>
                          
                          <div key={index} className={`d-flex justify-content-between pt-2 ${order_item_cnt.order_main_dtl[key].order_item_status === 'Start'?"text-overly":""}`}>
                            <div className="p-1 pb-0 mb-0">
                              <div className="order-category">
                                <h6 className="profile-location text-color fw-bold">{item.quantity}x
                                  <span className="profile-location text-color fw-bold extra-data">{item.name}</span>
                                </h6> 
                                <span className="profile-location text-pink fw-bold extra-data"></span>                               
                              </div>
                            </div>
                            {order_item_cnt.order_main_dtl[key].order_item_status === 'Confirm'?(
                            <div className="p-1">
                              <div className="order-category">
                                <div className="popup-icon-delete">
                                  <Image width={20} height={20} alt="edit_item" src="/assets/images/edit.png" className="confirm-edit-icon" onClick={(e)=>this.openEditItemModal(e,item)}/>
                                </div>
                              </div>
                            </div>
                           ):''}
                          </div>
                          <div className={`d-flex justify-content-between ${order_item_cnt.order_main_dtl[key].order_item_status === 'Start'?"text-overly":""}`}>
                          <div className="p-1">
                            <div className="order-category">
                            <ul className="cricle-btn-ul order-first-item confirm-list">
                                {item.modifier_group.length>0 && item.modifier_group.map((modifier,index)=>
                                <li key={index} className="text-color peragraph order-line-height">• {modifier.name}</li>
                                )}
                              </ul> 
                              <h6 className="text-pink extra-item btn-table-order fw-bold mb-0">{item.prepared_time_mnts}</h6>
                            </div>
                          </div>
                          {order_item_cnt.order_main_dtl[key].order_item_status === 'Confirm'?(
                          <div className="p-1">{" "}
                            <div className="order-category">
                              <div className="popup-icon-delete">
                                <Image width={20} height={20} alt="remove_item" src="/assets/images/icon-delete.png" className="delete-page-icon" onClick={(e)=>this.openDeleteItemModal(e,item)}/>
                              </div>
                            </div>
                          </div>
                          ):''}
                        </div>
                          </>
                          )}
                          </div>
                        <hr className="order-line m-0"></hr>                        
                        <div className="d-flex justify-content-center mt-3">
                          <div className="builder">
                        {order_item_cnt.order_main_dtl[key].order_item_status === 'Start'?(                        
                            <button className="menu-item  dashboard-green-btn" onClick={this.ServeOrder} 
                            value={JSON.stringify({order_id:key, order_item_id:order_item_cnt.order_main_dtl[key].fulfillment_wise_item_ids, order_created: order_item_cnt.order_main_dtl[key], before_confirm_time:order_item_cnt.order_main_dtl[key].formattedstartTime})} 
                            >Start Order </button>                          
                        ):""}
                        {order_item_cnt.order_main_dtl[key].order_item_status === 'Confirm'?(
                            <button className="menu-item  dashboard-green-btn" onClick={this.ServeOrder}
                            value={JSON.stringify({order_id:key, order_item_id:order_item_cnt.order_main_dtl[key].fulfillment_wise_item_ids, order_created: order_item_cnt.order_main_dtl[key], before_confirm_time:order_item_cnt.order_main_dtl[key].formattedstartTime})}  >Confirm
                              </button>                         
                        ):""}
                        {order_item_cnt.order_main_dtl[key].order_item_status === 'Complete'?(                        
                            <button className="menu-item  dashboard-sky-btn" onClick={this.ServeOrder} 
                            value={JSON.stringify({order_id:key, order_item_id:order_item_cnt.order_main_dtl[key].fulfillment_wise_item_ids, order_created: order_item_cnt.order_main_dtl[key], before_confirm_time:order_item_cnt.order_main_dtl[key].formattedstartTime, order_prepare_time:this.formatTime(this.state.order_preperation_time[key])})}>Complete
                              </button>                          
                        ):""}
                        {order_item_cnt.order_main_dtl[key].order_item_status != 'Start' ?(                        
                            <button className="menu-item  dashboard-pink-btn" data-bs-toggle="modal" onClick={this.ServeOrder} >Cancel
                              </button>                          
                        ):""}
                        </div>
                        </div>
                      </div>
                    </div>
                    )):""}  
                    <span className="item-oredr-details break"></span>
                    <span className="item-oredr-details break"></span>
                    <span className="item-oredr-details break"></span>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
              <div className="row bg-light-gray waiters-nav pt-3 pb-5">
                  <div className="order-details">
                    
                    {(order_info!=undefined && order_info!=null)?Object.entries(order_info).map(([key, value]) => (
                      
                    <div key={key} className="item-oredr-details">
                      <div className="modal-pop-card">
                        <div className="d-flex justify-content-between">
                          <div className="p-1">
                            <div className="order-category">
                              <h6 className="profile-location text-color fw-bold">Table {order_item_cnt.order_main_dtl[key].table_no} <br />Order {order_item_cnt.order_main_dtl[key].order_no}</h6>
                              <ul className="cricle-dot-ul">
                                <li className="cricle-order-li">
                                  <div className="rounded-cricle">
                                    <Image width={26} height={26} alt="customer_symbol" className="customer-circle " src="/assets/images/Customer_icon.png" />                                    
                                  </div>
                                </li>
                                <li className="cricle-order-li">
                                  <div className="rounded-cricle">
                                    <span className="rounded-circle Navy-Blue p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0">{order_item_cnt.order_main_dtl[key].waiter_assigned}</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-1">
                            <div className="order-category">
                              <h5 className="text-color waiters-datetime text-end">{order_item_cnt.fulfillment_wise_item_cnt[key]}/{order_item_cnt.order_main_dtl[key].order_wise_total_items}</h5>
                              <h5 className="profile-location order-text text-pink fw-bold p-0 m-0 pt-2"></h5> 
                              <h5 className="profile-location order-text text-color fw-bold order-line-height text-end">{order_item_cnt.order_main_dtl[key].preparing_time}</h5>
                            </div>
                          </div>
                        </div>
                        <hr className="order-line m-0"></hr>
                        <div className="create-price d-flex justify-content-center">
                          <h3 className="over-text text-pink fw-bold"></h3> 
                        </div>
                        
                        <div className="prev-orders">
                        {value.map((item,index) => 
                            
                        <>
                          <div key={index} className={`d-flex justify-content-between pt-2 ${order_item_cnt.order_main_dtl[key].order_item_status === 'Start'?"text-overly":""}`}>
                            <div className="p-1 pb-0 mb-0">
                              <div className="order-category">
                                <h6 className="profile-location text-color fw-bold">{item.quantity}x
                                  <span className="profile-location text-color fw-bold extra-data">{item.name}</span>
                                </h6>
                                <span className="profile-location text-pink start-first fw-bold extra-data"></span>
                              </div>
                            </div>
                          </div>
                          <div className={`d-flex justify-content-between ${order_item_cnt.order_main_dtl[key].order_item_status === 'Start'?"text-overly":""}`}>
                              <div className="order-category">
                              <ul className="cricle-btn-ul order-first-item confirm-list">
                                {item.modifier_group.length>0 && item.modifier_group.map((modifier,index)=>
                                <li key={index} className="text-color peragraph order-line-height">• {modifier.name}</li>
                                )}
                              </ul> 
                                <h6 className="text-pink extra-item btn-table-order fw-bold mb-0">{item.prepared_time_mnts} </h6>
                              </div>
                          </div>
                          </>
                          )}
                          </div>
                        
                        <hr className="order-line m-0"></hr>
                        <div className="d-flex justify-content-center mt-3">
                          <div className="builder">
                        {order_item_cnt.order_main_dtl[key].order_item_status === 'Completed' || order_item_cnt.order_main_dtl[key].order_item_status === 'Ready_to_deliver'?(                        
                            <button className="menu-item  dashboard-green-btn" >Completed
                              </button>                          
                        ):""}
                        </div>
                        </div>
                      </div>
                    </div>
                    )):""}                  

                    <span className="item-oredr-details break"></span>
                    <span className="item-oredr-details break"></span>
                    <span className="item-oredr-details break"></span>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
      {isEditItemModalOpen && (
        <EditItemModal isOpen={isEditItemModalOpen} onClose={this.openEditItemModal} data_frm_parent={edit_information} onSubmit={this.updatestatus} />
      )}

      {isDeleteItemModalOpen && (
        <DeleteItemModal isOpen={isDeleteItemModalOpen} onClose={this.openDeleteItemModal} onSubmit={this.onorderitemremove} data_frm_parent={edit_information} />
      )}
      </>

    );
  }
}
