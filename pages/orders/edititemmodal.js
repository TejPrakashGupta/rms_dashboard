import Image from "next/image";
import React, { Component } from "react";

export default class EditItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = { order_info:[],modifier_info:[],modifier_count:"", number:0, selected_id:'', modifier_infor:[], selectedOption: null};
  }
  componentDidMount(){
    this.getmodifierdata();
    console.log("order_info: ", this.props.data_frm_parent);
    this.setState({order_info:this.props.data_frm_parent})
    this.setState({modifier: this.props.data_frm_parent.modifier_group_ids})
    // console.log("Modifier: ",this.props.data_frm_parent.modifier_group_ids)
  }

  
  async getmodifierdata() {
    var res = await app.post("/dashboard-waiter/item-info",{item_id: this.props.data_frm_parent.items_id , page_type:"dashboard"});
    if(res.status){
        // console.log("Response: ", res.data)
        this.setState({modifier_info: res.data.item_info.item_modifier_group.dropdown})
        this.setState({modifier_count: res.data.item_info.item_modifier_group.dropdown.length-1})
    }
  }
  countupdate=(e)=>{
    if(e.target.name==="increase"){
      this.setState({number:this.state.number+1})
    }
    if(e.target.name==="decrease"){
      this.setState({number:this.state.number-1})
    }
  }

  defaultselected=(e,value)=>{
      this.setState({ selected_id: value });
      console.log("Default_selected_id: ", value)
  }

    handleOptionChange = (label, optionId) => {
        
        this.setState((prevState) => ({
              selectedOption: {...prevState.selectedOption,
                    [label]: optionId },
                        }));
    };

    updatemodifier=async()=>{
      var res = await app.put("/dashboard-orders/update-options", {order_id: this.state.order_info.order_id, order_item_uid: this.state.order_info.order_item_uid, group_options: this.state.selectedOption})
      if(res.status){
        this.props.onSubmit("Updated")
        app.toast(res.message, res.type)
      }
    }

  render() {
    const {order_info, modifier_info,number,modifier_count, selected_id,modifier} = this.state
    // console.log("modifier_info: ", modifier_info, number, modifier_count,selected_id)
    const { isOpen, onClose } = this.props;
    if (!isOpen) return null;
    console.log("this.state.selectedOption", this.state.selectedOption)

    return (
      <>
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content mx-auto" id="pink-add-comment">
            <div class="modal-header border border-0 pb-0">
            <h6 class="menu-item text-color text-start fw-bold pt-0">{order_info.name}</h6>
              <button class="btn-close dismis" data-bs-dismiss="modal" aria-hidden="true" onClick={onClose}>
                </button>
                </div>
              <div class="d-flex justify-content-between pt-2">
                <div class="p-1">
                  <div class="order-category">
                    

                    <h5 className="heading text-color fw-bold pt-2">{modifier_info.length?(modifier_info[number].name):""}</h5>
                    {modifier_info.length && modifier_info[number].modifier_group_items_arr? (modifier_info[number].modifier_group_items_arr.map((option,index)=>
                    <div key={index} class="form-check">
                      <input 
                      type="radio" 
                      class="form-check-input" 
                      id={`radioRare ${index}`} 
                      name="radio" 
                      value={option.id} 
                      checked={
                        this.state.selectedOption && this.state.selectedOption[modifier_info[number].label]
                        ? this.state.selectedOption[modifier_info[number].label] === option.id
                        : modifier.includes(String(option.id))
                        }
                      onChange={() => this.handleOptionChange(modifier_info[number].label, option.id)}/>

                      <span class="peragraph fw-bold text-color">{option.display_name}</span>                   
                    </div>
                    )):(<div height={50}></div>)}
                                        
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-between mt-3">
                <div class="builder">
                  <button class="menu-item right dashboard-green-btn" onClick={this.updatemodifier}>Save</button>
                </div>
                
                {modifier_count>1?(
                  <div class="builder d-flex justify-content-between ac">
                    <div class="popup-icon-delete">
                    {number === 0 ?(                    
                      <Image src="/assets/images/previous-icon.png" width={20} height={20} alt="prev_item" className="dashboard-prenext" name="decrease" />
                    ):(
                      <Image src="/assets/images/previous-icon.png" width={20} height={20} alt="prev_item" className="dashboard-prenext" name="decrease" onClick={(e)=>this.countupdate(e)}/>
                    )}
                    </div>
                    
                    <div class="popup-icon-delete">
                    {number === modifier_count ?(
                      <Image src="/assets/images/next-icon.png" width={20} height={20} alt="next_item" className="dashboard-prenext" name="increase" />
                    ):(
                    <Image src="/assets/images/next-icon.png" width={20} height={20} alt="next_item" className="dashboard-prenext" name="increase" onClick={(e)=>this.countupdate(e)} disabled={number === modifier_count} />
                    )}
                    </div>
                  </div>
			          ):""}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
