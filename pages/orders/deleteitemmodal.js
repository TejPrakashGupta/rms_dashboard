import React, { Component } from "react";

export default class DeleteItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = { order_info: "", select:"1"};
  }

  componentDidMount(){
    this.setState({order_info:this.props.data_frm_parent})
  }

  selectionOption=(e)=>{
    console.log("Radio selected: ", e.target.name)
    this.setState({select:e.target.value})
  }

  onSubmit= async(e, order_id,order_item_uid)=> {
    var res = await app.put("/dashboard-waiter/order-item-delete",{order_id, order_item_uid, delete_reason: this.state.select});
    if(res.status){
        console.log("Response: ", res.data)
        app.toast(res.message, res.type)
        this.props.onSubmit("removed")
        this.props.onClose();
    }
    else{
      app.toast(res.message, res.type)
    }
  }


  render() {
    const { isOpen, onClose } = this.props;
    const {order_info,select} = this.state;
    console.log("Order-info1: ", order_info)
    if (!isOpen) return null;

    return (
      <>
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content mx-auto" id="pink-add-comment">
              <h6 class="menu-item text-color text-start fw-bold ">Delete Item</h6>
              <hr className='p-0 m-0'></hr>
              <h6 class="menu-item text-color text-start fw-bold pt-0 mt-3 mb-3">{order_info.name}</h6>
              <hr className='p-0 m-0'></hr>
              <h3 className='profile-location waiter-heading text-color mt-2'>Reason for deletion</h3>
              <div className='d-flex justify-content-between mt-2'>
                <div className='builder'>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="Out-of-stock" name="Out-of-Stock" value="1" checked={select==="1"} onClick={(e)=>this.selectionOption(e)}/>
                    <span class="peragraph fw-bold text-color">Out of stock</span>
                  </div>
                </div>
                <div className='builder'>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="Customer-Choice" name="Customer-Choice" value="2" checked={select==="2"} onClick={(e)=>this.selectionOption(e)}/>
                    <span class="peragraph fw-bold text-color">Customer’s Choice</span>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end mt-5">
                <div class="builder">
                  <button class="menu-item right dashboard-green-btn delete-dashboard" onClick={(e)=>this.onSubmit(e,order_info.order_id,order_info.order_item_uid )}>Save</button>
                </div>
                <div class="builder">
                  <button class="menu-item right dashboard-pink-btn delete-dashboard" onClick={onClose}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
