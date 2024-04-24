import React, { Component } from "react";

export default class ResetAssignTableModal extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit=()=>{
    this.props.onSubmitreset("Clear")
  }

  render() {
    const { isOpen, onClose } = this.props;
    if (!isOpen) return null;

    return (
      <>
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content mx-auto" id="pink-add-comment">
              <h6 className="menu-item text-color text-start fw-bold ">Reset Assigned Tables</h6>
              <hr className='p-0 m-0'></hr>
              <h3 className='profile-location waiter-heading text-pink mt-2'>Are you sure you want to reset the
                assigned tables?<br/><br/>This cannot be undone.</h3>              
              <div className="d-flex justify-content-end mt-5">
                <div className="builder">
                  <button type="submit" className="menu-item right dashboard-green-btn delete-dashboard" onClick={this.onSubmit}>Yes</button>
                </div>
                <div className="builder">
                  <button type="button" className="menu-item right dashboard-pink-btn delete-dashboard" onClick={onClose}>No</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
