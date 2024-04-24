import React, { Component } from 'react';

export default class ConfirmTableStatusModal extends Component {

    constructor(props){
        super(props);
    } 

    componentDidMount(){
        this.setState({ data :this.props})
    }

    updateStatus=()=>{
        this.props.onsubmit("Update")
    }
    

    render() {
        const { isOpen, onClose, argv} = this.props;
        if (!isOpen) return null;

    return (
    <> 
        <div className="modal-overlay" >
            <div className="modal-dialog">
                <div className="modal-content mx-auto" id='pink-add-comment'>

                <div className="modal-header border-0 justify-content-center">
            <h3 className="modal-title text-welcome pt-2 ">{argv.name}<br />{argv.zone}</h3>
          </div>
          <div className="modal-body border-0 m-0  pt-0">
          <p className='Florentine-pera text-center mt-3'>Are you sure you want to change the status of the table?</p>
          </div> 
          <div className="modal-footer border-0">
          <button type="submit" className='waiter_btn bg-btn-button bg-btn-text radius arrow-con border border-0 fw-bold w-100 mt p-2' onClick={this.updateStatus}>Yes</button>
          <button type="button" className='waiter_btn bg-btn-button bg-btn-text radius arrow-con border border-0 fw-bold w-100 mt p-2' onClick={onClose}>No</button>
          </div>
                </div>
            </div>
        </div>
    </>
    );
  }
}
