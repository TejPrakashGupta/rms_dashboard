import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import WaitersHeader from '../../src/layouts/WaitersHeader';
import Image from "next/image";
import CollectOrderModal from "../assembly/collectordermodal";
import Link from 'next/link';
export default class Waiters extends React.Component{
    constructor(props){
        super(props)
        this.state={table_info:[], zone_info:[],dashboard:[], order_status_count:[], prepared_ordered_item:[], order_count:[], item_images:[], order:[], order_length:0,
            order_item:[],assembled_count:'', user:{},  order_item_count:'',iscollected:'', role_id:'', table_cnt:[]}
    }

    componentDidMount() { 
      this.getwaitertables(); 
      this.getassignedtable();
      this.getwaiterorders();
      
    }

    async getassignedtable() {
        var res = await app.get("/dashboard/dashboard-table-assign");
        if (res.status) {
          this.setState({ dashboard: res.data.all_dashboards });
          this.setState({user:res.data.login_info})
          this.setState({role_id: res.data.login_info.role_id})
        }
        else{
          app.toast(res.message, 'warning');
        }
      } 
    
  
    async getwaiterorders() {
      var res = await app.post("/dashboard-waiter/orders",{call_type:this.state.role_id===2?"waiter_dashboard":""});
      if(res.status){
        console.log("Response: ", res.data)
        this.setState({order_info: res.data.order})
        this.setState({order_length: res.data.order.length})
        this.setState({order_count: res.data.order_status_count})
        this.setState({order_item_images: res.data.item_images}) 
        this.setState({prepared_ordered_item: res.data.prepared_ordered_item}) 
        
       }
       else{
        this.setState({order_info: []})
        this.setState({order_count: 0})
        this.setState({order_item_images:{} }) 
        this.setState({order_item:[]})
        this.setState({assembled_count:''})
        this.setState({order_item_count:''})
        this.setState({Order_id:''})
        this.setState({max_time:''}) 
       }
    }

    async getwaitertables() {
        var res = await app.post("/dashboard-waiter/tables",{call_type:this.state.role_id===2?"waiter_dashboard":""});
        if (res.status) {
          this.setState({ table_info: res.data.table_data });
          this.setState({ zone_info: res.data.zone_combo });
          this.setState({ table_cnt: res.data.tbl_status_cnt})
          console.log("Response: ", res)
        }
        if(!res.status)
        {
          this.setState({table_info: []})
          this.setState({zone_info: []})
        }
      }

      getorderitemdetails=(e,index,time,order_id)=>{
        e.preventDefault();
        this.setState({order_item:this.state.order_info[index].item_detail})
        this.setState({assembled_count:(this.state.order_info[index].item_detail).filter(item=>item.is_assembled ==='1').length})
        this.setState({order_item_count:this.state.order_info[index].item_detail.length})
        this.setState({Order_id:order_id})
        this.setState({max_time:time})
      }

      itemassembled=async(e, order_item_uid,order_id)=>{
        console.log("Order_item_id: ", order_id,order_item_uid,)
        console.log("Checked: ", e.target.checked)
        var res = await app.post("/dashboard-assembly/order-to-assembled",{order_id,order_item_uid,is_assembled:e.target.checked}) 
        if(res.status){
          app.toast(res.message, 'success');
          this.gettable("current");
          // console.log("order_info1234: ", this.state.order_info)
          // this.setState({order_item:this.state.order_info[1].item_detail})
        }
      }

      getcollectedstatus= async(value)=>{
        if(value==="Yes"){
          this.setState({iscollected:1})
          this.setState({isOrderCollectedModalOpen: false})
          var res = await app.put("/dashboard-assembly/order-status", {Ready_to_deliver:"Ready_to_deliver", order_id:this.state.Order_id})
          console.log("Response: Order Delivered1", res)
          if(res.status){
            console.log("Response: Order Delivered")
            app.toast(res.message, 'success');
            this.gettable("current");
          }
        }
      }

render(){
  const {isOrderCollectedModalOpen,table_info,zone_info,dashboard,user,order_length,order_item, order_item_images,order_info,iscollected,order_item_count,max_time,assembled_count,prepared_ordered_item,table_cnt}= this.state
  console.log("Order_infor: ", order_info)
  console.log("table_info,zone_info: ", table_info,zone_info)
  return(
    <>
    <div className="container-fluid">
        <div className='row'>
        <WaitersHeader dashboard={dashboard} user_info={user}/>
        </div>
        <div className='row'>
            <div className='col-lg-12'>
                <Tabs>
                <div className='d-flex justify-content-between waiters-nav'>
                    <div className='btn_table'>
                        <TabList>
                            <Tab>My Tables</Tab>
                            <Tab>My Orders</Tab>
                        </TabList>
                    </div>
                    <div className='btn_table '>
                        <button className='btn-radius btn-table vived-red border-0 table-link text-white'>Occupied: {table_cnt.Occupied}</button>
                        <button className='btn-radius btn-table side-table-btn dark-sky-bg border-0 table-link text-white'>Reserved: {table_cnt.Reserved}</button>
                        <button className='btn-radius btn-table side-table-btn Navy-Blue border-0 table-link text-white'>Open: {table_cnt.Open}</button>
                    </div>
                </div>
            <TabPanel>
            <div className='row waiters-nav'>
                <div className='col-lg-8 '>
                    <div className="trikolore">
                      {table_info && table_info.length>0?(table_info.map((table,index)=>
                        <div key={index} className="dashboard-card border border-0 d-flex">
                            <div className='table-waiters-card' style={{ backgroundColor: table.table_status_color }}>
                            <h4 className='profile-location text-white'>{table.name}<br/>{zone_info.filter(zone => zone.id === table.zone_id)[0].name}<br/>{table.status_name}</h4>
                            </div>
                        </div>
                        )  
                      ):("There is no information to display")}            
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='mobile-sereenshot text-end'>
                        <Image width={343} height={478} alt="mobile_view" src="/assets/images/toro-mobile-screen.png" className="mobile-screen mt-3"/>
                    </div>
                </div>
            </div>
            </TabPanel>
            <TabPanel>
            <div className='row bg-light-gray waiters-nav pt-3 pb-5'>
                <div className='row'>
                    <div className='col-md-4'>
                        <h5 className='table-link text-secondary fw-bold'>Orders ({order_length})</h5>
                        <hr></hr>
                        {order_info && order_info.length>0?( order_info.map((order_data, index6)=>
                          <div key={index6} className="drop_card main-category mt-2 w-100" >
                            <div className="drop_data drop_card bg-white" onClick={(e)=>this.getorderitemdetails(e,index6,order_data.max_prepared_time)}>
                              <div className="d-flex justify-content-between align-center drop-item p-2">
                                <div className="order-category">
                                  <h6 className="peragraph text-color fw-bold">
                                    Table {order_data.table_no}<br />
                                    Order {order_data.order_no}
                                  </h6>
                                  <ul className="cricle-dot-ul">

                                    {order_data.created_by === "customer"?(
                                    <li className="cricle-order-li">
                                      <div className="rounded-cricle">
                                        {/* <span className="rounded-circle Navy-Blue p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0"> CS</span> */}
                                        <Image src="/assets/images/Customer_icon.PNG" alt="Logo" width={24} height={24} ></Image>
                                      </div>
                                    </li> 
                                    ):""}
                                    <li className="cricle-order-li">
                                      <div className="rounded-cricle">
                                        <span className="rounded-circle Navy-Blue p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0">
                                        {order_data.waiter}
                                        </span>
                                      </div>
                                    </li> 
                                    {order_data.fulfillment && order_data.fulfillment.map((area,index7)=>
                                    <li key={index7} className="cricle-order-li">
                                      <div className="rounded-cricle">
                                        <span className="rounded-circle bg-black p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0">
                                          {area}
                                        </span>
                                      </div>
                                    </li>
                                    )}
                                                                       
                                  </ul>
                                </div>
                                <div className="order-category">
                                  <h5 className="text-color fw-bold text-end">
                                  8/{order_data.total_items}
                                  </h5>
                                  <h5 className="profile-location order-text text-pink fw-bold  p-0 m-0">
                                    -15:50:00
                                  </h5>
                                  <h5 className="profile-location order-text text-color fw-bold qr-peragraph text-end">
                                  15:50:00
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                          )
                          ):"There are no orders to display"}
                    </div>
                    <div className='col-lg-8'>
                      <h5 className='table-link text-secondary fw-bold'>Order Items</h5>
                      <hr></hr>
                      {order_item.length>0?(order_item.map((items,index2)=>
                          <>
                          <div key={index2} className="drop_card main-category mt-2 w-100">
                            <div className="drop_data drop_card bg-white">
                              <div className="align-center drop-item p-2">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-start">
                                      <div className="order-item-list">
                                        <div className="order-img">
                                          <Image alt="item_image" width={120} height={73} src={order_item_images[items.items_id] && order_item_images[items.items_id].img_url?(order_item_images[items.items_id].img_url):"Check"} className="MyOrders-img" />
                                        </div>
                                        <div className="rounded-cricle create-price">
                                          <span className="rounded-circle p-1 myorder-rounded dashboard-cricle my-order-cricle img-top-cricle bg-black text-white m-0">
                                            {items.fulfillment_by_name}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="order-item-list">
                                        <h5 className="btn-icon peragraph qr-peragraph text-color dragdrop-icon fw-bold  mb-0 pb-1">
                                          {items.name}
                                        </h5>
                                        <ul className="cricle-btn-ul dragdrop-icon">
                                          {items.modifier_group.length>0 && items.modifier_group.map((modifier,index3)=>
                                          <li key={index3} className="text-color peragraph order-line-height">• {modifier.name} </li>                                          
                                          )}
                                          {items.extra_group.length>0 && items.extra_group.map((extra,index4)=>
                                          <li key={index4} className  ="text-color peragraph order-line-height">• {extra.name} </li>                                          
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-between">
                                      <div className="ordered">
                                        <h3 className="text-color text-center customer-process"> {items.item_qty} </h3>
                                        <h4 className="text-color fw-bold text-center profile-location process-customer">
                                          ORDERED
                                        </h4>
                                      </div>
                                      <div className="ordered">
                                      
                                        <h3 className={`text-center customer-process ${prepared_ordered_item[items.order_items_id] && prepared_ordered_item[items.order_items_id].Ready>0?"text-green":"text-red"}`}>
                                        {prepared_ordered_item[items.order_items_id]?.Ready?(prepared_ordered_item[items.order_items_id].Ready):0}
                                        </h3>
                                        <h4 className="text-color fw-bold text-center profile-location process-customer">
                                          READY
                                        </h4>
                                      </div>
                                      <div className='ordered'>
                                        <div className="new mx-auto text-center mt-2">
                                          <form>
                                            <div className="form-group-order" >

                                              <input type="checkbox" id={`html_${index2}`} onChange={(e)=>this.itemassembled(e,items.order_item_uid,items.order_id)} checked={items.is_assembled==="1"} />
                                              <label htmlFor={`html_${index2}`} style={{ border: items.item_qty <= items.item_prepared_qty ? '3px solid #00d384' : '3px solid #ff2257' }}></label>
                                            </div>
                                          </form>
                                          {max_time === items.prepared_time?(
                                          <div className='create-price'>
                                            <span className='process-icon'></span>
                                          </div>
                                          ):""}
                                        </div>
                                        <h4 className='text-color fw-bold text-center profile-location process-customer pt-1'>ASSEMBLED</h4>
                                      </div>  
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          </>
                          // )}
                          )):("Please select an order to view all the items" )}
                          {order_item.length>0 && assembled_count===order_item_count?(
                          <div className='row'>
                            <div className="text-right collected mt-3"> 
                              <div className='d-flex justify-content-end'>
                                <div className='create-collected' data-bs-toggle="modal" data-bs-target="#OrderedCollectedpop">
                                  <div className='collected-order'>
                                    <div className="form-group-order">
                                      {/* <input type="checkbox" id="collected" onChange={(e)=>this.openCollectedModal(e)} checked={iscollected===1}/> */}
                                      <input type="checkbox" id="collected" checked/>
                                      <label htmlFor="collected" className='right-collect last-check'>
                                        <span className='text-color collected-done fw-bold profile-location'>COLLECTED</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ):""}
                    </div>
                </div>
            </div>
    </TabPanel>
     </Tabs>

          </div>
          </div>
          </div>
     
     {isOrderCollectedModalOpen && (
      <CollectOrderModal isOpen={isOrderCollectedModalOpen} onClose={this.openOrderCollected} onSubmit={this.getcollectedstatus} />
    )
  }
  </>
  );
}
}