import React, { Component } from 'react';
import ConfirmTableStatusModal from './confirmtablestatusmodal';
import Router from "next/router";

export default class TableStatusModal extends Component {

    constructor(props){
        super(props);
        this.state={isConfirmTableStatusModalOpen:false, tablestatus:[],status_id:'', info_data:{},table_status:''}
    } 

    componentDidMount(){
        this.setState({ info_data : this.props.args})
        this.get_table_status(); 
    }

    async get_table_status() {
        var res = await app.get('/dashboard/table-status');
        if(res.status)
        this.setState({tablestatus:res.data})
        //console.log(this.state.tablestatus);
    }
     
    openConfirmTableStatusModal =(e,id)=>{ 
        this.setState({isConfirmTableStatusModalOpen:!this.state.isConfirmTableStatusModalOpen})
        this.setState({status_id:id})
        
            }

    get_confirmation =async (value)=>{
        const {info_data} = this.state
        this.setState({isConfirmTableStatusModalOpen:false})
        console.log("Update: ", value)
        if (value==="Update"){
            var res = await app.put('/dashboard/table-status',{id:info_data.id,status:this.state.status_id});
        if(res.status) {
           this.props.onsubmit("status Updated")
        }
        }
    }
    
  
    render() {
        var {tablestatus, info_data} = this.state;
        const { isOpen, onClose, args} = this.props;
        const {isConfirmTableStatusModalOpen} = this.state
        console.log("tablestatus: ", tablestatus)
        if (!isOpen) return null;

    return (
    <> 
        <div className="modal-overlay" >
            <div className="modal-dialog w-50 mx-auto">
                <div className="modal-content w-50 mx-auto" id='pink-add-comment'>

                <div className="modal-header border-0 justify-content-center">
            <h3 className="modal-title text-welcome pt-2 ">{info_data.name}<br />{info_data.zone}</h3>
          </div>
          <div className="modal-body border-0 m-0  pt-0">
          <p className='Florentine-pera text-center mt-3'>Do you want to change the status of the table?</p>
          </div> 
          <div className="modal-footer border-0">
        {tablestatus.length>0 && tablestatus.map((ts,index) =>
            ((ts.name != 'Open' && ts.name != 'Cancel') ? <button type="submit" key={index} className='waiter_btn bg-btn-button bg-btn-text radius arrow-con border border-0 fw-bold w-100 mt p-2' onClick={(e)=>this.openConfirmTableStatusModal(e,ts.id)}>{ts.name}</button>: '')
        )}
          <button type="button" className='waiter_btn bg-btn-button bg-btn-text radius arrow-con border border-0 fw-bold w-100 mt p-2' onClick={onClose}>Cancel</button>
          </div>
                </div>
            </div>
        </div>
        {isConfirmTableStatusModalOpen && (
            <ConfirmTableStatusModal isOpen={isConfirmTableStatusModalOpen} onClose={this.openConfirmTableStatusModal} argv={this.state.info_data} onsubmit={this.get_confirmation}/>
        )}
    </>
    );
  }
}
