import React, { Component } from "react";

export default class CollectOrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = { comment: "" };
  }

  

  sendcollectedstatus = () => {
    this.props.onSubmit("Yes")
  };

  render() {
    const { isOpen, onClose } = this.props;
    if (!isOpen) return null;

    return (
      <>
        <div className="modal-overlay">
          <div className="modal-dialog modal-sm">
            <div className="modal-content mx-auto" id="pink-add-comment">
              <h6 className="menu-item text-color text-start fw-bold ">Ordered Collected</h6>
              <hr className='p-0 m-0'></hr>
              <h3 className='profile-location waiter-heading text-color mt-2'>Are you sure all items in the
                    order is assembled and collected?</h3>
              
              <div className="d-flex justify-content-end mt-5">
                <div className="builder">
                  <button type="submit" className="menu-item right dashboard-green-btn delete-dashboard" onClick={this.sendcollectedstatus}>Yes</button>
                </div>
                <div className="builder">
                  <button className="menu-item right dashboard-pink-btn delete-dashboard" onClick={onClose}>No</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
