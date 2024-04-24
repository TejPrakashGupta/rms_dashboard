import React from "react";
// import OrderedCollectedpop from './OrderedCollectedpop';
import WaitersHeader from "../../src/layouts/WaitersHeader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CollectOrderModal from "./collectordermodal";
import Image from "next/image";
import Link from "next/link";
export default class OrderAssembly extends React.Component {
    constructor(props){
        super(props)
        this.state={isOrderCollectedModalOpen:false,user:{},dashboard:[],prepared_item:'',order_info:[],order_item:[],order_item_images:{},order_count:0, 
        Order_id:'', max_time:'', iscollected:'',assembled_count:'',Order_item_count:'', Ordered_item:"",prepared_ordered_item:[],selectedCheckboxes:{}, collectedCheckboxes:{},order_index:"" }
    }

    componentDidMount() { 
      this.getorders(); 
      this.gettable("current");
      var date= new Date();
      date.setDate(date.getDate()+7);
      // console.log("Date: ", date)
    }   
  
    async getorders() {
      var res = await app.get("/dashboard/dashboard-table-assign");
      if (res.status) {
        this.setState({ dashboard: res.data.all_dashboards });
      this.setState({user:res.data.login_info});
      }
    }

    current_order=()=>{
      this.setState({order_info:[]})
      this.setState({order_item:[]})
      this.setState({order_item_images:{}})
      this.gettable('current')
    }
  
    previous_order=()=>{
      this.setState({order_info:[]})
      this.setState({order_item:[]})
      this.setState({order_item_images:{}})
      this.gettable('previous')
    }

    async gettable(order_status) {
      console.log("order_Status: ", order_status)
      var res = await app.post("/dashboard-assembly/orders",{fulfillment_area: sessionStorage.getItem("fulfillment"), order_status, call_type:"assembly"});
      if(res.status){
        console.log("Response: ", res.data)
        this.setState({order_info: res.data.order})
        this.setState({order_count: res.data.order_status_count})
        this.setState({order_item_images: res.data.item_images}) 
        this.setState({prepared_ordered_item: res.data.prepared_ordered_item}) 
        setInterval(()=>{
          const currentDateTime = new Date();
        for ( const key in res.data.order){
          const orderData = res.data.order[key];
          if(orderData.order_start_time && orderData.order_status_alias === 'Open'){
            const prperationTime = this.calculateTimeDifference(orderData.order_start_date, orderData.order_start_time,currentDateTime);
            if(prperationTime){
              this.setState({preperation_Time:prperationTime})
              this.setState((prevstate)=>{return{order_preperation_time:{...prevstate.order_preperation_time,[key]:prperationTime}}});
              orderData.formattedpreperationTime = this.formatTime(prperationTime);
            }
          }
          if(orderData.max_prepared_time){
                const time1 = orderData.max_prepared_time.split(':').map(Number);
                const second = (time1[0]*3600 + time1[1]*60 + time1[2])*1000
                this.setState((prevstate)=>{return{order_max_preperation_time:{...prevstate.order_max_preperation_time,[key]:second}}});
                this.setState({max_preperation_time:second})
          }
        }
      }, 1000)
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

    calculateTimeDifference(date, time, currentDateTime) {
      const orderDateTime = new Date(`${date}T${time}`);
      const timeDifference = currentDateTime - orderDateTime;
      return timeDifference;
    }

    formatTime(seconds) {
      // console.log("tej_seconds: ", seconds)
      if(seconds===undefined){
        return '00:00:00'
      }
      else{
      const hours = Math.floor(seconds / 3600000);
      const minutes = Math.floor((seconds % 3600000) / 60000);
      const remainingSeconds = Math.floor((seconds   % 60000) / 1000);
      // console.log("tej: ", hours)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      }
    }

    getorderitemdetails=(e,index,time,order_id)=>{
      e.preventDefault();
      console.log("Checking")
      this.setState({order_index: index})
      this.setState({order_item:this.state.order_info[index].item_detail})
      this.setState({assembled_count:(this.state.order_info[index].item_detail).filter(item=>item.is_assembled ==='1').length})
      this.setState({order_item_count:this.state.order_info[index].item_detail.length})
      this.setState({Order_id:order_id})
      this.setState({max_time:time})
    }

    openOrderCollected=()=>{
        this.setState({isOrderCollectedModalOpen:!this.state.isOrderCollectedModalOpen})
    }

    itemassembled=async(e, order_item_uid,order_id,prepared_item,ordered_item)=>{
      const {checked} = e.target
      console.log("Order_item_id: ", order_id,order_item_uid,)
      console.log("Checked: ", e.target.checked)
      if(checked && prepared_item === ordered_item){
        this.setState({ selectedCheckboxes: {...this.state.selectedCheckboxes,[order_item_uid]: true }});
        var res = await app.post("/dashboard-assembly/order-to-assembled",{order_id,order_item_uid,is_assembled:e.target.checked}) 
        if(res.status){
          app.toast(res.message, 'success');
          this.gettable("current");
          this.getorderitemdetails(e,this.state.order_index,this.state.max_time,this.state.Order_id)
        }
      }
    }

    openCollectedModal=(e,collected)=>{
      this.setState({isOrderCollectedModalOpen: !this.state.isOrderCollectedModalOpen})
      this.setState({Ordered_item: collected})
    }

    getcollectedstatus= async(value)=>{
      if(value==="Yes"){
        this.setState({collectedCheckboxes: {...this.state.collectedCheckboxes, [this.state.Ordered_item]:true}})
        this.setState({isOrderCollectedModalOpen: false})
        var res = await app.put("/dashboard-assembly/order-status", {Ready_to_deliver:"Ready_to_deliver", order_id:this.state.Order_id})
        console.log("Response: Order Delivered1", res)
        if(res.status){
          console.log("Response: Order Delivered")
          app.toast(res.message, 'success');
          this.gettable("current");
          this.setState({order_item:""})
          this.setState({order_item_count:""})
        }
      }
    }

  render() {
    const{isOrderCollectedModalOpen,user, dashboard,order_info,order_item,order_item_images,max_time,order_item_count,assembled_count,iscollected,
      order_count,prepared_ordered_item,selectedCheckboxes,collectedCheckboxes} = this.state
      console.log("Count: ", assembled_count, order_item_count)
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
                <div className="table-waiters-btn">
                  <button className="btn-radius btn-table yellow-btn border-0 table-link  text-white">New: {order_count?(order_count.New):"0"}</button>
                  <button className="btn-radius btn-table side-table-btn dark-sky-bg border-0 table-link text-white">Open: {order_count?(order_count.Open):"0"}</button>
                  <button className="btn-radius btn-table side-table-btn Navy-Blue border-0 table-link text-white">Completed: {order_count?(order_count.Completed):"0"}</button>
                </div>
              </div>
              <TabPanel>
                <div className="row">
                  <div className="col-lg-12 ">
                    <div className="row bg-light-gray waiters-nav pt-3 pb-5">
                      <div className="row">
                        <div className="col-md-4">
                          <h5 className="table-link text-secondary fw-bold">
                            Orders
                          </h5>
                          <hr></hr>
                          <div className="custom-scroll-cat">
                          {order_info && order_info.map((order_data, index)=>
                          <div key={index} className="drop_card main-category mt-2 w-100" >
                            <div className="drop_data drop_card bg-white" onClick={(e)=>this.getorderitemdetails(e,index,order_data.max_prepared_time, order_data.order_id)}>
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
                                        <Image src="/assets/images/Customer_icon.png" alt="Logo" width={24} height={24} ></Image>
                                      </div>
                                    </li> 
                                    ):
                                    <li className="cricle-order-li">
                                      <div className="rounded-cricle">
                                        <span className="rounded-circle Navy-Blue p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0">
                                        {order_data.waiter}
                                        </span>
                                      </div>
                                    </li>} 
                                    {order_data.fulfillment && order_data.fulfillment.map((area,index1)=>
                                    <li key={index1} className="cricle-order-li">
                                      <div className="rounded-cricle">
                                        <span className="rounded-circle bg-black p-1 myorder-rounded dashboard-cricle my-order-cricle text-white m-0">{area}</span>
                                      </div>
                                    </li>
                                    )}
                                                                       
                                  </ul>
                                </div>
                                <div className="order-category">
                                  <h5 className="text-color fw-bold text-end">
                                    {order_data.prepared_items}/{order_data.total_items}
                                  </h5>
                                  {/* <h5 className="profile-location order-text text-pink fw-bold p-0 m-0 pt-2">
                                    -{this.state.max_preperation_time>this.state.preperation_time && order_item_cnt.order_main_dtl[key].order_item_status === 'Complete'?(this.formatTime(this.state.order_max_preperation_time[key] - this.state.order_preperation_time[key])):(this.formatTime(this.state.max_preperation_time))} </h5> 
                              <h5 className="profile-location order-text text-color fw-bold order-line-height text-end">
                                {order_item_cnt.order_main_dtl[key]?.order_item_status === 'Complete' && this.state.order_preperation_time?(this.formatTime(this.state.order_preperation_time[key])):"00:00:00"}</h5> */}


                                  <h5 className="profile-location order-text text-pink fw-bold  p-0 m-0">
                                  -{this.state.max_preperation_time>this.state.order_preperation_time?(this.formatTime(this.state.max_preperation_time[index] - this.state.order_preperation_time[index])):(this.formatTime(this.state.max_preperation_time))}</h5>
                                    {/* -{(this.formatTime(this.state.max_preperation_time))}</h5> */}
                                  <h5 className="profile-location order-text text-color fw-bold qr-peragraph text-end">
                                  {this.state.order_preperation_time?(this.formatTime(this.state.order_preperation_time[index])):"00:00:00"}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                          )}
                          </div>                          
                        </div>
                        
                        <div className="col-lg-8 ">
                          <h5 className="table-link text-secondary fw-bold">
                            Order Items
                          </h5>
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
                                          <Image src={order_item_images[items.items_id] && order_item_images[items.items_id].img_url?(order_item_images[items.items_id].img_url):"Check"} alt="item_image" width={120} height= {73} className="MyOrders-img" />
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
                                        {/* <h3 className={`text-center customer-process ${items.item_prepared_qty && items.item_prepared_qty>0?"text-green":"text-red"}`}>
                                        {items.item_prepared_qty?(items.item_prepared_qty):0}
                                        </h3> */}
                                        <h4 className="text-color fw-bold text-center profile-location process-customer">
                                          READY
                                        </h4>
                                      </div>
                                      <div className='ordered'>
                                        <div className="new mx-auto text-center mt-2">
                                          <form>
                                            <div className="form-group-order">
                                            {/* items.item_prepared_qty */}
                                              <input type="checkbox" id={`html_${index2}`} onChange={(e)=>this.itemassembled(e,items.order_item_uid,items.order_id,items.item_qty,prepared_ordered_item[items.order_items_id].Ready)} checked={selectedCheckboxes[items.order_item_uid] === true ? true : (items.is_assembled === "1")} />
                                              <label htmlFor={`html_${index2}`} style={{ border: prepared_ordered_item[items.order_items_id] && items.item_qty <= prepared_ordered_item[items.order_items_id].Ready ? '3px solid #00d384' : '3px solid #ff2257' }}></label>
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
                          
                          )):(<div className="assembly">Please select an order to view all the items</div>)}
                          { assembled_count===order_item_count?(
                          <div className='row'>
                            <div className="text-right collected mt-3"> 
                              <div className='d-flex justify-content-end'>
                                <div className='create-collected' data-bs-toggle="modal" data-bs-target="#OrderedCollectedpop">
                                  <div className='collected-order'>
                                    <div className="form-group-order">
                                      <input type="checkbox" id="collected" onChange={(e)=>this.openCollectedModal(e,this.state.Order_id)} checked={collectedCheckboxes[this.state.Order_id] === true}/>
                                      <label htmlFor="collected" className='right-collect last-check'>
                                        <span className='text-color collected-done fw-bold profile-location'>COLLECTED </span>
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
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
              <div className="row">
                  <div className="col-lg-12 ">
                    <div className="row bg-light-gray waiters-nav pt-3 pb-5">
                      <div className="row">
                        <div className="col-md-4">
                          <h5 className="table-link text-secondary fw-bold">
                            Orders
                          </h5>
                          <hr></hr>
                          {order_info && order_info.map((order_data, index6)=>
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
                                        {/* rounded-circle p-1 myorder-rounded dashboard-cricle my-order-cricle img-top-cricle bg-black text-white m-0 */}
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
                          )}                          
                        </div>
                        
                        <div className="col-lg-8">
                          <h5 className="table-link text-secondary fw-bold">
                            Order Items
                          </h5>
                          <hr></hr>
                          
                          {order_item.length>0?(order_item.map((items,index8)=>
                          <>
                          <div key={index8} className="drop_card main-category mt-2 w-100">
                            <div className="drop_data drop_card bg-white">
                              <div className="align-center drop-item p-2">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="d-flex justify-content-start">
                                      <div className="order-item-list">
                                        <div className="order-img">
                                          <Image src={order_item_images[items.items_id] && order_item_images[items.items_id].img_url?(order_item_images[items.items_id].img_url):"Check"} alt="item_image" width={120} height= {73} className="MyOrders-img" />
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
                                          {items.modifier_group.length>0 && items.modifier_group.map((modifier,index9)=>
                                          <li key={index9} className="text-color peragraph order-line-height">• {modifier.name} </li>                                          
                                          )}
                                          {items.extra_group.length>0 && items.extra_group.map((extra,index10)=>
                                          <li key={index10} className  ="text-color peragraph order-line-height">• {extra.name} </li>                                          
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
                                      
                                        <h3 className={`text-center customer-process ${items.item_prepared_qty>0?"text-green":"text-red"}`}>
                                        {items.item_prepared_qty}
                                        </h3>
                                        <h4 className="text-color fw-bold text-center profile-location process-customer">
                                          READY
                                        </h4>
                                      </div>
                                      <div className='ordered'>
                                        <div className="new mx-auto text-center mt-2">
                                          <form>
                                            <div className="form-group-order" >
                                              <input type="checkbox" id={`html_ ${index8}`} checked />
                                              <label htmlFor={`html_ ${index8}`} style={{ border: '3px solid #00d384' }}></label>
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
                              <p className='item-price text-end'>Order completed at </p>
                              <p className='item-price text-end'>08:44, 19 April 2023</p>
                            </div> 
                              <p className='item-price text-end'></p>
                          </div>                             
                        ):""}
                        </div>
                        
                      </div>
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
  )}
  </>
    );
  }
}
